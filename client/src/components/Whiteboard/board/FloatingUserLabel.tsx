import React, { useEffect } from 'react';

interface FloatingLabelProps {
  username: string;
  x: number;
  y: number;
  isDrawing: boolean;
  isTyping?: boolean;
  tool?: string;
  self?: boolean;
}

const getUserColor = (username: string) => {
  const colors = [
    { bg: '#e0f7fa', text: '#006064', arrow: '#80deea' },
    { bg: '#fff3e0', text: '#e65100', arrow: '#ffcc80' },
    { bg: '#f3e5f5', text: '#6a1b9a', arrow: '#ce93d8' },
    { bg: '#fbe9e7', text: '#bf360c', arrow: '#ffab91' },
    { bg: '#e8f5e9', text: '#1b5e20', arrow: '#a5d6a7' },
  ];
  // Fix for Type 'string' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
  // Use Array.prototype.reduce with split('') to ensure compatibility.
  const index = Math.abs(username.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length;
  return colors[index];
};

const FloatingUserLabel: React.FC<FloatingLabelProps> = ({ username, x, y, isDrawing, isTyping = false, tool, self = false }) => {
  useEffect(() => {
    const styleId = 'floating-label-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (self) return null;

  const styleFade = {
    animation: 'fadeIn 0.3s ease-in-out',
    transition: 'opacity 0.3s ease-in-out',
  };
  const color = getUserColor(username);
  const positionY = isTyping ? y - 50 : y - 40;

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: positionY,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        zIndex: 10002,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...styleFade,
      }}
    >
      <div
        style={{
          background: color.bg,
          color: color.text,
          padding: '6px 14px',
          borderRadius: '18px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap',
        }}
      >
        {isTyping ? `${username} is typing...` : `${username} (${tool || 'drawing'})`}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `12px solid ${color.arrow}`,
          marginTop: '2px',
        }}
      />
    </div>
  );
};

export default FloatingUserLabel;
