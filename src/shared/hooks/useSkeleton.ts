import { useEffect, useRef, useState } from 'react';

const MINIMUM_SKELETON_DURATION_MS = 300;

export const useSkeleton = (isLoading: boolean) => {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const minTimeRef = useRef(Date.now());

  useEffect(() => {
    if (isLoading) {
      minTimeRef.current = Date.now();
      setShowSkeleton(true);
      return;
    }

    const elapsed = Date.now() - minTimeRef.current;
    const remaining = Math.max(0, MINIMUM_SKELETON_DURATION_MS - elapsed);
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return showSkeleton;
};
