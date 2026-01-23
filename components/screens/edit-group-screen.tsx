import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Groupchat } from '@/types/slices/user';
import useGroupChat from '@/hooks/useGroupchat';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import GroupChatAvatar from '../ui/chat/groupchat-avatar';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { helpers } from '@/utils/helpers';

const EditGroupScreenComponent = () => {
  const { groupchat: groupchatString } = useLocalSearchParams();
  const { editRoom } = useGroupChat({});

  const groupchat: Groupchat = JSON.parse(groupchatString as string);

  const [name, setName] = useState(groupchat.name);
  const [image, setImage] = useState<string | null>(groupchat.photo);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    setSubmitting(true);
    const photo = image && image !== '' ? await helpers.convertToBase64(image) : '';
    editRoom({ roomId: groupchat.id, name, photo }, (gc) => {
      if (gc) {
        router.dismiss();
        setSubmitting(false);
        setTimeout(() => {
          router.push({
            pathname: '/groupchat-message',
            params: {
              id: gc.id,
              name: gc.name,
              members: JSON.stringify(groupchat.groupMembers),
              groupchat: JSON.stringify({ ...groupchat, name: gc.name, photo: gc.photo }),
            },
          });
        }, 50);
      }
    });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#141718]">
        <View
          style={{ paddingTop: 20, padding: 24 }}
          className="z-10 w-full flex-row items-center justify-between">
          <>
            <TouchableOpacity onPress={() => router.back()} className="w-20">
              <Text className="text-lg font-medium text-white">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">Edit group</Text>

            {submitting ? (
              <View className="w-20 items-end justify-center">
                <ActivityIndicator size={16} color="#ca8a04" />
              </View>
            ) : (
              <Text
                className="w-20 text-right text-lg font-bold text-yellow-600 disabled:text-[#555]"
                onPress={handleCreate}
                disabled={submitting || !name}>
                Done
              </Text>
            )}
          </>
        </View>

        <View className="items-center justify-center p-6">
          <View className="mx-auto">
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 110, height: 110, borderRadius: 100 }}
              />
            ) : (
              <GroupChatAvatar
                width={90}
                containerWidth={110}
                position={12}
                names={groupchat.groupMembers.map((m) => m.user.name)}
              />
            )}
          </View>
          <TouchableOpacity className="mx-auto mb-5 mt-2" onPress={pickImage}>
            <Text className="text-lg font-semibold text-[#ca8a04]">Add photo</Text>
          </TouchableOpacity>
          <View className="mt-5 flex-row items-center rounded-xl bg-[#252525] p-3.5 px-5">
            <TextInput
              className="flex-1 text-[17px] text-white"
              placeholderTextColor="#CCC"
              value={name}
              onChangeText={(text) => setName(text)}
              textAlignVertical="center"
              autoFocus
            />
            <Ionicons name="close-circle" size={20} color="#AAA" onPress={() => setName('')} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditGroupScreenComponent;
