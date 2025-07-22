// 3. Create the ColorBrushControls component (ColorBrushControls.tsx):

import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStrokeColor, setBrushSize } from './whiteboardSlice';
import { emitBrushSizeChange } from '@/lib/socketConn';
import { HexColorPicker, RgbColorPicker } from 'react-colorful';

interface WhiteboardPageState {
  tool: string;
  elements: unknown[]; // Specify a more precise type if possible
  strokeColor: string;
  brushSize: number;
}

interface RootState {
  whiteboardPage: WhiteboardPageState;
}

const ColorBrushControls: React.FC = () => {
  const dispatch = useDispatch();
  const strokeColor = useSelector((state: RootState) => state.whiteboardPage.strokeColor);
  const brushSize = useSelector((state: RootState) => state.whiteboardPage.brushSize);
  const toolType = useSelector((state: RootState) => state.whiteboardPage.tool);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorMode, setColorMode] = useState<'hex' | 'rgb'>('hex');
  const [tempColor, setTempColor] = useState(strokeColor);
  const colorPaletteRef = useRef<HTMLDivElement>(null);

  // Convert hex to rgb and vice versa
  function hexToRgb(hex: string) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }
  function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
    return (
      '#' +
      [r, g, b]
        .map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  // Handle brush size change
  const handleBrushSizeChange = (size: number) => {
    dispatch(setBrushSize(size));
    emitBrushSizeChange(size);
  };

  // Click outside to close dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get brush size range based on tool
  const getBrushSizeRange = () => {
    switch (toolType) {
      case 'ERASER':
        return { min: 10, max: 100, step: 5 };
      case 'PEN':
        return { min: 1, max: 20, step: 1 };
      default:
        return { min: 1, max: 10, step: 1 };
    }
  };

  const { min, max, step } = getBrushSizeRange();

  return (
    <div
      style={{
          position: 'fixed',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, #f0f4ff 70%, #e0e7ef 100%)',
          border: '2px solid #bfc9e0',
          borderRadius: '22px',
          boxShadow: '0 12px 36px rgba(80,80,120,0.18), 0 2px 8px rgba(100,100,150,0.10)',
          padding: '32px 32px 26px 32px',
          minWidth: 240,
          maxWidth: 300,
          backgroundImage: `repeating-linear-gradient(135deg, #e6eaf3 0 2px, transparent 2px 32px)`,
        }}
      >
        {/* Header with icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}><rect x="3" y="3" width="18" height="18" rx="5" fill="#646cff"/><rect x="7" y="7" width="10" height="10" rx="3" fill="#fff"/></svg>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#23244a', letterSpacing: 0.5 }}>Brush & Color</span>
        </div>
        {/* Color Picker Control (hide for eraser) */}
        {toolType !== 'ERASER' && (
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, display: 'block', letterSpacing: 0.2 }}>Stroke Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '2px solid #646cff',
                  background: strokeColor,
                  cursor: 'pointer',
                  marginRight: 6,
                  boxShadow: '0 2px 8px rgba(100,100,150,0.13)',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                title="Click to open advanced color picker"
                onClick={() => {
                  setTempColor(strokeColor);
                  setShowColorPicker(true);
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.10)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Native color input */}
              <input
                type="color"
                value={strokeColor}
                onChange={e => {
                  dispatch(setStrokeColor(e.target.value));
                }}
                style={{
                  width: 28,
                  height: 28,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderRadius: 6,
                  boxShadow: '0 1px 4px rgba(100,100,150,0.10)',
                  padding: 0,
                }}
                title="Quick color picker"
              />
              <span style={{ fontSize: 15, color: '#23244a', fontWeight: 600 }}>{strokeColor}</span>
            </div>
            {/* Color Picker Modal/Dropdown */}
            {showColorPicker && (
              <div style={{
                position: 'absolute',
                left: 50,
                top: 0,
                zIndex: 2000,
                background: 'white',
                border: '2px solid #bfc9e0',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(80,80,120,0.18)',
                padding: 14,
                minWidth: 220,
                maxWidth: 260,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button
                    style={{ fontWeight: 600, fontSize: 13, color: colorMode === 'hex' ? '#646cff' : '#23244a', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setColorMode('hex')}
                  >HEX</button>
                  <button
                    style={{ fontWeight: 600, fontSize: 13, color: colorMode === 'rgb' ? '#646cff' : '#23244a', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setColorMode('rgb')}
                  >RGB</button>
                  <button
                    style={{ fontWeight: 600, fontSize: 13, color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setShowColorPicker(false)}
                  >✕</button>
                </div>
                {colorMode === 'hex' ? (
                  <>
                    <HexColorPicker color={tempColor} onChange={setTempColor} style={{ width: '100%', height: 120, marginBottom: 8 }} />
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="text"
                        value={tempColor}
                        onChange={e => setTempColor(e.target.value)}
                        style={{ width: 80, fontSize: 13, padding: 3, border: '1px solid #bfc9e0', borderRadius: 5 }}
                        maxLength={7}
                        title="Hex color code"
                        placeholder="#RRGGBB"
                      />
                      <button
                        style={{ fontSize: 13, color: '#646cff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => {
                          dispatch(setStrokeColor(tempColor));
                          setShowColorPicker(false);
                        }}
                      >Apply</button>
                    </div>
                  </>
                ) : (
                  <>
                    <RgbColorPicker color={hexToRgb(tempColor)} onChange={rgb => setTempColor(rgbToHex(rgb))} style={{ width: '100%', height: 120, marginBottom: 8 }} />
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        value={hexToRgb(tempColor).r}
                        min={0}
                        max={255}
                        onChange={e => setTempColor(rgbToHex({ ...hexToRgb(tempColor), r: Number(e.target.value) }))}
                        style={{ width: 32, fontSize: 13, padding: 3, border: '1px solid #bfc9e0', borderRadius: 5 }}
                        title="Red value"
                        placeholder="R"
                      />
                      <input
                        type="number"
                        value={hexToRgb(tempColor).g}
                        min={0}
                        max={255}
                        onChange={e => setTempColor(rgbToHex({ ...hexToRgb(tempColor), g: Number(e.target.value) }))}
                        style={{ width: 32, fontSize: 13, padding: 3, border: '1px solid #bfc9e0', borderRadius: 5 }}
                        title="Green value"
                        placeholder="G"
                      />
                      <input
                        type="number"
                        value={hexToRgb(tempColor).b}
                        min={0}
                        max={255}
                        onChange={e => setTempColor(rgbToHex({ ...hexToRgb(tempColor), b: Number(e.target.value) }))}
                        style={{ width: 32, fontSize: 13, padding: 3, border: '1px solid #bfc9e0', borderRadius: 5 }}
                        title="Blue value"
                        placeholder="B"
                      />
                      <button
                        style={{ fontSize: 13, color: '#646cff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => {
                          dispatch(setStrokeColor(tempColor));
                          setShowColorPicker(false);
                        }}
                      >Apply</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {/* Divider */}
        <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg, #bfc9e0 0%, #f3f4f6 100%)', margin: '12px 0 20px 0', opacity: 0.9, borderRadius: 2 }} />
        {/* Brush Size Control (always shown) */}
        <div>
          <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, display: 'block', letterSpacing: 0.2 }}>{toolType === 'ERASER' ? 'Eraser Size' : 'Brush Size'}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={brushSize}
              onChange={e => handleBrushSizeChange(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: '#646cff', height: 6, borderRadius: 3, background: '#e0e7ef' }}
              title={toolType === 'ERASER' ? 'Eraser size' : 'Brush size'}
              placeholder={toolType === 'ERASER' ? 'Eraser size' : 'Brush size'}
            />
            <span style={{ fontSize: 15, color: '#23244a', minWidth: 36, textAlign: 'center', fontWeight: 700 }}>{brushSize}</span>
          </div>
          {/* Visual Preview */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: Math.max(brushSize, 10),
                height: Math.max(brushSize, 10),
                borderRadius: '50%',
                background: toolType === 'ERASER' ? '#ff6b6b' : strokeColor,
                border: '2px solid #646cff',
                boxShadow: '0 2px 8px rgba(100,100,150,0.13)',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              title={toolType === 'ERASER' ? 'Eraser preview' : 'Brush preview'}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.10)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        </div>
      </div>
  );
};

export default ColorBrushControls;