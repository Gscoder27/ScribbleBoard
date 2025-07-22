import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Whiteboard from '../components/Whiteboard/board/Whiteboard';
import ChatPanel, { ChatMessage } from '@/components/ChatPanel';
import { MessageCircle, Users, LogOut } from 'lucide-react';
import { getSocket } from '@/lib/socketConn';
import { Provider } from 'react-redux';
import { store } from '../components/Whiteboard/store/store';
import { toast } from '@/hooks/use-toast';
import JoinRequestModal, { JoinRequest } from '../components/joinRequestModal.tsx';


const WhiteboardRoom = () => {
  const [location, navigate] = useLocation();
  const urlRoomId = location.split('/').pop() || '';
  const [user, setUser] = useState<{ name: string; roomId: string; isHost: boolean } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [users, setUsers] = useState<{ name: string; isHost: boolean }[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [joinRequest, setJoinRequest] = useState<JoinRequest | null>(null);


  useEffect(() => {
    const stored = sessionStorage.getItem('sb_user');
    const tabId = sessionStorage.getItem('sb_tab_id');
    if (!stored || !tabId) {
      sessionStorage.removeItem('sb_user');
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.name || !parsed.roomId || parsed.roomId !== urlRoomId || parsed.tabId !== tabId) {
        sessionStorage.removeItem('sb_user');
        navigate('/');
        return;
      }
      setUser(parsed);
    } catch {
      sessionStorage.removeItem('sb_user');
      navigate('/');
    }
  }, [urlRoomId, navigate]);

//   useEffect(() => {
//   const socket = getSocket();
//   if (!socket || !user?.isHost) return;

//   const onApproveUserRequest = ({ userId, userName, roomId }) => {
//     // Show approval modal
//     const confirm = window.confirm(`User "${userName}" wants to join room ${roomId}. Approve?`);
//     socket.emit("host-response", { userId, approved: confirm });
//   };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.isHost) return;
  
    const onApproveUserRequest = (data: JoinRequest) => {
      setJoinRequest(data);
    };
  
    socket.on("approve-user-request", onApproveUserRequest);
  
    // ✅ Proper cleanup function
    return () => {
      socket.off("approve-user-request", onApproveUserRequest);
    };
  }, [user]);



  // SOCKET.IO CHAT INTEGRATION
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;
    
    console.log('[WhiteboardRoom] Joining room:', user.roomId, user.name, user.isHost);
    socket.emit('join-room', user.roomId, user.name, user.isHost);
    
    const onChatMessage = (msg: ChatMessage) => {
      console.log('[WhiteboardRoom] Received chat message:', msg);
      setMessages(msgs => {
        if (msg.system) {
          return [...msgs, msg];
        }
        return (msgs.some(m => m.id === msg.id) ? msgs : [...msgs, msg]);
      });
      if (!chatOpen) setUnreadCount(count => count + 1);
    };
    socket.on('chat-message', onChatMessage);
    
    const onChatMessages = (msgs: ChatMessage[]) => {
      console.log('[WhiteboardRoom] Received chat history:', msgs);
      setMessages(msgs);
    };
    socket.on('chat-messages', onChatMessages);
    
    const onReconnect = () => {
      console.log('[WhiteboardRoom] Socket reconnected, re-joining room');
      socket.emit('join-room', user.roomId, user.name, user.isHost);
    };
    socket.on('reconnect', onReconnect);
    
    return () => {
      socket.off('chat-message', onChatMessage);
      socket.off('chat-messages', onChatMessages);
      socket.off('reconnect', onReconnect);
    };
  }, [user, chatOpen]);

  // Listen for user list from server
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;
    
    const onRoomUsers = (users: { name: string; isHost: boolean }[]) => {
      console.log('[WhiteboardRoom] Received room-users:', users);
      setUsers(users);
    };
    socket.on('room-users', onRoomUsers);
    
    return () => { 
      socket.off('room-users', onRoomUsers); 
    };
  }, [user]);

  // Listen for user leave notifications - THIS IS THE KEY FIX
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;
    
    const handleUserLeft = (userName: string) => {
      console.log('[WhiteboardRoom] User left notification:', userName);
      
      // Don't show toast for yourself (in case of explicit leave)
      if (userName === user.name) {
        console.log('[WhiteboardRoom] Ignoring self-leave notification');
        return;
      }
      
      // Show toast notification
      toast({
        title: 'User Left',
        description: `${userName} left the room`,
        variant: 'destructive',
        duration: 4000, // Show for 4 seconds
      });
      
      console.log('[WhiteboardRoom] Displayed leave toast for:', userName);
    };
    
    socket.on('user-left-alert', handleUserLeft);
    
    return () => {
      socket.off('user-left-alert', handleUserLeft);
    };
  }, [user]); // Include user in dependencies to ensure we have the current user info

  useEffect(() => { 
    if (chatOpen) setUnreadCount(0); 
  }, [chatOpen]);

  const handleSendMessage = (msg: string) => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;
    
    const chatMsg: ChatMessage = {
      id: `${user.name}-${Date.now()}`,
      user: user.name,
      message: msg,
      timestamp: Date.now(),
    };
    setMessages((msgs) => [...msgs, chatMsg]);
    socket.emit('chat-message', user.roomId, chatMsg);
  };

  const handleLeaveRoom = () => {
    if (!user) return;
    
    const socket = getSocket();
    if (socket) {
      console.log('[WhiteboardRoom] Explicitly leaving room:', user.roomId, user.name);
      // Emit explicit leave event
      socket.emit('leave-room', user.roomId, user.name);
    }
    
    // Clear session storage
    sessionStorage.removeItem('sb_user');
    sessionStorage.removeItem('sb_tab_id');
    
    // Show local toast for the leaving user
    toast({
      title: 'Left Room',
      description: `You left the room`,
      variant: 'destructive',
      duration: 2000,
    });
    
    // Navigate after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-white">
      <Provider store={store}>
        {/* Leave Room Button (top left) */}
        <button
          onClick={handleLeaveRoom}
          className="absolute left-6 top-4 bg-white border-2 border-red-500 text-red-600 rounded-xl px-4 py-2 font-medium text-base flex items-center gap-2 z-50 cursor-pointer shadow hover:bg-red-50"
          style={{ minWidth: 90 }}
        >
          <LogOut className="w-5 h-5 mr-1" />
          <span className="hidden sm:inline">Leave</span>
        </button>
        
        {/* Responsive flex column: menu bar and users button */}
        <div className="w-full flex flex-col items-center pt-6 px-2 sm:px-0 relative">
          {/* Menu bar (centered, with right margin on desktop) */}
          <div className="w-full flex justify-center">
            <Whiteboard isHost={user?.isHost} roomId={user?.roomId} username={user?.name} />
          </div>
          
          {/* Responsive Users Button: static on mobile, absolute on desktop */}
          <button
            onClick={() => setShowUsers(v => !v)}
            className="mt-4 sm:mt-0 sm:absolute sm:right-6 sm:top-4 bg-white border-2 border-black rounded-xl px-4 py-2 font-medium text-base flex items-center gap-2 z-50 cursor-pointer w-[90vw] max-w-xs justify-center sm:w-auto sm:max-w-none sm:justify-start"
          >
            <Users className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Users</span>
            <span className="ml-1 text-primary font-semibold">&#9660;</span>
          </button>
          
          {/* User List Popup */}
          {showUsers && (
            <div className="sm:absolute sm:right-6 sm:top-20 bg-white border-2 border-black rounded-2xl min-w-[280px] shadow-xl z-50 p-4 flex flex-col items-stretch mt-2 sm:mt-0">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="font-bold text-lg">Users ({users.length})</span>
                <button onClick={() => setShowUsers(false)} className="bg-none border-none text-2xl text-gray-500 cursor-pointer">×</button>
              </div>
              {users.map((u, i) => (
                <div key={u.name + i} className="flex items-center gap-3 py-3 border-b last:border-b-0 border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-lg text-indigo-900">
                    {u.name[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base text-indigo-900 flex items-center gap-1">
                      {u.name} {u.isHost && <span title="Host" className="text-yellow-500 text-lg ml-1">👑</span>}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{u.isHost ? 'Host' : 'Member'}</div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block ml-2" title="Online"></span>
                </div>
              ))}
              <div className="pt-2 text-xs text-gray-500 text-left flex items-center gap-2">
                <span className="text-base">👥</span> Online users in this room
              </div>
            </div>
          )}
        </div>
      </Provider>
      
      {/* Floating Chat Button (bottom right) */}
      <button
        className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground rounded-full shadow-lg px-5 py-3 flex items-center gap-2 hover:bg-primary/90 focus:outline-none"
        style={{ minWidth: 48 }}
        onClick={() => setChatOpen(true)}
      >
        <div className="relative flex items-center">
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="hidden md:inline">Chat Room</span>
      </button>
      
      {/* Chat Panel Drawer */}
      {chatOpen && (
        <div className="fixed bottom-8 right-8 z-50 flex items-end">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={user.name}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}
      <JoinRequestModal
        request={joinRequest}
        onApprove={(userId) => {
        getSocket()?.emit("host-response", { userId, approved: true });
        setJoinRequest(null);
      }}
      onReject={(userId) => {
        getSocket()?.emit("host-response", { userId, approved: false });
        setJoinRequest(null);
      }}
    />

    </div>
  );
};

export default WhiteboardRoom;