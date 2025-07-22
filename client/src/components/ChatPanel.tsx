import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send } from 'lucide-react';
// import { ChatMessage } from '@/pages/WhiteboardPage';

// Add ChatMessage type for local use
export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: number;
  system?: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string;
  onClose: () => void;
}

const ChatPanel = ({ messages, onSendMessage, currentUser, onClose }: ChatPanelProps) => {
  const [newMessage, setNewMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-80 md:w-96 h-96 md:h-[500px] flex flex-col bg-white border-2 border-[#a259ff] rounded-2xl shadow-2xl p-0" >
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Chat</h3>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="p-1 bg-transparent hover:bg-gray-100 active:bg-gray-200 focus:bg-transparent"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 md:p-4 min-h-0">
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              message.system ? (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full my-2">
                    {message.message}
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.user === currentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                      message.user === currentUser
                        ? 'bg-[#a259ff] text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    <span className={`block text-xs font-semibold mb-1 ${message.user === currentUser ? 'text-white' : 'text-gray-800'}`}>{message.user}</span>
                    <div className={`w-full h-px ${message.user === currentUser ? 'bg-white/40' : 'bg-gray-300'} mb-1`} />
                    <p className="text-xs md:text-sm break-words">{message.message}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground/60">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              )
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-border">
        <form
          className="flex gap-2"
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 text-sm border-2 border-[#a259ff] rounded-xl bg-white focus:ring-0 focus:outline-none shadow-none resize-none min-h-[36px] max-h-32 px-3 py-2"
            style={{ boxShadow: 'none', overflow: 'hidden' }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 disabled:opacity-50 border-none bg-transparent focus:outline-none focus:ring-0 shadow-none"
            style={{ border: 'none', background: 'none' }}
            aria-label="Send message"
            title="Send message"
          >
            <Send className="w-6 h-6 text-[#a259ff]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;