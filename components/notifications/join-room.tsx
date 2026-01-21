import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ImageProps,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SvgUri } from 'react-native-svg';

// import { animatedPairs } from '@/data/bg';
// import { BlurView } from 'expo-blur';
import { CalendarClock, MapPin } from 'lucide-react-native';
import { helpers } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LiveTimeAgo } from './time-ago';
import IOSExpandableNotification from '../shared/notification';

const JoinRoom = ({ name, room }: { name: string; room: string }) => {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 100);
  }, []);

  if (!visible) {
    console.log('no longer visible please handle');
    return null;
  }

  return (
    <IOSExpandableNotification
      expandedHeight={400}
      className="!rounded-[20px] !border !border-[#222] !bg-black !p-0"
      visible={visible}
      onHide={() => setVisible(false)}
      content={
        <TouchableOpacity onPress={() => setVisible(false)} className="h-full w-full p-3.5">
          <View className="h-full w-full flex-1 flex-row items-center gap-2.5">
            <View className="aspect-square h-[80%] items-center justify-center overflow-hidden rounded-full bg-[#CB9DF0]">
              <SvgUri
                className={``}
                uri={'https://api.dicebear.com/9.x/big-ears/svg?seed=Daniel'}
                width={35}
                height={35}
              />
            </View>
            <View className="h-full flex-1 justify-center">
              <Text
                className=" text-lg font-bold text-white"
                numberOfLines={1}
                ellipsizeMode="tail">
                {name} joined your room {room}
              </Text>
              <Text className="font-medium text-white/80">Joined room</Text>
            </View>
            <View className="h-[80%] justify-start">
              <LiveTimeAgo since={Date.now()} />
            </View>
          </View>
        </TouchableOpacity>
      }
      expandedContent={
        <View className="h-full w-full">
          <View className="h-20 w-full flex-row items-center gap-2.5 p-3.5">
            <View className="aspect-square h-[80%] items-center justify-center overflow-hidden rounded-full bg-[#CB9DF0]">
              <SvgUri
                className={``}
                uri={'https://api.dicebear.com/9.x/big-ears/svg?seed=Daniel'}
                width={35}
                height={35}
              />
            </View>
            <View className="h-full flex-1 justify-center">
              <Text
                className=" text-lg font-bold text-white"
                numberOfLines={1}
                ellipsizeMode="tail">
                {name} joined your room {room}
              </Text>
              <Text className="font-medium text-white/80">Joined room</Text>
            </View>
            <View className="h-[80%] justify-start">
              <LiveTimeAgo since={Date.now()} />
            </View>
          </View>
          <View className="relative h-full w-full flex-1 bg-[#111]">
            <View className="absolute inset-0">
              {/* <ImageBackground
                source={animatedPairs[2].top}
                className="absolute inset-0"
                resizeMode="cover"
              /> */}
              <View className="absolute inset-0 bg-black/40" />
              {/* <BlurView intensity={10} tint="dark" className="absolute inset-0" /> */}
            </View>

            <View className="absolute left-0 top-0 z-10 h-full w-full gap-2 p-3.5 py-5">
              <Text className="mt-auto text-center text-4xl font-extrabold text-white">
                Housewarming Party
              </Text>
              <View className="flex-row items-center justify-center gap-2">
                <CalendarClock size={18} color={`#DDD`} />
                <Text className="text-xl text-white/70">
                  {helpers.formatDate(helpers.today, { dateOnly: true })} -
                  {helpers.formatDate(helpers.tomorrow, { dateOnly: true })}
                </Text>
              </View>
              <View className="flex-row items-center justify-center gap-2">
                <MapPin size={18} color={`#FFF`} />
                <Text className="text-[17px]  text-white">Brains & Hammers Estate, Abuja</Text>
              </View>
              <View className="mt-auto flex-row items-center gap-4">
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}
                  className={`mt-2 flex-1 items-center rounded-full bg-white py-4`}>
                  <Text className={`text-lg font-bold text-yellow-950`}>View Event</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={submitting}
                  onPress={() => {
                    if (!accepted) {
                      setSubmitting(true);
                      setTimeout(() => {
                        setSubmitting(false);
                        setAccepted(true);
                      }, 3000);
                    } else {
                      setVisible(false);
                    }
                  }}
                  className={`mt-2 flex-1 items-center rounded-full bg-[#007AFF] py-4 disabled:opacity-70`}>
                  {accepted ? (
                    <Animated.Text
                      entering={FadeIn}
                      exiting={FadeOut}
                      className={`text-lg font-bold text-white`}>
                      Accepted
                    </Animated.Text>
                  ) : submitting ? (
                    <ActivityIndicator color={'white'} />
                  ) : (
                    <Animated.Text
                      entering={FadeIn}
                      exiting={FadeOut}
                      className={`text-lg font-bold text-white`}>
                      Accept Invite
                    </Animated.Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
};

export default JoinRoom;
