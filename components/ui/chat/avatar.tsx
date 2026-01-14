import React from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const Avatar = ({ name, size = 45 }: { name: string; size?: number }) => {
  const getBackgroundColor = (name: string) => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
      '#F8B739',
      '#52B788',
      '#F06292',
      '#7986CB',
      '#4DB6AC',
      '#FFB74D',
      '#A1887F',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const backgroundColor = getBackgroundColor(name);
  const borderRadius = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
        backgroundColor: backgroundColor,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <SvgUri
        uri={`https://api.dicebear.com/9.x/big-ears/svg?seed=${name}`}
        width={size}
        height={size}
      />
    </View>
  );
};

export default Avatar;
