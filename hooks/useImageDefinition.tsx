import { Urls } from '@/types/slices/search';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useImageDefinition = ({ urls }: { urls: Urls }) => {
  const [loading, setLoading] = useState(false);
  const [forceHD, toggleForceHD] = useState(false);
  const [img, setImg] = useState(urls.raw);

  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (img) setLoading(true);
  }, [img]);

  useEffect(() => {
    let isMounted = true;
    if (forceHD) return;

    const prefetchImage = async (url: string) => {
      try {
        await Image.prefetch(url);
        if (isMounted) setLoading(false);
      } catch {}
    };

    prefetchImage(img);

    timers.current.push(
      setTimeout(() => {
        if (loading) setImg(urls.regular);
      }, 2000)
    );

    timers.current.push(
      setTimeout(() => {
        if (loading) setImg(urls.small);
      }, 4000)
    );

    return () => {
      isMounted = false;
      timers.current.forEach((t: any) => clearTimeout(t));
    };
  }, [img, loading, urls]);

  const handleForcedHD = useCallback(() => {
    toggleForceHD(true);
    setImg(urls.raw);
  }, []);

  return { img, loading, setLoading, handleForcedHD };
};

export default useImageDefinition;
