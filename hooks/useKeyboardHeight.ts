import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEventListener, Platform } from 'react-native';

type KeyboardMetrics = {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
};

/**
 * Custom hook to track keyboard height and visibility.
 * Works reliably on both iOS and Android.
 * Returns current keyboard height (0 when hidden) and visibility state.
 */
export function useKeyboardHeight(): KeyboardMetrics {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyboardShow: KeyboardEventListener = (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    };

    const handleKeyboardHide: KeyboardEventListener = () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    };

    // iOS-specific events
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subscriptions = [
      Keyboard.addListener(showEvent, handleKeyboardShow),
      Keyboard.addListener(hideEvent, handleKeyboardHide),
    ];

    // Cleanup listeners on unmount
    return () => {
      subscriptions.forEach((sub) => sub.remove());
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
}
