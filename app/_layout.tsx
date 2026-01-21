import AppProvider from '@/providers/AppProvider';
import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import NotificationWrapper from '@/components/notifications/notification-wrapper';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NotificationWrapper />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="photo" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="bookmarks" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="message" />
          <Stack.Screen name="groupchat-message" />
          <Stack.Screen name="groupchat-details" />
          <Stack.Screen name="new-chat" options={{ presentation: 'modal' }} />
          <Stack.Screen name="create-group" options={{ presentation: 'modal' }} />
          <Stack.Screen name="add-to-group" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar barStyle={'light-content'} backgroundColor="#ffffff" />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
