import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ChatPanel, { type ChatMessage } from '@/components/ChatPanel';
import { MessageCircle } from 'lucide-react';
import { getSocket } from '@/lib/socketConn';
import { toast } from '@/hooks/use-toast';

const RoomPage = () => {
  const [location, navigate] = useLocation();
  const urlRoomId = location.split('/').pop() || '';

  // Get user info from sessionStorage
  const [user, setUser] = useState<{ name: string; roomId: string; isHost: boolean } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('sb_user');
    const tabId = sessionStorage.getItem('sb_tab_id');
    if (!stored || !tabId) {
      console.warn('[RoomPage] No session found, redirecting to entry page.');
      sessionStorage.removeItem('sb_user');
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.name || !parsed.roomId || parsed.roomId !== urlRoomId || parsed.tabId !== tabId) {
        console.warn('[RoomPage] Session mismatch, redirecting to entry page.');
        sessionStorage.removeItem('sb_user');
        navigate('/');
        return;
      }
      setUser(parsed);
    } catch {
      console.warn('[RoomPage] Session parse error, redirecting to entry page.');
      sessionStorage.removeItem('sb_user');
      navigate('/');
    }
    // Do NOT clear sb_user on unmount (to persist session across refresh)
    // return () => { sessionStorage.removeItem('sb_user'); };
  }, [urlRoomId, navigate]);

  // SOCKET.IO CHAT INTEGRATION
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return; // Ensure socket is not null
    // Always emit join-room on mount (or user change)
    console.log('[RoomPage] Emitting join-room:', user.roomId, user.name, user.isHost);
    socket.emit('join-room', user.roomId, user.name, user.isHost);
    // Listen for chat messages
    const onChatMessage = (msg: ChatMessage) => {
      setMessages(msgs => (msgs.some(m => m.id === msg.id) ? msgs : [...msgs, msg]));
      if (!chatOpen) {
        setUnreadCount(count => count + 1);
      }
      console.log('[RoomPage] Received chat-message:', msg);
    };
    socket.on('chat-message', onChatMessage);
    // Always set chat history from server
    const onChatMessages = (msgs: ChatMessage[]) => {
      setMessages(msgs);
      console.log('[RoomPage] Received chat-messages (full history):', msgs);
    };
    socket.on('chat-messages', onChatMessages);
    // Defensive: re-emit join-room if socket reconnects
    const onReconnect = () => {
      console.log('[RoomPage] Socket reconnected, re-emitting join-room.');
      socket.emit('join-room', user.roomId, user.name, user.isHost);
    };
    socket.on('reconnect', onReconnect);
    // Cleanup
    return () => {
      socket.off('chat-message', onChatMessage);
      socket.off('chat-messages', onChatMessages);
      socket.off('reconnect', onReconnect);
    };
  }, [user, chatOpen]);

  useEffect(() => {
    if (chatOpen) setUnreadCount(0);
  }, [chatOpen]);

  // Listen for user leave notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleUserLeft = (userName: string) => {
      toast({
        title: 'User Left',
        description: `${userName} left the room`,
        variant: 'destructive',
      });
    };
    socket.on('user-left-alert', handleUserLeft);
    return () => {
      socket.off('user-left-alert', handleUserLeft);
    };
  }, []);

  const handleSendMessage = (msg: string) => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return; // Ensure socket is not null
    const chatMsg: ChatMessage = {
      id: `${user.name}-${Date.now()}`,
      user: user.name,
      message: msg,
      timestamp: Date.now(),
    };
    setMessages((msgs) => [...msgs, chatMsg]);
    socket.emit('chat-message', user.roomId, chatMsg);
    console.log('[RoomPage] Sent chat-message:', chatMsg);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Placeholder for whiteboard */}
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-400">[ Collaborative Whiteboard Placeholder ]</div>
      </div>
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
    </div>
  );
};

export default RoomPage;