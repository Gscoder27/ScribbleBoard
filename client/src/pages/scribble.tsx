import LoginScreen from "@/pages/EntryPage";

export default function Scribble() {
  const handleJoinRoom = (roomId: string, userName: string) => {
    console.log(`Joining room ${roomId} as ${userName}`);
    // Handle room joining logic here
  };

  return (
    <div className="w-full">
      <LoginScreen />
    </div>
  );
} 