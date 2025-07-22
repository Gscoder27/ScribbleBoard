import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTool, undo, redo, replaceElements } from './whiteboardSlice';
import rectangle_icon from '../resources/rectangle_icon.png';
import circle_icon from '../resources/circle_icon.png';
import cursor_icon from '../resources/cursor_icon.png';
import text_icon from '../resources/text_icon.png';
import pen_icon from '../resources/pen_icon.png';
import line_icon from '../resources/line_icon.png';
import clear_icon from '../resources/clear_icon.png';
import eraser_icon from '../resources/eraser_icon.png';
import redo_icon from '../resources/redo_icon.png';
import undo_icon from '../resources/undo_icon.png';
import share_icon from '../resources/share_icon.png';
import download_icon from '../resources/download_icon.png';
import handdrag_icon from '../resources/handdrag_icon.png';
import { getSocket } from '@/lib/socketConn';
import DownloadModal from './DownloadModal';
import { useLocation } from 'wouter';

interface RootState {
  whiteboardPage: {
    tool: string | null;
  };
}

type IconButtonProps = {
  src: string;
  type?: string;
  title?: string;
  onclick?: () => void;
  selected?: boolean;
  onClear?: () => void;
  onDownload?: () => void;
  disabled?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({ 
  src, 
  type, 
  title = "icon button", 
  onclick,
  onClear, 
  selected, 
  onDownload,
  disabled = false
}) => {
  const dispatch = useDispatch();
  
  const handleClick = () => {
    if (disabled) return;
    
    if (type === 'CLEAR') {
      onClear?.();
    } 
    else if (type === 'DOWNLOAD') {
      onDownload?.();
    }
    else if (type === 'UNDO' || type === 'REDO' || type === 'SHARE') {
      onclick?.();
    }
    else {
      dispatch(setTool(type ?? 'RECTANGLE'));
    }
  };

  return (
    <button
      onClick={handleClick}
      title={disabled ? `${title} (Host only)` : title}
      disabled={disabled}
      className={`menu-button${selected ? ' menu-button_active' : ''}${disabled ? ' menu-button_disabled' : ''}`}
      style={{
        width: '44px',
        height: '44px',
        padding: '6px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...(selected ? {
          border: '2px solid #646cff',
          background: '#e0e7ff',
          boxShadow: '0 2px 8px rgba(100,108,255,0.15)',
        } : {})
      }}
    >
      <img 
        width="32px" 
        height="32px" 
        src={src} 
        alt={type || title} 
        className="object-contain"
        style={{
          width: '32px',
          height: '32px',
          objectFit: 'contain'
        }}
      />
    </button>
  );
};

interface MenuProps {
  onDownload?: (format: 'png' | 'pdf', quality: number) => void;
  isHost?: boolean;
}

