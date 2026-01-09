import React, { useEffect, useState } from 'react';
import { Text, TextProps } from 'react-native';

interface LiveTimeAgoProps extends TextProps {
  since: Date | number;
  maxMinutes?: number;
}

export const LiveTimeAgo: React.FC<LiveTimeAgoProps> = ({
  since,
  maxMinutes = 59,
  ...textProps
}) => {
  const startTime = typeof since === 'number' ? since : since.getTime();
  const [text, setText] = useState('NOW');

  useEffect(() => {
    setText('NOW');

    const update = () => {
      const now = Date.now();
      const secondsAgo = Math.floor((now - startTime) / 1000);

      if (secondsAgo < 5) {
        setText('now');
      } else if (secondsAgo < 60) {
        setText(`${secondsAgo}s ago`);
      } else {
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo > maxMinutes) {
          setText(`${maxMinutes}+m ago`);
          return;
        }
        setText(`${minutesAgo}m ago`);
      }
    };

    update();

    const interval = setInterval(update, 5000);

    return () => clearInterval(interval);
  }, [startTime, maxMinutes]);

  return (
    <Text
      numberOfLines={1}
      ellipsizeMode="clip"
      className="ml-auto font-semibold text-white/60"
      {...textProps}>
      {text}
    </Text>
  );
};
