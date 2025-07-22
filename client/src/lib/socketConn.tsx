import { io, Socket } from 'socket.io-client';
import type { WhiteboardElement } from "@/components/Whiteboard/board/utils/createElements";
import { store } from "@/components/Whiteboard/store/store";
import { replaceElements, updateElementRemote } from "@/components/Whiteboard/board/whiteboardSlice";
import { isWritingRef } from "@/components/Whiteboard/board/utils/whiteboardStatus";

/** Keep one shared socket instance */
let socket: ReturnType<typeof io> | null = null;

export const getSocket = () => socket;

/** Connect once and wire up listeners */
export const connectWithSocketServer = (): void => {
  if (socket) return;                        // already connected

  socket = io('http://localhost:3000');      // ← ensure this matches your server port

  socket.on('connect', () => {
    console.log('✅ Connected to socket.io server');
  });

  socket.on('chat-message', (msg: { user: string; text: string }) => {
    // Handle chat message (e.g., update chat state/store)
    console.log('💬 New chat message:', msg);
  });

  // Note: This listener is now handled in the Whiteboard component for room-specific handling
  // socket.on('whiteboard-state', (elements: WhiteboardElement[]) => {
  //   console.log('🧾 Received whiteboard-state from server:', elements);
  //   if (isWritingRef.current) {
  //     console.log('✋ Skipping setElements: user is writing');
  //     return;
  //   }
  //   store.dispatch(replaceElements(elements));
  // });

  socket.on("element-update", (elementData: WhiteboardElement & { deleted?: boolean }) => {
    if (elementData.deleted) {
      const current = store.getState().whiteboardPage.elements;
      const newElements = current.filter(el => el.id !== elementData.id);
      store.dispatch(replaceElements(newElements));
    } else {
      store.dispatch(updateElementRemote(elementData));
    }
  });  

  // Brush size change listener
  socket.on('brush-size-change', (size: number) => {
    store.dispatch({ type: 'whiteboardPage/brushSizeChanged', payload: size });
  });
};
export const emitElementUpdate = (elementData: unknown): void => {
  if (!socket) {
    console.warn('Socket not initialised yet');
    return;
  }
  socket.emit('element-update', elementData);
};

// Add these functions to your socketConn.tsx
export const emitBrushSizeChange = (size: number) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('brush-size-change', size);
  }
};

export const emitChatMessage = (msg: { user: string; text: string }) => {
    if (!socket) {
      console.warn('Socket not initialised yet');
      return;
    }
    socket.emit('chat-message', msg);
  };

// User cursor activity functions
export const emitUserCursorActivity = (activity: {
  userId: string;
  username: string;
  tool: string;
  roomId?: string;
  x?: number;
  y?: number;
  isDrawing?: boolean;
  isTyping?: boolean;
}) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('user-cursor-activity', activity);
  }
};

export const onUserCursorActivity = (callback: (activity: any) => void) => {
  const socket = getSocket();
  if (!socket) return () => {};
  
  socket.on('user-cursor-activity', callback);
  
  return () => {
    socket.off('user-cursor-activity', callback);
  };
};