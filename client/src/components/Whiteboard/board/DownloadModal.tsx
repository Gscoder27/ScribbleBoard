import React, { useState } from 'react';
import { X, Download, FileImage, FileText } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: 'png' | 'pdf', quality: number) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, onDownload }) => {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'pdf'>('png');
  const [quality, setQuality] = useState(100);

  if (!isOpen) return null;

  const handleDownload = () => {
    onDownload(selectedFormat, quality);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Blur backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 99999,
        }}
        onClick={onClose}
      />
      {/* Modal content */}
      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          width: '100%',
          maxWidth: 420,
          margin: '0 16px',
          padding: 0,
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Nunito, Inter, Segoe UI, system-ui, Arial, sans-serif',
        }}
      >
        {/* Top gradient background - now covers header and divider */}
        <div style={{
          width: '100%',
          height: 108,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          background: 'linear-gradient(90deg, #e0f7fa 0%, #e0e7ff 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 32px 0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #22c55e 0%, #2563eb 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1e293b', margin: 0 }}>Export Whiteboard</h2>
              <div style={{ fontSize: 14, color: '#64748b', fontWeight: 400, marginTop: 2 }}>Save your work as an image or PDF</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', transition: 'background 0.2s' }}
            aria-label="Close"
            title="Close"
            onMouseOver={e => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >
            <X style={{ width: 20, height: 20, color: '#64748b' }} />
          </button>
        </div>
        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: '#e5e7eb', margin: '24px 0 0 0', position: 'relative', zIndex: 1 }} />
        {/* Modal content body */}
        <div style={{ padding: '0 32px 32px 32px', marginTop: 8 }}>
          
          {/* Export Format Selection */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#334155',
              marginBottom: 18,
              textAlign: 'center',
              letterSpacing: '-0.5px',
              fontFamily: 'Nunito, Inter, Segoe UI, system-ui, Arial, sans-serif',
            }}>Export Format</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

              {/* PNG Option */}
              <button
                onClick={() => setSelectedFormat('png')}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  border: selectedFormat === 'png' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                  background: selectedFormat === 'png' ? '#eff6ff' : '#fff',
                  transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                }}
              >
                <FileImage style={{ width: 32, height: 32, color: selectedFormat === 'png' ? '#2563eb' : '#94a3b8' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: selectedFormat === 'png' ? '#1e293b' : '#334155', fontSize: 15 }}>PNG Image</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>High quality raster image</div>
                </div>
              </button>
              
              {/* PDF Option */}
              <button
                onClick={() => setSelectedFormat('pdf')}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  border: selectedFormat === 'pdf' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                  background: selectedFormat === 'pdf' ? '#eff6ff' : '#fff',
                  transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                }}
              >
                <FileText style={{ width: 32, height: 32, color: selectedFormat === 'pdf' ? '#2563eb' : '#94a3b8' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: selectedFormat === 'pdf' ? '#1e293b' : '#334155', fontSize: 15 }}>PDF Document</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Scalable document format</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quality Slider (for PNG) */}
          {selectedFormat === 'png' && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Image Quality: {quality}%</h3>
              </div>
              <div style={{ padding: '0 4px' }}>
                <label htmlFor="quality-slider" className="sr-only">
                  Image Quality
                </label>
                <input
                  id="quality-slider"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  title="Image Quality"
                  aria-label="Image Quality"
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: 4,
                    borderRadius: 4,
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${quality}%, #e5e7eb ${quality}%, #e5e7eb 100%)`,
                    outline: 'none',
                    marginBottom: 4,
                    accentColor: '#2563eb',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  <span>Lower size</span>
                  <span>Higher quality</span>
                </div>
              </div>
            </div>
          )}
          {/* Export Details */}
          <div style={{ marginBottom: 24, padding: 16, background: '#f1f5f9', borderRadius: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>Export Details</h3>
            <ul style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 8 }}></span>
                Exports the entire canvas content
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 8 }}></span>
                Maintains original drawing quality
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 8 }}></span>
                Transparent background supported
              </li>
            </ul>
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 0',
                color: '#334155',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 10,
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseOut={e => (e.currentTarget.style.background = '#f1f5f9')}
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: '12px 0',
                color: 'white',
                background: 'linear-gradient(90deg, #22c55e 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #16a34a 0%, #1d4ed8 100%)')}
              onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #22c55e 0%, #2563eb 100%)')}
            >
              <Download style={{ width: 18, height: 18, color: 'white' }} />
              Export {selectedFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default DownloadModal;