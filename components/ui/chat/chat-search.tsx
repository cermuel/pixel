import { View, Text, TextInput, Pressable } from 'react-native';
import React, { Dispatch, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { router } from 'expo-router';
import { SCREEN_TYPE } from '@/components/screens/chat-screen';

const ChatSearch = ({
  query,
  setQuery,
  screen,
  setScreen,
  screens,
}: {
  query: string;
  setQuery: Dispatch<string>;
  screen: SCREEN_TYPE;
  setScreen: Dispatch<SCREEN_TYPE>;
  screens: SCREEN_TYPE[];
}) => {
  return (
    <>
      <View className="flex-row gap-4 px-6">
        <View className="flex-1 flex-row items-center gap-2 rounded-lg bg-black/30 p-2.5">
          <EvilIcons name="search" size={20} color="white" />
          <View className="relative flex-1">
            <TextInput
              className="flex-1 text-white"
              onChangeText={(text) => setQuery(text)}
              value={query}
              style={{ padding: 0 }}
            />
            {!query && (
              <Text
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#CCC]"
                style={{ pointerEvents: 'none' }}>
                Search chats...
              </Text>
            )}
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/new-chat')}
          className="h-9 w-9 items-center justify-center rounded-full bg-white">
          <Ionicons name="add-sharp" color={'black'} size={18} />
        </Pressable>
      </View>

      <View className="my-6 mt-4 flex-row items-center">
        {screens.map((s) => (
          <Pressable
            key={s}
            style={{
              borderBottomWidth: s == screen ? 2 : 1,
              borderBottomColor: s == screen ? 'white' : '#888',
            }}
            className={`flex-1 items-center justify-center py-1`}
            onPress={() => setScreen(s)}>
            <Text
              className={`text-lg font-medium`}
              style={{ color: s == screen ? 'white' : '#888' }}>
              {s}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
};

export default ChatSearch;
