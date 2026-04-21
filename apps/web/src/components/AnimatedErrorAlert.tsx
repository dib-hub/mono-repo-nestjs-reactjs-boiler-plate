import { AnimatedErrorAlertProps } from '@my-monorepo/types';
import { FC, useEffect, useMemo, useState } from 'react';

const EXIT_ANIMATION_MS = 300;
const VISIBLE_DURATION_MS = 2000;

export const AnimatedErrorAlert: FC<AnimatedErrorAlertProps> = ({ message, className = '' }) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!message) {
      return;
    }

    setActiveMessage(message);
    setIsEntering(true);
    setIsExiting(false);

    const enteringTimer = setTimeout(() => {
      setIsEntering(false);
    }, 40);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, VISIBLE_DURATION_MS - EXIT_ANIMATION_MS);

    const hideTimer = setTimeout(() => {
      setActiveMessage(null);
      setIsExiting(false);
    }, VISIBLE_DURATION_MS);

    return () => {
      clearTimeout(enteringTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [message]);

  const animationClassName = useMemo(() => {
    if (isEntering || isExiting) {
      return 'opacity-0 -translate-y-1';
    }

    return 'opacity-100 translate-y-0';
  }, [isEntering, isExiting]);

  if (!activeMessage) {
    return null;
  }
  return (
    <p
      className={`text-red-600 text-sm mt-2 transition-all duration-300 ease-out ${animationClassName} ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      {activeMessage}
    </p>
  );
};
