import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import React, { Dispatch, ReactNode } from 'react';
import Skeleton from './skeleton-loader';
import { Image as ExpoImage } from 'expo-image';

interface ImageProps {
  loading?: boolean;
  setLoading?: Dispatch<boolean>;
  containerStyle?: StyleProp<ViewStyle>;
  img: string;
  showHD?: boolean;
  handleForceHD?: () => void;
  theme?: 'dark' | 'light';
  hdStyle?: StyleProp<ViewStyle>;
  hdClassname?: string;
  children?: ReactNode;
}

const Image = ({
  loading = false,
  img,
  setLoading,
  showHD,
  handleForceHD,
  containerStyle,
  theme = 'dark',
  hdStyle = {},
  hdClassname,
  children,
}: ImageProps) => {
  return (
    <View
      className="relative overflow-hidden"
      style={[
        {
          width: '100%',
          borderRadius: 20,
        },
        containerStyle,
      ]}>
      {loading && (
        <Skeleton
          style={{
            width: '100%',
            height: '100%',
          }}
          variant={theme}
        />
      )}
      <ExpoImage
        source={{ uri: img }}
        cachePolicy={'disk'}
        contentFit="cover"
        onLoad={() => {
          if (setLoading) setLoading(false);
        }}
        style={{ width: '100%', height: '100%' }}
      />
      {showHD && (
        <TouchableOpacity
          style={[{ bottom: 20, right: 16 }, hdStyle]}
          onPress={() => {
            if (handleForceHD) handleForceHD();
          }}
          disabled={loading}
          className={`${hdClassname} absolute h-10 w-10 items-center justify-center rounded-full bg-black/80`}>
          <Text className="text-sm font-bold text-white">HD</Text>
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
};

export default Image;
