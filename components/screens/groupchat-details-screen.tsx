import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Groupchat, GroupMember } from '@/types/slices/user';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import GroupChatAvatar from '../ui/chat/groupchat-avatar';
import { ActionButton, actionButtons } from '@/constants/groupchat';
import useAuth from '@/context/useAuth';
import { useSingleGroupQuery } from '@/services/user/userSlice';
import GroupchatDetailsMember from '../ui/chat/groupchat-details-member';
import GroupchatActionButtons from '../ui/chat/groupchat-action-buttons';
import GroupchatMemberSheet from '../ui/chat/groupchat-member-sheet';
import { Image } from 'expo-image';

const GroupchatDetailsScreen = () => {
  const { groupchat: groupchatString } = useLocalSearchParams();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [selectedMember, setMember] = useState<GroupMember | null>(null);
  const [groupchat, setGroupchat] = useState<Groupchat>(JSON.parse(groupchatString as string));

  const [headerScrolled, setHeaderScrolled] = useState(false);

  useSingleGroupQuery({ id: groupchat.id });

  const member = groupchat.groupMembers.find((m) => m.userId == user?.userId);

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: headerScrolled ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [headerScrolled]);

  const handleActions = (button: ActionButton) => {
    if (button.action == 'add-contact') {
      router.push({
        pathname: '/add-to-group',
        params: { groupchat: JSON.stringify(groupchat) },
      });
    } else if (button.action == 'search') {
      router.push({
        pathname: '/groupchat-message',
        params: {
          id: groupchat.id,
          name: groupchat.name,
          members: JSON.stringify(groupchat.groupMembers),
          groupchat: JSON.stringify(groupchat),
          isSearch: 'true',
        },
      });
    }
  };

  return (
    <SafeAreaView
      edges={[]}
      style={{
        flex: 1,
        paddingHorizontal: insets.left,

        paddingBottom: insets.bottom,
      }}
      className="bg-[#141718]">
      <Animated.View
        className="w-full flex-row items-center justify-between p-4"
        style={{
          backgroundColor: headerOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)'],
          }),
          paddingTop: insets.top + 20,
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center">
          <Ionicons name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Group info</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/edit-group',
              params: { groupchat: JSON.stringify(groupchat) },
            })
          }
          className="h-10 w-10 items-center justify-center ">
          <Ionicons name="pencil-sharp" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="justify-center pt-8 p-4"
        scrollEventThrottle={16}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setHeaderScrolled(offsetY > 40);
        }}
        showsVerticalScrollIndicator={false}>
        <View className="mx-auto">
          {groupchat.photo ? (
            <Image
              source={{ uri: groupchat.photo }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
          ) : (
            <GroupChatAvatar
              width={80}
              containerWidth={100}
              position={12}
              names={groupchat.groupMembers.map((m) => m.user.name)}
            />
          )}
        </View>

        <Text className="mt-4 w-full flex-1 text-center text-2xl font-bold text-white">
          {groupchat.name}
        </Text>
        <Text className="mt-1 w-full flex-1 text-center font-semibold text-[#ca8a04]">
          {groupchat.groupMembers.length} members
        </Text>
        <View className="flex-row items-center justify-between">
          {actionButtons.map((button, index) => (
            <GroupchatActionButtons button={button} handleAction={handleActions} key={index} />
          ))}
        </View>
        <View className="mt-4 rounded-xl bg-[#212121] p-4">
          {groupchat.groupMembers.map((member) => (
            <GroupchatDetailsMember member={member} setMember={setMember} key={member.id} />
          ))}
        </View>
        {selectedMember && member && (
          <GroupchatMemberSheet
            member={member}
            groupchat={groupchat}
            selectedMember={selectedMember}
            setGroupchat={setGroupchat}
            setMember={setMember}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupchatDetailsScreen;
