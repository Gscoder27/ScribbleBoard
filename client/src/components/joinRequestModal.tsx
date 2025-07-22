// components/JoinRequestModal.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

export interface JoinRequest {
  userId: string;
  userName: string;
  roomId: string;
}

interface Props {
  request: JoinRequest | null;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const JoinRequestModal: React.FC<Props> = ({ request, onApprove, onReject }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center space-y-4">
        <h2 className="text-xl font-bold">Join Request</h2>
        <p className="text-gray-700">
          <span className="font-semibold">{request.userName}</span> wants to join your room.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onApprove(request.userId)}
          >
            Approve
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onReject(request.userId)}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinRequestModal;
