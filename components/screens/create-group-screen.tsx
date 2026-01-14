import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { UserData } from '@/types/slices/user';
import Add from './elements/add';
import Create from './elements/create';

const CreateGroupScreenComponent = () => {
  const [selectedUser, setUser] = useState<UserData[]>([]);

  const [step, setStep] = useState<'add' | 'create'>('add');
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    if (step == 'add') {
      setStep('create');
    } else {
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
          <TouchableOpacity onPress={handleBack}>
            <Text className="text-lg font-medium text-white">Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Add Members</Text>

          {submitting ? (
            <View className="w-20 items-center justify-center">
              <ActivityIndicator size={16} color={'#ca8a04'} />
            </View>
          ) : (
            <Text
              className="text-lg font-bold text-yellow-600 disabled:text-[#555]"
              onPress={handleNext}
              disabled={selectedUser.length == 0 || submitting}>
              Next
            </Text>
          )}
        </>
      </View>

      {step == 'add' ? (
        <Add setUser={setUser} users={selectedUser} />
      ) : (
        <Create setUser={setUser} users={selectedUser} />
      )}
    </View>
  );
};

export default CreateGroupScreenComponent;