const Menu: React.FC<MenuProps> = ({ onDownload, isHost = false }) => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const currentTool = useSelector((state: RootState) => state.whiteboardPage.tool);
  const [location] = useLocation();
  const roomId = location.split('/').pop() || '';

  // Listen for clear whiteboard events and errors
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    const handleClearError = (message: string) => {
      setErrorMessage(message);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    };

    const handleClearSuccess = (message: string) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    };
    
    socket.on('clear-whiteboard-error', handleClearError);
    socket.on('clear-whiteboard-success', handleClearSuccess);
    
    return () => {
      socket.off('clear-whiteboard-error', handleClearError);
      socket.off('clear-whiteboard-success', handleClearSuccess);
    };
  }, []);

  // Close popup on outside click
  useEffect(() => {
    if (!showSharePopup) return;
    function handleClick(e: MouseEvent) {
      const popup = document.getElementById('share-room-popup');
      if (popup && !popup.contains(e.target as Node)) {
        setShowSharePopup(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSharePopup]);

  const handleClear = () => {
    console.log('🧹 Clear button clicked - isHost:', isHost);
    
    if (isHost) {
      // Host clears for everyone via socket
      console.log('🧹 Host clearing canvas for room:', roomId);
      const socket = getSocket();
      if (socket) {
        socket.emit('clear-whiteboard', roomId);
        // Clear locally immediately for better UX
        dispatch(replaceElements([]));
        if (roomId) {
          localStorage.removeItem(`whiteboard-elements-${roomId}`);
        }
        setToastMessage('🧹 Canvas cleared for everyone!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } else {
        console.error('❌ Socket not available');
        setErrorMessage('Connection error - cannot clear canvas');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } else {
      // Non-host only clears their own canvas
      console.log('🧹 Non-host clearing local canvas only');
      dispatch(replaceElements([]));
      if (roomId) {
        localStorage.removeItem(`whiteboard-elements-${roomId}`);
      }
      setToastMessage('🧹 Your canvas cleared!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleDownloadClick = () => {
    console.log('Download button clicked!');
    setShowDownloadModal(true);
  };

  const handleDownloadConfirm = (format: 'png' | 'pdf', quality: number) => {
    console.log('Download confirmed:', { format, quality });
    if (onDownload) {
      onDownload(format, quality);
    }
    setShowDownloadModal(false);
  };

  const handleUndo = () => dispatch(undo());
  const handleRedo = () => dispatch(redo());

  return (
    <div>
      <div className="menu_container responsive_menu mr-0 sm:mr-48" >
        <IconButton src={cursor_icon} type="CURSOR" title="Cursor Tool" selected={currentTool === 'CURSOR'} />
        <IconButton src={eraser_icon} type="ERASER" title="Eraser Tool" selected={currentTool === 'ERASER'} />
        <IconButton src={pen_icon} type="PEN" title="Pen Tool" selected={currentTool === 'PEN'} />
        <IconButton src={line_icon} type="LINE" title="Line Tool" selected={currentTool === 'LINE'} />
        <IconButton src={rectangle_icon} type="RECTANGLE" title="Rectangle Tool" selected={currentTool === 'RECTANGLE'} />
        <IconButton src={circle_icon} type="CIRCLE" title="Circle Tool" selected={currentTool === 'CIRCLE'} />
        <IconButton src={text_icon} type="TEXT" title="Text Tool" selected={currentTool === 'TEXT'} />
        <IconButton 
          src={clear_icon} 
          type="CLEAR" 
          title={isHost ? "Clear Canvas (Everyone)" : "Clear Canvas (Local Only)"} 
          onClear={handleClear} 
        />
        <IconButton src={undo_icon} type="UNDO" title="Undo" onclick={handleUndo} />
        <IconButton src={redo_icon} type="REDO" title="Redo" onclick={handleRedo} />
        <IconButton src={handdrag_icon} type="DRAG" title="Drag" selected={currentTool === 'DRAG'} />
        <IconButton src={download_icon} type="DOWNLOAD" title="Download" onDownload={handleDownloadClick} />
        <IconButton src={share_icon} type="SHARE" title="Share Tool" onclick={() => setShowSharePopup(v => !v)} selected={showSharePopup} />
      </div>

      {showSharePopup && (
        <div
          id="share-room-popup"
          style={{
            position: 'absolute',
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            border: '2px solid #222',
            borderRadius: '16px',
            padding: '24px 24px 20px 24px',
            zIndex: 100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            minWidth: 280,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setShowSharePopup(false)}
            style={{
              position: 'absolute',
              top: 8,
              right: 12,
              background: 'transparent',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              color: '#888',
              padding: 0,
              zIndex: 2,
            }}
            title="Close"
          >
            ×
          </button>
          <div style={{ fontWeight: 'bold', marginBottom: 12, marginTop: 4, fontSize: 18 }}>Share Room ID:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
            <input
              value={roomId}
              readOnly
              title="Room ID"
              placeholder="Room ID"
              style={{
                border: '1px solid #888',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: 16,
                width: 180
              }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(roomId)}
              style={{
                background: '#f3f3f3',
                border: '1px solid #888',
                borderRadius: 6,
                padding: '6px 10px',
                cursor: 'pointer'
              }}
              title="Copy Room ID"
            >
              📋
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: '#28a745',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {toastMessage}
        </div>
      )}

      {showErrorToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: '#dc3545',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          ❌ {errorMessage}
        </div>
      )}

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownloadConfirm}
      />

      <style>{`
        .menu-button, .menu-button_active {
          width: 48px !important;
          height: 48px !important;
          transition: width 0.2s, height 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .menu-button:hover, .menu-button_active:hover {
          transform: scale(1.18) translateY(-10px) !important;
          box-shadow: 0 8px 24px rgba(100,108,255,0.18);
          z-index: 2;
        }
        .menu-button_disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        .menu-button_disabled:hover {
          transform: none !important;
          box-shadow: none !important;
        }
        .responsive_menu {
          min-width: 180px;
          width: 90vw;
          max-width: 700px;
          gap: 2px;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1), max-width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .responsive_menu:hover {
          width: 98vw;
          max-width: 900px;
        }
        @media (max-width: 600px) {
          .responsive_menu {
            width: 98vw;
            max-width: 98vw;
            gap: 4px;
            padding: 4px 0;
          }
          .menu-button, .menu-button_active {
            width: 40px !important;
            height: 40px !important;
          }
          .menu-button:hover, .menu-button_active:hover {
            transform: scale(1.18) translateY(-8px) !important;
          }
        }
        .menu-button_active {
          border: 2px solid #646cff !important;
          background: #e0e7ff !important;
          box-shadow: 0 2px 8px rgba(100,108,255,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Menu;

// Additional socket event handlers for Whiteboard component
// Add this to your Whiteboard component's useEffect:

/*
In Whiteboard.tsx, update the socket event listeners:

useEffect(() => {
  const socket = getSocket();
  if (!socket) return;
  
  const handleClear = () => {
    console.log('🧹 Received clear-whiteboard event');
    dispatch(replaceElements([]));
    localStorage.removeItem('whiteboard-elements');
  };
  
  const handleClearError = (message: string) => {
    console.error('❌ Clear whiteboard error:', message);
  };
  
  const handleClearSuccess = (message: string) => {
    console.log('✅ Clear whiteboard success:', message);
  };
  
  socket.on('clear-whiteboard', handleClear);
  socket.on('clear-whiteboard-error', handleClearError);
  socket.on('clear-whiteboard-success', handleClearSuccess);
  
  return () => {
    socket.off('clear-whiteboard', handleClear);
    socket.off('clear-whiteboard-error', handleClearError);
    socket.off('clear-whiteboard-success', handleClearSuccess);
  };
}, [dispatch]);
*/