import { View } from 'react-native';
import React from 'react';
import Skeleton from '@/components/shared/skeleton-loader';

const ChatSkeleton = ({ length = 5 }: { length?: number }) => {
  return (
    <View className="gap-4">
      {Array.from({ length }).map((_, idx) => (
        <View className="flex-row items-center gap-4" key={idx}>
          <Skeleton className="aspect-square !rounded-full" variant="dark" style={{ width: 50 }} />
          <View className="gap-1">
            <Skeleton className="!rounded-full" variant="dark" style={{ width: 150, height: 15 }} />
            <Skeleton className="!rounded-full" variant="dark" style={{ width: 200, height: 15 }} />
          </View>
          <Skeleton className="ml-auto" variant="dark" style={{ width: 30, height: 15 }} />
        </View>
      ))}
    </View>
  );
};

export default ChatSkeleton;
