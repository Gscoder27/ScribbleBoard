// FloatingLabels.tsx
import React, { useEffect, useState } from 'react';
import FloatingUserLabel from './FloatingUserLabel';
import { onUserCursorActivity } from '@/lib/socketConn';

interface UserActivity {
  userId: string;
  username: string;
  x: number;
  y: number;
  isDrawing: boolean;
  isTyping?: boolean;
  tool?: string;
}

const FloatingLabels: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [userActivities, setUserActivities] = useState<Record<string, UserActivity>>({});

  useEffect(() => {
    const unsubscribe = onUserCursorActivity((activity: UserActivity) => {
      if (!activity || !activity.userId) return;
      setUserActivities(prev => ({ ...prev, [activity.userId]: activity }));

      setTimeout(() => {
        setUserActivities(prev => {
          const newState = { ...prev };
          delete newState[activity.userId];
          return newState;
        });
      }, 5000);
    });

    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, [roomId]);

  return (
    <>
      {Object.entries(userActivities).map(([id, data]) => (
        <FloatingUserLabel
          key={id}
          username={data.username}
          x={data.x}
          y={data.y}
          isDrawing={data.isDrawing}
          isTyping={data.isTyping}
          tool={data.tool}
          self={false}
        />
      ))}
    </>
  );
};

export default FloatingLabels;