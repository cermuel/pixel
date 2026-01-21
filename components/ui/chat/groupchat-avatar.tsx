import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';

const GroupChatAvatar = ({
  names = ['Sarah', 'Marcus', 'Samuel'],
  containerWidth = 40,
  width = 30,
  position = 5,
}: {
  names?: string[];
  containerWidth?: number;
  width?: number;
  position?: number;
}) => {
  const positions = [
    { top: -position, left: -position },
    { top: -position, right: -position },
    { bottom: -position, left: position },
  ];

  const avatars = names.slice(0, 3).map((name, index) => ({
    name,
    position: positions[index],
  }));

  return (
    <View style={[styles.container, { width: containerWidth, height: containerWidth }]}>
      {avatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.avatarWrapper,
            avatar.position,
            { zIndex: avatars.length - index, width, height: width },
          ]}>
          <SvgUri
            uri={`https://api.dicebear.com/9.x/big-ears/svg?seed=${avatar.name}`}
            width={width}
            height={width}
            style={styles.avatar}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 1000,
    backgroundColor: '#ca8a04',
    overflow: 'hidden',
  },
  avatarWrapper: {
    position: 'absolute',

    overflow: 'hidden',
  },
  avatar: {
    borderRadius: 1000,
  },
});

export default GroupChatAvatar;
