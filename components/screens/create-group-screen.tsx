import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { UserData } from '@/types/slices/user';
import Add from './elements/add';
import Create from './elements/create';
import { useCreateGroupMutation } from '@/services/user/userSlice';
import useGroupChat from '@/hooks/useGroupchat';

const CreateGroupScreenComponent = () => {
  const [create, { isLoading: submitting }] = useCreateGroupMutation();
  const { joinRoom } = useGroupChat({});
  const [selectedUser, setUser] = useState<UserData[]>([]);
  const [step, setStep] = useState<'add' | 'create'>('add');
  const [name, setName] = useState('');

  const handleCreate = async () => {
    try {
      const res = await create({
        name,
        members: selectedUser.map((u) => ({ userId: u.id, isAdmin: false })),
      }).unwrap();

      joinRoom({ room: res.data.id });
      router.dismiss();
      setTimeout(() => {
        router.push({
          pathname: '/groupchat-message',
          params: {
            id: res.data.id,
            name: res.data.name,
            members: JSON.stringify(res.data.groupMembers),
          },
        });
      }, 50);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleNext = () => {
    if (step == 'add') {
      setStep('create');
    } else {
      handleCreate();
    }
  };
  const handleBack = () => {
    if (step == 'add') {
      router.back();
    } else {
      setStep('add');
    }
  };

  useEffect(() => {
    if (selectedUser.length == 0) setStep('add');
  }, [selectedUser]);

  return (
    <View className="flex-1 bg-[#141718]">
      <View
        style={{ paddingTop: 20, padding: 24 }}
        className="z-10 w-full flex-row items-center justify-between">
        <>
          <TouchableOpacity onPress={handleBack} className="w-14">
            <Text className="text-lg font-medium text-white">Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">
            {step == 'add' ? 'Add members' : 'Group Details'}
          </Text>

          {submitting ? (
            <View className="w-14 items-center justify-center">
              <ActivityIndicator size={16} color={'#ca8a04'} />
            </View>
          ) : (
            <Text
              className="w-14 text-lg font-bold text-yellow-600 disabled:text-[#555]"
              onPress={handleNext}
              disabled={selectedUser.length == 0 || submitting || (step == 'create' && name == '')}>
              {step == 'add' ? 'Next' : ' Create'}
            </Text>
          )}
        </>
      </View>

      {step == 'add' ? (
        <Add setUser={setUser} users={selectedUser} />
      ) : (
        <Create setUser={setUser} users={selectedUser} setName={setName} name={name} />
      )}
    </View>
  );
};

export default CreateGroupScreenComponent;
