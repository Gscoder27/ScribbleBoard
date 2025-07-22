import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import Menu from './Menu';
import dottedGrid from '../resources/dotted-grid.png';
import rough from 'roughjs';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../constants';
import { createElements, type WhiteboardElement } from './utils/createElements';
import { v4 as uuidv4 } from 'uuid';
import { updateElements, addElement, replaceElements } from './whiteboardSlice';
import { drawElement, adjustElementCoordinates, adjustmentRequired } from './utils';
import { emitElementUpdate } from '@/lib/socketConn';
import { emitUserCursorActivity, onUserCursorActivity } from '@/lib/socketConn';
import { isWritingRef } from './utils/whiteboardStatus';
import { downloadWhiteboard } from './DownloadUtilities';
import ColorBrushControls from './ColorBrushControls';
import { getSocket } from '@/lib/socketConn';
import { toolTypes } from '../constants';
import FloatingLabels from './FloatingLabels';
import FloatingUserLabel from './FloatingUserLabel';
import { getResizeHandleAtPosition } from './utils/resizeUtils';

interface WhiteboardProps {
  isHost?: boolean;
  roomId?: string;
  username?: string;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ isHost, roomId, username }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const patternRef = useRef<CanvasPattern | null>(null);
  const liveElementRef = useRef<WhiteboardElement | null>(null);
  const lastEmitRef = useRef(Date.now());
  // Throttle outgoing drawing events for performance
  const THROTTLE_MS = 40; // Increase for more users, decrease for more real-time (20-50ms is typical)
  const [action, setAction] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTextPosition, setSelectedTextPosition] = useState<{ x1: number; y1: number } | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [tempTextId, setTempTextId] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(null);
  const [liveRemoteElements, setLiveRemoteElements] = useState<{ [userId: string]: any }>({});
  const userId = useRef<string>(sessionStorage.getItem('sb_user') ? JSON.parse(sessionStorage.getItem('sb_user')!).name : Math.random().toString(36).slice(2));

  // Enhanced canvas drag state
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastOffsetRef = useRef({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Auto-focus state
  const [isAutoFocusing, setIsAutoFocusing] = useState(false);
  const autoFocusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<{ userId: string; timestamp: number; position: { x: number; y: number } } | null>(null);

  // CURSOR 
  const [selectedElement, setSelectedElement] = useState<WhiteboardElement | null>(null);
  const resizeHandleRef = useRef<string | null>(null);
  const selectedElementIndex = useRef<number | null>(null);
  const leftManuallyRef = useRef(false);


  // State for other users' cursor/typing activity
  const [otherUsersCursors, setOtherUsersCursors] = useState<{
    [userId: string]: {
      username: string;
      tool: string;
      x: number;
      y: number;
      isDrawing: boolean;
      isTyping: boolean;
      lastUpdated: number;
    };
  }>({});

  const dispatch = useDispatch();

  interface WhiteboardPageState {
    tool: string;
    elements: WhiteboardElement[];
    strokeColor: string;
    brushSize: number;
  }

  interface RootState {
    whiteboardPage: WhiteboardPageState;
  }

  const toolType = useSelector((state: RootState) => state.whiteboardPage.tool);
  const elements = useSelector((state: RootState) => state.whiteboardPage.elements);
  const strokeColor = useSelector((state: RootState) => state.whiteboardPage.strokeColor);
  const brushSize = useSelector((state: RootState) => state.whiteboardPage.brushSize);

  // Get dynamic eraser size based on brush size
  const ERASER_SIZE = brushSize || 30;

  // Auto-focus function with smooth animation
  const focusOnActivity = (targetPosition: { x: number; y: number }, fromUserId: string) => {
    // Don't auto-focus on your own activity or if user is actively dragging
    if (fromUserId === userId.current || isDraggingCanvas) return;

    // Check if the target is already visible on screen
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screenX = targetPosition.x + canvasOffset.x;
    const screenY = targetPosition.y + canvasOffset.y;

    const margin = 100; // Pixel margin from screen edges
    const isVisible =
      screenX >= margin &&
      screenX <= canvas.width - margin &&
      screenY >= margin &&
      screenY <= canvas.height - margin;

    if (isVisible) return; // Already visible, no need to focus

    // Calculate target offset to center the activity
    const targetOffset = {
      x: canvas.width / 2 - targetPosition.x,
      y: canvas.height / 2 - targetPosition.y
    };

    // Smooth animation to target position
    setIsAutoFocusing(true);
    const startOffset = { ...canvasOffset };
    const duration = 800; // Animation duration in ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentOffset = {
        x: startOffset.x + (targetOffset.x - startOffset.x) * easeProgress,
        y: startOffset.y + (targetOffset.y - startOffset.y) * easeProgress
      };

      setCanvasOffset(currentOffset);
      lastOffsetRef.current = currentOffset;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAutoFocusing(false);
      }
    };

    requestAnimationFrame(animate);
  };

  // Enhanced socket listener for remote drawing activity and whiteboard state sync
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleRemoteElementUpdate = (elementData: any) => {
      const { userId: remoteUserId, isFinal, ...element } = elementData;

      // Don't process your own elements
      if (remoteUserId === userId.current) return;

      if (!isFinal) {
        // Live drawing - track activity for auto-focus
        setLiveRemoteElements(prev => ({
          ...prev,
          [remoteUserId]: element
        }));

        // Determine activity position
        let activityPosition = { x: element.x1 || 0, y: element.y1 || 0 };
        if (element.type === 'PEN' && element.points && element.points.length > 0) {
          const lastPoint = element.points[element.points.length - 1];
          activityPosition = { x: lastPoint.x, y: lastPoint.y };
        } else if (element.x2 !== undefined && element.y2 !== undefined) {
          // For shapes being drawn, use the current end position
          activityPosition = { x: element.x2, y: element.y2 };
        }

        // Update last activity and trigger auto-focus
        const now = Date.now();
        lastActivityRef.current = {
          userId: remoteUserId,
          timestamp: now,
          position: activityPosition
        };

        // Clear existing timeout and set new one
        if (autoFocusTimeoutRef.current) {
          clearTimeout(autoFocusTimeoutRef.current);
        }

        // Debounce auto-focus to avoid too frequent updates
        autoFocusTimeoutRef.current = setTimeout(() => {
          if (lastActivityRef.current &&
            lastActivityRef.current.userId === remoteUserId &&
            now - lastActivityRef.current.timestamp < 200) {
            focusOnActivity(activityPosition, remoteUserId);
          }
        }, 150);

      } else {
        // Final element - add to permanent elements and clear live tracking
        const existingIndex = elements.findIndex(el => el.id === element.id);
        if (existingIndex >= 0) {
          const updatedElements = [...elements];
          updatedElements[existingIndex] = element;
          dispatch(updateElements(updatedElements));
        } else {
          dispatch(addElement(element));
        }

        setLiveRemoteElements(prev => {
          const updated = { ...prev };
          delete updated[remoteUserId];
          return updated;
        });
      }
    };

    // Handle whiteboard state sync from server (when joining room)
    const handleWhiteboardState = (serverElements: any[]) => {
      console.log('🔄 Received whiteboard state from server:', serverElements.length, 'elements');
      if (Array.isArray(serverElements)) {
        dispatch(replaceElements(serverElements));
        // Also update localStorage with server state
        if (roomId) {
          localStorage.setItem(`whiteboard-elements-${roomId}`, JSON.stringify(serverElements));
        }
      }
    };

    socket.on('element-update', handleRemoteElementUpdate);
    socket.on('whiteboard-state', handleWhiteboardState);

    return () => {
      socket.off('element-update', handleRemoteElementUpdate);
      socket.off('whiteboard-state', handleWhiteboardState);
      if (autoFocusTimeoutRef.current) {
        clearTimeout(autoFocusTimeoutRef.current);
      }
    };
  }, [dispatch, elements, canvasOffset, isDraggingCanvas, roomId]);

  const getElementAtPosition = (x: number, y: number) => {
    return elements.find((el, index) => {
      if (el.deleted) return false;
      if (el.type === 'TEXT') {
        return x >= el.x1 && x <= el.x2 && y >= el.y1 && y <= el.y2;
      }
      if (el.type === 'RECTANGLE' || el.type === 'CIRCLE') {
        const minX = Math.min(el.x1, el.x2);
        const maxX = Math.max(el.x1, el.x2);
        const minY = Math.min(el.y1, el.y2);
        const maxY = Math.max(el.y1, el.y2);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      }
      if (el.type === 'LINE') {
        const a = { x: el.x1, y: el.y1 };
        const b = { x: el.x2, y: el.y2 };
        const distance = Math.abs((b.y - a.y) * x - (b.x - a.x) * y + b.x * a.y - b.y * a.x)
          / Math.hypot(b.x - a.x, b.y - a.y);
        return distance <= 8;
      }
      if (el.type === 'PEN' && el.points && el.points.length > 0) {
        // Calculate bounding box for pen
        const minX = Math.min(...el.points.map(p => p.x));
        const maxX = Math.max(...el.points.map(p => p.x));
        const minY = Math.min(...el.points.map(p => p.y));
        const maxY = Math.max(...el.points.map(p => p.y));
        // Add a buffer for easier selection
        const buffer = 5;
        if (x >= minX - buffer && x <= maxX + buffer && y >= minY - buffer && y <= maxY + buffer) {
          // Optionally, check if close to any point for more precise selection
          return el.points.some(pt => Math.abs(pt.x - x) <= buffer && Math.abs(pt.y - y) <= buffer);
        }
        return false;
      }
      return false;
    });
  };


  // Listen for user-cursor-activity events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = (activity: any) => {
      if (!activity || !activity.userId) return;
      if (activity.userId === userId.current) return; // Don't show your own
      setOtherUsersCursors(prev => ({
        ...prev,
        [activity.userId]: {
          username: activity.username,
          tool: activity.tool,
          x: activity.x,
          y: activity.y,
          isDrawing: activity.isDrawing,
          isTyping: activity.isTyping,
          lastUpdated: Date.now(),
        },
      }));
    };
    socket.on('user-cursor-activity', handler);
    return () => { socket.off('user-cursor-activity', handler); };
  }, []);

  // Cleanup stale cursors (e.g., user left, browser closed)
  useEffect(() => {
    const interval = setInterval(() => {
      setOtherUsersCursors(prev => {
        const now = Date.now();
        const updated: typeof prev = {};
        Object.entries(prev).forEach(([uid, data]) => {
          if (now - data.lastUpdated < 10000) {
            updated[uid] = data;
          }
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper to emit cursor/typing activity

  // const emitCursorActivity = (activity: Partial<{
  //   tool: string;
  //   x: number;
  //   y: number;
  //   isDrawing: boolean;
  //   isTyping: boolean;
  // }>) => {
  //   emitUserCursorActivity({
  //     userId: userId.current,
  //     username: username || userId.current,
  //     tool: activity.tool || toolType,
  //     roomId,
  //     x: activity.x || cursorPos.x,
  //     y: activity.y || cursorPos.y,
  //     isDrawing: activity.isDrawing || false,
  //     isTyping: activity.isTyping || false,
  //   });
  // };

  // const emitCursorActivity = (activity: Partial<{
  //   tool: string;
  //   x: number;
  //   y: number;
  //   isDrawing: boolean;
  //   isTyping: boolean;
  // }>) => {
  // Always use screen coordinates (not canvas coordinates) for cursor display
  //   emitUserCursorActivity({
  //     userId: userId.current,
  //     username: username || userId.current,
  //     tool: activity.tool || toolType,
  //     roomId,
  //     x: cursorPos.x,  // <- screen coordinate
  //     y: cursorPos.y,
  //     // x: activity.x !== undefined ? activity.x : cursorPos.x,
  //     // y: activity.y !== undefined ? activity.y : cursorPos.y,
  //     isDrawing: activity.isDrawing || false,
  //     isTyping: activity.isTyping || false,
  //   });
  // };

  const emitCursorActivity = (activity: Partial<{
    tool: string;
    isDrawing: boolean;
    isTyping: boolean;
  }>) => {
    // Use last known screenX, screenY
    emitUserCursorActivity({
      userId: userId.current,
      username: username || userId.current,
      tool: activity.tool || toolType,
      roomId,
      x: cursorPos.x, // ✅ screen coordinates (not canvas)
      y: cursorPos.y,
      isDrawing: activity.isDrawing || false,
      isTyping: activity.isTyping || false,
    });
  };


  // Download handler
  const handleDownload = (format: 'png' | 'pdf', quality: number) => {
    console.log('🎯 handleDownload called with:', { format, quality });
    console.log('🎯 Canvas ref exists:', !!canvasRef.current);
    console.log('🎯 Elements count:', elements.length);

    if (canvasRef.current) {
      downloadWhiteboard(canvasRef.current, elements, {
        format,
        quality,
        filename: `whiteboard_${new Date().toISOString().slice(0, 10)}`
      });
    } else {
      console.error('❌ Canvas ref is null');
    }
  };

  // Always use latest elements for eraser logic
  const elementsRef = useRef(elements);
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  // Listen for clear-whiteboard event and clear elements
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleClear = () => {
      dispatch(replaceElements([]));
      // Also clear localStorage for this room
      if (roomId) {
        localStorage.removeItem(`whiteboard-elements-${roomId}`);
      }
    };
    socket.on('clear-whiteboard', handleClear);
    return () => {
      socket.off('clear-whiteboard', handleClear);
    };
  }, [dispatch, roomId]);

  // Save elements and canvas offset to localStorage whenever they change (room-specific)
  useEffect(() => {
    if (roomId) {
      localStorage.setItem(`whiteboard-elements-${roomId}`, JSON.stringify(elements));
    }
  }, [elements, roomId]);

  useEffect(() => {
    if (roomId) {
      localStorage.setItem(`whiteboard-canvas-offset-${roomId}`, JSON.stringify(canvasOffset));
    }
  }, [canvasOffset, roomId]);

  // Load elements and canvas offset from localStorage on mount (room-specific)
  useEffect(() => {
    if (!roomId) return;

    const savedElements = localStorage.getItem(`whiteboard-elements-${roomId}`);
    if (savedElements) {
      try {
        const parsed = JSON.parse(savedElements);
        if (Array.isArray(parsed)) {
          dispatch(replaceElements(parsed));
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    const savedOffset = localStorage.getItem(`whiteboard-canvas-offset-${roomId}`);
    if (savedOffset) {
      try {
        const parsed = JSON.parse(savedOffset);
        if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setCanvasOffset(parsed);
          lastOffsetRef.current = parsed;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Cleanup function to remove old localStorage data when room changes
    return () => {
      // Keep the current room's data, but we could clean up old rooms here if needed
      // For now, we'll keep all room data to allow users to return to previous rooms
    };
  }, [dispatch, roomId]);

  // Autofocus when WRITING
  useEffect(() => {
    if (action === actions.WRITING && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [action, selectedTextPosition]);

  // Helper function to draw background pattern with proper offset
  const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, offset: { x: number; y: number }) => {
    if (!patternRef.current) return;

    ctx.save();

    // Calculate pattern offset to create seamless infinite pattern
    const patternSize = 64; // Assuming your dotted grid pattern is 64x64 (adjust based on your pattern)
    const offsetX = ((offset.x % patternSize) + patternSize) % patternSize;
    const offsetY = ((offset.y % patternSize) + patternSize) % patternSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill with background color first
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply pattern with offset
    ctx.fillStyle = patternRef.current;
    ctx.translate(offsetX, offsetY);
    ctx.fillRect(-offsetX, -offsetY, canvas.width + patternSize, canvas.height + patternSize);

    ctx.restore();
  };

  // Helper function to draw elements with canvas offset
  const drawElementsWithOffset = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, elementsToRender: WhiteboardElement[], offset: { x: number; y: number }) => {
    const roughCanvas = rough.canvas(canvas);

    ctx.save();
    ctx.translate(offset.x, offset.y);

    const visibleElements = elementsToRender.filter(el => !el.deleted);
    visibleElements.forEach(el => drawElement({ roughCanvas, element: el, context: ctx }));

    // Draw live element if exists
    if (liveElementRef.current) {
      drawElement({ roughCanvas, element: liveElementRef.current, context: ctx });
    }

    // Draw live remote elements
    Object.values(liveRemoteElements).forEach(remoteElement => {
      if (remoteElement) {
        drawElement({ roughCanvas, element: remoteElement, context: ctx });
      }
    });

    ctx.restore();
  };

  // Enhanced canvas resize and redraw function
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !patternRef.current) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw background with offset
    drawBackground(ctx, canvas, canvasOffset);

    // Draw elements with offset
    drawElementsWithOffset(ctx, canvas, elements, canvasOffset);
  };

  // Resize + draw background + elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.src = dottedGrid;
    img.onload = () => {
      patternRef.current = ctx.createPattern(img, 'repeat');
      redrawCanvas();
    };

    window.addEventListener('resize', redrawCanvas);
    return () => window.removeEventListener('resize', redrawCanvas);
  }, [canvasOffset, elements, liveRemoteElements]);

  // Re-render when Redux elements change or canvas offset changes
  useLayoutEffect(() => {
    if (action === actions.WRITING) return; // ✅ Avoid canvas redraw during text input

    redrawCanvas();
  }, [elements, canvasOffset, action, liveRemoteElements]);

  // Enhanced eraser function with offset consideration
  const handleEraserMove = (screenX: number, screenY: number) => {
    const distance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    const eraserRadius = Math.max(ERASER_SIZE, 20);

    // Convert screen coordinates to canvas coordinates
    const canvasX = screenX - canvasOffset.x;
    const canvasY = screenY - canvasOffset.y;

    let didErase = false;

    const updatedElements = elements.map((el) => {
      if (el.deleted) return el;

      // Check if element can be erased
      const canErase = isHost || el.userId === userId.current;
      if (!canErase) return el;

      let shouldErase = false;

      if (el.type === 'PEN' && el.points) {
        shouldErase = el.points.some((pt) => distance(canvasX, canvasY, pt.x, pt.y) <= eraserRadius);
      } else if (el.type === 'TEXT') {
        // Treat text as a rectangle for erasing
        const minX = Math.min(el.x1, el.x2);
        const maxX = Math.max(el.x1, el.x2);
        const minY = Math.min(el.y1, el.y2);
        const maxY = Math.max(el.y1, el.y2);

        shouldErase = (
          canvasX >= minX - eraserRadius &&
          canvasX <= maxX + eraserRadius &&
          canvasY >= minY - eraserRadius &&
          canvasY <= maxY + eraserRadius
        );
      } else {
        // For other shapes (RECTANGLE, CIRCLE, LINE)
        const minX = Math.min(el.x1, el.x2);
        const maxX = Math.max(el.x1, el.x2);
        const minY = Math.min(el.y1, el.y2);
        const maxY = Math.max(el.y1, el.y2);

        shouldErase = (
          canvasX >= minX - eraserRadius &&
          canvasX <= maxX + eraserRadius &&
          canvasY >= minY - eraserRadius &&
          canvasY <= maxY + eraserRadius
        );
      }

      if (shouldErase) {
        const deletedElement = { ...el, deleted: true };
        emitElementUpdate(deletedElement);
        didErase = true;
        return deletedElement;
      }

      return el;
    });

    if (didErase) {
      dispatch(updateElements(updatedElements));
    }
  };

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = (screenX: number, screenY: number) => ({
    x: screenX - canvasOffset.x,
    y: screenY - canvasOffset.y
  });

  // Add a helper to get the resize handle under the mouse
  const getResizeHandle = (element: WhiteboardElement | null, x: number, y: number) => {
    const handleSize = 10;
    if (!element) return null;
    const handles = [
      { name: 'nw', x: element.x1, y: element.y1 },
      { name: 'ne', x: element.x2, y: element.y1 },
      { name: 'sw', x: element.x1, y: element.y2 },
      { name: 'se', x: element.x2, y: element.y2 },
    ];
    for (const handle of handles) {
      if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
        return handle.name;
      }
    }
    return null;
  };

  // Enhanced pointer handlers with proper coordinate conversion
  const handlePointerDown = (screenX: number, screenY: number) => {
    if (toolType === 'CURSOR') {
      const canvasCoords = screenToCanvas(screenX, screenY);
      const targetEl = getElementAtPosition(canvasCoords.x, canvasCoords.y);
      if (targetEl) {
        const resizeHandle = getResizeHandleAtPosition(canvasCoords.x, canvasCoords.y, targetEl);
        if (resizeHandle) {
          setAction('RESIZING');
          setSelectedElement(targetEl);
          selectedElementIndex.current = elements.findIndex(e => e.id === targetEl.id);
          resizeHandleRef.current = resizeHandle.name;
        } else {
          setAction('MOVING');
          setSelectedElement(targetEl);
          selectedElementIndex.current = elements.findIndex(e => e.id === targetEl.id);
          dragStartRef.current = { x: screenX, y: screenY };
        }
      } else {
        setSelectedElement(null);
      }
      return;
    }

    if (toolType === 'DRAG') {
      // Stop auto-focus when user starts dragging
      setIsAutoFocusing(false);
      if (autoFocusTimeoutRef.current) {
        clearTimeout(autoFocusTimeoutRef.current);
      }

      dragStartRef.current = { x: screenX, y: screenY };
      setIsDraggingCanvas(true);
      return;
    }

    const { x: canvasX, y: canvasY } = screenToCanvas(screenX, screenY);

    if (toolType === 'ERASER') {
      setIsErasing(true);
      handleEraserMove(screenX, screenY);
      setEraserPos({ x: screenX, y: screenY });
      return;
    }

    if (toolType === 'TEXT') {
      setTimeout(() => {
        setAction(actions.WRITING);
        isWritingRef.current = true;
        setSelectedTextPosition({ x1: canvasX, y1: canvasY });
        setCurrentText('');
        setTempTextId(uuidv4());

        // Emit typing activity when text input starts
        emitCursorActivity({
          tool: toolType,
          isDrawing: true,
          isTyping: false,
        });
      }, 0);
      return;
    }

    if (toolType === 'PEN') {
      const element = createElements({
        x1: canvasX, y1: canvasY, x2: canvasX, y2: canvasY,
        toolType, id: uuidv4(), strokeColor, strokeWidth: brushSize, userId: userId.current
      });
      liveElementRef.current = element;
      setIsDrawing(true);
    } else if ((toolType === 'RECTANGLE' || toolType === 'LINE' || toolType === 'CIRCLE') && action !== actions.DRAWING) {
      setAction(actions.DRAWING);
      const element = createElements({
        x1: canvasX, y1: canvasY, x2: canvasX, y2: canvasY,
        toolType, id: uuidv4(), strokeColor, strokeWidth: brushSize, userId: userId.current
      });
      liveElementRef.current = element;
    }
  };

  const emitLiveElement = (element: any, isFinal: boolean) => {
    emitElementUpdate({ ...element, userId: userId.current, isFinal });
  };

  const handlePointerMove = (screenX: number, screenY: number) => {

    if (toolType === 'CURSOR' && action === 'MOVING' && selectedElement) {
      const dx = screenX - dragStartRef.current.x;
      const dy = screenY - dragStartRef.current.y;

      const index = selectedElementIndex.current;
      if (index != null && index >= 0) {
        const el = elements[index];
        let newEl;
        // if (el.type === 'PEN') {
        //   // Move all points by dx, dy
        //   const movedPoints = (el.points || []).map(pt => ({ x: pt.x + dx, y: pt.y + dy }));
        //   newEl = { ...el, points: movedPoints };
        // } else {
        //   newEl = { ...el, x1: el.x1 + dx, y1: el.y1 + dy, x2: el.x2 + dx, y2: el.y2 + dy };
        // }
        if (el.type === 'PEN') {
          const movedPoints = (el.points || []).map(pt => ({
            x: pt.x + dx,
            y: pt.y + dy
          }));
          const minX = Math.min(...movedPoints.map(p => p.x));
          const minY = Math.min(...movedPoints.map(p => p.y));
          const maxX = Math.max(...movedPoints.map(p => p.x));
          const maxY = Math.max(...movedPoints.map(p => p.y));
        
          newEl = {
            ...el,
            points: movedPoints,
            x1: minX,
            y1: minY,
            x2: maxX,
            y2: maxY
          };
        } else {
          newEl = { ...el, x1: el.x1 + dx, y1: el.y1 + dy, x2: el.x2 + dx, y2: el.y2 + dy };
          }
        const updated = [...elements];
        updated[index] = newEl;
        dispatch(updateElements(updated));
        emitElementUpdate(newEl);
        dragStartRef.current = { x: screenX, y: screenY };
        // Broadcast cursor activity for moving items
        emitCursorActivity({
          tool: 'CURSOR',
          isDrawing: true,
          isTyping: false
        });
      }
      return;
    }

    if (action === 'RESIZING' && selectedElement) {
      const index = selectedElementIndex.current;
      const handle = resizeHandleRef.current;
      if (index == null || !handle) return;
      const { x: mouseX, y: mouseY } = screenToCanvas(screenX, screenY);
      const el = elements[index];
      let newX1 = el.x1;
      let newY1 = el.y1;
      let newX2 = el.x2;
      let newY2 = el.y2;
      if (handle.includes('n')) newY1 = mouseY;
      if (handle.includes('s')) newY2 = mouseY;
      if (handle.includes('w')) newX1 = mouseX;
      if (handle.includes('e')) newX2 = mouseX;
      let updatedEl = {
        ...el,
        x1: newX1,
        y1: newY1,
        x2: newX2,
        y2: newY2,
      };
      // For text, update bounding box width/height
      if (el.type === 'TEXT') {
        updatedEl.x2 = newX2;
        updatedEl.y2 = newY2;
      }
      // For circle, update bounding box (center/radius will be recalculated in draw)
      if (el.type === 'CIRCLE') {
        updatedEl.x1 = newX1;
        updatedEl.y1 = newY1;
        updatedEl.x2 = newX2;
        updatedEl.y2 = newY2;
      }
      dispatch(updateElements([
        ...elements.slice(0, index),
        updatedEl,
        ...elements.slice(index + 1),
      ]));
      emitElementUpdate(updatedEl);
      return;
    }

    if (action === 'MOVING' && selectedElement?.type === 'PEN') {
      const dx = screenX - dragStartRef.current.x;
      const dy = screenY - dragStartRef.current.y;
      const updatedPoints = selectedElement.points?.map(p => ({
        x: p.x + dx - selectedElement.x1,
        y: p.y + dy - selectedElement.y1,
      }));
      const updatedPen = {
        ...selectedElement,
        x1: dx,
        y1: dy,
        x2: dx + 1,
        y2: dy + 1,
        points: updatedPoints,
      };
      dispatch(updateElements([
        ...elements.slice(0, selectedElementIndex.current!),
        updatedPen,
        ...elements.slice(selectedElementIndex.current! + 1),
      ]));
      emitElementUpdate(updatedPen);
      return;
    }

    if (action === 'RESIZING' && selectedElement?.type === 'TEXT') {
      const handle = resizeHandleRef.current;
      const { x, y } = screenToCanvas(screenX, screenY);
      let newWidth = Math.abs(x - selectedElement.x1);
      let newHeight = Math.abs(y - selectedElement.y1);
      const updatedText = {
        ...selectedElement,
        x2: selectedElement.x1 + newWidth,
        y2: selectedElement.y1 + newHeight,
      };
      dispatch(updateElements([
        ...elements.slice(0, selectedElementIndex.current!),
        updatedText,
        ...elements.slice(selectedElementIndex.current! + 1),
      ]));
      emitElementUpdate(updatedText);
      return;
    }


    if (toolType === 'DRAG' && isDraggingCanvas) {
      const dx = screenX - dragStartRef.current.x;
      const dy = screenY - dragStartRef.current.y;

      const newOffset = {
        x: lastOffsetRef.current.x + dx,
        y: lastOffsetRef.current.y + dy
      };

      setCanvasOffset(newOffset);
      return;
    }

    setCursorPos({ x: screenX, y: screenY });
    const { x: canvasX, y: canvasY } = screenToCanvas(screenX, screenY);

    if (toolType === 'ERASER') {
      setEraserPos({ x: screenX, y: screenY });
      if (isErasing) {
        handleEraserMove(screenX, screenY);
      }
      // Emit cursor activity for eraser tool so others see the floating label follow
      emitCursorActivity({
        tool: 'ERASER',
        isDrawing: isErasing,
        isTyping: false,
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !patternRef.current) return;

    if (toolType === 'PEN' && isDrawing && liveElementRef.current) {
      liveElementRef.current = {
        ...liveElementRef.current,
        points: [...(liveElementRef.current.points || []), { x: canvasX, y: canvasY }]
      };
    } else if (action === actions.DRAWING && liveElementRef.current) {
      liveElementRef.current = {
        ...liveElementRef.current,
        x2: canvasX,
        y2: canvasY,
      };
    } else {
      return;
    }

    // Immediate canvas update for smoother drawing
    drawBackground(ctx, canvas, canvasOffset);
    drawElementsWithOffset(ctx, canvas, elements, canvasOffset);

    const now = Date.now();
    if (now - lastEmitRef.current > THROTTLE_MS) {
      emitLiveElement(liveElementRef.current, false);
      lastEmitRef.current = now;
    }

    // Emit cursor activity for all tools including position
    emitCursorActivity({
      tool: toolType,
      isDrawing: isDrawing || (action === actions.DRAWING),
      isTyping: false,
    });
  };



  const handlePointerUp = () => {
    if (toolType === 'CURSOR' && action === 'MOVING') {
      setAction(null);
      setSelectedElement(null);
      selectedElementIndex.current = null;
      emitCursorActivity({ tool: 'CURSOR', isDrawing: false, isTyping: false });
      return;
    }

    if (action === 'RESIZING') {
      setAction(null);
      setSelectedElement(null);
      selectedElementIndex.current = null;
      resizeHandleRef.current = null;
      return;
    }

    if (toolType === 'DRAG') {
      setIsDraggingCanvas(false);
      lastOffsetRef.current = canvasOffset;
      return;
    }

    if (toolType === 'ERASER') {
      setIsErasing(false);
      setTimeout(() => {
        if (!isErasing) {
          setEraserPos(null);
        }
      }, 100);
      return;
    }

    if (toolType === 'TEXT') return;

    if (toolType === 'PEN' && isDrawing && liveElementRef.current) {
      let finalElement = liveElementRef.current;
      if (adjustmentRequired(finalElement.type)) {
        const adjusted = adjustElementCoordinates(finalElement);
        if (adjusted) finalElement = { ...finalElement, ...adjusted };
      }
      dispatch(updateElements([...elements, finalElement]));
      emitLiveElement(finalElement, true);
      liveElementRef.current = null;
      setIsDrawing(false);
      return;
    }

    if (!liveElementRef.current) return;

    let finalElement = liveElementRef.current;
    if (adjustmentRequired(finalElement.type)) {
      const adjusted = adjustElementCoordinates(finalElement);
      if (adjusted) finalElement = { ...finalElement, ...adjusted };
    }
    dispatch(updateElements([...elements, finalElement]));
    emitLiveElement(finalElement, true);
    liveElementRef.current = null;
    setAction(null);

    // Emit cursor activity when stopping any tool
    emitCursorActivity({
      tool: toolType,
      isDrawing: false,
      isTyping: false,
    });
  };  

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePointerDown(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handlePointerUp();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    handlePointerDown(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    handlePointerMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handlePointerUp();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentText(value);

    // Emit typing activity
    emitCursorActivity({
      tool: 'TEXT',
      // x: selectedTextPosition ? selectedTextPosition.x1 + canvasOffset.x : 0,
      // y: selectedTextPosition ? selectedTextPosition.y1 + canvasOffset.y : 0,
      isTyping: true,
      isDrawing: false,
    });

    if (selectedTextPosition && tempTextId) {
      emitElementUpdate({
        id: tempTextId,
        type: 'TEXT',
        x1: selectedTextPosition.x1,
        y1: selectedTextPosition.y1,
        x2: selectedTextPosition.x1 + 200,
        y2: selectedTextPosition.y1 + 24,
        text: value,
        seed: 0,
        strokeColor,
        userId: userId.current,
      });
    }
  };

  // When text input loses focus, emit isTyping: false
  const handleTextBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      emitCursorActivity({
        tool: 'TEXT',
        isTyping: false,
      });
    }, 0);
    const text = e.target.value;
    setTimeout(() => {
      isWritingRef.current = false;
      if (text.trim() !== '') {
        const id = tempTextId || uuidv4();
        const newTextElement = createElements({
          id,
          x1: selectedTextPosition!.x1,
          y1: selectedTextPosition!.y1,
          x2: selectedTextPosition!.x1 + 200,
          y2: selectedTextPosition!.y1 + 24,
          toolType: 'TEXT',
          text,
          strokeColor,
          userId: userId.current,
        });
        dispatch(addElement(newTextElement));
        emitElementUpdate(newTextElement);
      }
      setSelectedTextPosition(null);
      setAction(null);
      setCurrentText('');
      setTempTextId(null);
    }, 0);
  };

  return (
    <>
      <Menu onDownload={handleDownload} isHost={isHost} />
      <ColorBrushControls />
      {/* Show other users' floating labels */}
      {roomId && <FloatingLabels roomId={roomId} />}

      {/* Auto-focus indicator */}
      {isAutoFocusing && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '8px 16px',
            backgroundColor: 'rgba(100, 108, 255, 0.9)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 10001,
            pointerEvents: 'none',
            animation: 'fadeInOut 0.8s ease-in-out',
          }}
        >
          Following activity...
        </div>
      )}

      {/* Enhanced eraser overlay with screen coordinates */}
      {toolType === 'ERASER' && eraserPos && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: eraserPos.x - ERASER_SIZE / 2,
            top: eraserPos.y - ERASER_SIZE / 2,
            width: ERASER_SIZE,
            height: ERASER_SIZE,
            borderRadius: '50%',
            border: '2px solid #646cff',
            background: isErasing ? 'rgba(255,100,100,0.2)' : 'rgba(100,108,255,0.08)',
            zIndex: 10000,
            boxSizing: 'border-box',
            transition: 'background 0.1s',
          }}
        />
      )}

      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={canvasRef}
        className="whiteboard-canvas"
        tabIndex={-1}
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
          backgroundColor: '#f8f9fa',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          cursor: toolType === 'ERASER' ? 'none'
            : toolType === 'DRAG' ? (isDraggingCanvas ? 'grabbing' : 'grab')
              : 'crosshair',
        }}
      />

      {/* Self cursor label */}
      {/* <FloatingUserLabel
        username={username || 'You'}
        x={cursorPos.x}
        y={cursorPos.y}
        isDrawing={isDrawing && toolType !== 'TEXT'}
        self={true}
      /> */}

      <FloatingUserLabel
        username={username || 'You'}
        x={cursorPos.x}
        y={cursorPos.y}
        isDrawing={isDrawing && toolType !== 'TEXT'}
        self={true}
      />

      {/* Enhanced text input with canvas offset consideration */}
      {action === actions.WRITING && selectedTextPosition && (
        <textarea
          ref={textAreaRef}
          value={currentText}
          onChange={handleTextChange}
          style={{
            position: 'fixed',
            top: selectedTextPosition.y1 + canvasOffset.y,
            left: selectedTextPosition.x1 + canvasOffset.x,
            fontSize: 24,
            zIndex: 10,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '4px',
            outline: 'none',
            resize: 'none',
            minWidth: '150px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          placeholder="Enter text"
          onFocus={() => {
            emitCursorActivity({
              tool: 'TEXT',
              isTyping: true,
            });
          }}
          onBlur={handleTextBlur}
        />
      )}

      {/* Other users' cursor labels and typing indicators */}
      {/* {Object.entries(otherUsersCursors).map(([uid, data]) => (
        <FloatingUserLabel
          key={uid}
          username={data.username}
          x={data.x || 0}
          y={data.y || 0}
          isDrawing={data.isDrawing}
          isTyping={data.isTyping}
          self={false}
        />
      ))} */}

      {/* Rendering FloatingUserLabels (excluding self) */}
      {Object.entries(otherUsersCursors).map(([uid, data]) => (
        <FloatingUserLabel
          key={uid}
          username={data.username}
          x={data.x}
          y={data.y}
          isTyping={data.isTyping}
          isDrawing={data.isDrawing}
          self={uid === userId.current}
        />
      ))}

      {/* Draw resize handles for the selected element */}
      {selectedElement && toolType === 'CURSOR' && (
        <>
          {['nw', 'ne', 'sw', 'se'].map(dir => {
            let x = dir[1] === 'w' ? selectedElement.x1 : selectedElement.x2;
            let y = dir[0] === 'n' ? selectedElement.y1 : selectedElement.y2;
            return (
              <div
                key={dir}
                style={{
                  position: 'fixed',
                  left: x + canvasOffset.x - 5,
                  top: y + canvasOffset.y - 5,
                  width: 10,
                  height: 10,
                  background: '#646cff',
                  borderRadius: 2,
                  zIndex: 10003,
                  pointerEvents: 'none',
                }}
              />
            );
          })}
        </>
      )}

      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Whiteboard;