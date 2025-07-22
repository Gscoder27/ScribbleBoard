import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Users, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getSocket } from '@/lib/socketConn';

interface LoginScreenProps {
  onJoinRoom: (roomId: string, userName: string) => void;
}

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [location, navigate] = useLocation();
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);


  useEffect(() => {
    // Always generate a new tab id on landing
    const tabId = crypto.randomUUID();
    sessionStorage.setItem('sb_tab_id', tabId);
    sessionStorage.removeItem('sb_user'); // Clear any stale user session
  }, []);

  const clickSound = new Audio('/click_sound.mp3');

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setRoomCode(code);
    toast({
      title: "Room code generated!",
      description: "Share this code with others to collaborate.",
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard.",
    });
  };

  const createRoom = () => {
    clickSound.currentTime = 0;
    clickSound.play();
    if (!userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }
    if (!roomCode) {
      toast({
        title: "Generate room code",
        description: "Please generate a room code first.",
        variant: "destructive",
      });
      return;
    }
    const tabId = sessionStorage.getItem('sb_tab_id');
    sessionStorage.setItem('sb_user', JSON.stringify({ name: userName, roomId: roomCode, isHost: true, tabId }));
    console.log('Create Room: isHost = true');
    navigate(`/whiteboard/${roomCode}`);
  };

  const joinRoom = () => {
    // const socket = getSocket();
  //   if (!socket) return;
  //   socket.emit("join-request", { userName, roomId: joinRoomCode });

  //   // Show blur + modal
  // setIsWaitingForApproval(true);

  // socket.once("waiting-for-approval", () => {
  //   // just keep showing the waiting UI
  // });

  // socket.once("join-response", ({ approved }) => {
  //   setIsWaitingForApproval(false);
  //   if (approved) {
  //     const tabId = sessionStorage.getItem("sb_tab_id");
  //     sessionStorage.setItem('sb_user', JSON.stringify({
  //       name: userName,
  //       roomId: joinRoomCode,
  //       isHost: false,
  //       tabId,
  //     }));
  //     navigate(`/whiteboard/${joinRoomCode}`);
  //   } else {
  //     toast({
  //       title: "Rejected",
  //       description: "Your join request was rejected by the host.",
  //       variant: "destructive",
  //     });
  //   }
  // });

    clickSound.currentTime = 0;
    clickSound.play();
    if (!userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }
    if (!joinRoomCode.trim()) {
      toast({
        title: "Room code required",
        description: "Please enter a room code to join.",
        variant: "destructive",
      });
      return;
    }
    const tabId = sessionStorage.getItem('sb_tab_id');
    sessionStorage.setItem('sb_user', JSON.stringify({ name: userName, roomId: joinRoomCode, isHost: false, tabId }));
    console.log('Join Room: isHost = false');
    // Listen for room-error event
    const socket = getSocket();
    if (!socket) return; // Ensure socket is not null
    socket.once('room-error', (msg: string) => {
      toast({
        title: 'Room not found',
        description: msg,
        variant: 'destructive',
      });
      // Remove sb_user so user can try again
      sessionStorage.removeItem('sb_user');
      navigate('/');
    });
    navigate(`/whiteboard/${joinRoomCode}`);
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/backgroundImg-2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
    {isWaitingForApproval && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center space-y-3">
      <h2 className="text-lg font-semibold">Waiting for Host Approval</h2>
      <p className="text-gray-500">Please wait while the host approves your request...</p>
      <div className="animate-pulse text-indigo-600 text-sm">Connecting...</div>
    </div>
  </div>
)}
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radial gradient overlay for depth */}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/60 to-indigo-50/80" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
              <img src="/Scribbleicon2.png" alt="Scribble Board Logo" className="w-15 h-15 loading=eager" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
              Scribble Board
            </h1>
            <p className="text-gray-600 text-lg">Collaborative whiteboard with real-time chat</p>
          </div>


          {/* Main Card */}
          <Card className="border-2 border-purple-500 backdrop-blur-sm bg-white/80 shadow-xl">
            <CardContent className="space-y-6">
              {/* Name Input */}
              <div className="space-y-5 mt-4">
                <label className="text-sm font-medium text-gray-700 ">Your Name:</label>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              {/* Create Room Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Create Room:</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Room code will appear here"
                    value={roomCode}
                    readOnly
                    className="flex-1 bg-gray-50 border-gray-200"
                  />
                  {roomCode && (
                    <Button
                      onClick={copyRoomCode}
                      variant="outline"
                      className="h-10 px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={generateRoomCode}
                    variant="outline"
                    className="h-10 px-4 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    Generate
                  </Button>
                </div>
                <Button
                  onClick={createRoom}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  size="lg"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </div>

              {/* Join Room Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Join Room:</label>
                <Input
                  placeholder="Enter room code"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value)}
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <Button
                  onClick={joinRoom}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  Enter Room
                </Button>
              </div>

            </CardContent>
          </Card>

            {/* Footer */}
            <footer className="w-full flex items-center justify-center mt-8 opacity-100 text-[#140f41]">
              <h3>
                {"< "} Build by{" "}
                <span className="hover:underline hover:underline-offset-2 transition-all">
                  <a
                    href="https://www.linkedin.com/in/gurvindar-singhdev07/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Gurvindar Singh
                  </a>
                </span>{" "}
                {" />"}
              </h3>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;