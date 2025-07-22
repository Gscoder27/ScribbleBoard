// DownloadUtilities.ts - Fixed version
import { jsPDF } from 'jspdf';
import type { WhiteboardElement } from './utils/createElements';

export interface DownloadOptions {
  format: 'png' | 'pdf';
  quality: number;
  filename?: string;
}

/**
 * Downloads the whiteboard canvas as PNG or PDF
 */
export const downloadWhiteboard = (
  canvas: HTMLCanvasElement,
  elements: WhiteboardElement[],
  options: DownloadOptions
) => {
  const { format, quality, filename } = options;
  
  try {
    console.log('🔽 Starting download:', { format, quality, filename });
    
    if (format === 'png') {
      downloadAsPNG(canvas, quality, filename);
    } else if (format === 'pdf') {
      downloadAsPDF(canvas, filename);
    }
  } catch (error) {
    console.error('❌ Download failed:', error);
    alert('Download failed. Please try again.');
  }
};

/**
 * Downloads the canvas as a PNG image
 */
const downloadAsPNG = (canvas: HTMLCanvasElement, quality: number, filename?: string) => {
  try {
    console.log('🖼️ Creating PNG download...', { quality });
    
    // Create a temporary canvas to ensure white background
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      throw new Error('Failed to get 2D context for temporary canvas');
    }

    // Set canvas size
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fill with white background
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original canvas content on top
    tempCtx.drawImage(canvas, 0, 0);

    // Convert quality percentage to decimal
    const qualityDecimal = Math.min(1, Math.max(0.1, quality / 100));
    console.log('📊 Quality decimal:', qualityDecimal);

    // Create download link
    const dataURL = tempCanvas.toDataURL('image/png', qualityDecimal);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename || `whiteboard_${new Date().toISOString().slice(0, 10)}.png`;
    
    console.log('📥 Triggering PNG download:', link.download);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ PNG download completed');
  } catch (error) {
    console.error('❌ PNG download failed:', error);
    throw error;
  }
};

/**
 * Downloads the canvas as a PDF document
 */
const downloadAsPDF = (canvas: HTMLCanvasElement, filename?: string) => {
  try {
    console.log('📄 Creating PDF download...');
    // Create a temporary canvas with white background
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      throw new Error('Failed to get 2D context for temporary canvas');
    }

    // Set canvas size
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fill with white background
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original canvas content on top
    tempCtx.drawImage(canvas, 0, 0);

    // Convert canvas to image data
    const imgData = tempCanvas.toDataURL('image/png');
    console.log('🖼️ Canvas converted to image data');

    // Calculate PDF dimensions
    const canvasAspectRatio = canvas.width / canvas.height;
    const maxWidth = 210; // A4 width in mm
    const maxHeight = 297; // A4 height in mm
    
    let pdfWidth = maxWidth;
    let pdfHeight = maxWidth / canvasAspectRatio;

    // If height exceeds A4, scale down
    if (pdfHeight > maxHeight) {
      pdfHeight = maxHeight;
      pdfWidth = maxHeight * canvasAspectRatio;
    }

    console.log('📐 PDF dimensions:', { pdfWidth, pdfHeight });

    // Create PDF
    const pdf = new jsPDF(
      pdfWidth > pdfHeight ? 'landscape' : 'portrait',
      'mm',
      'a4'
    );

    // Center the image on the page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    console.log('📍 PDF positioning:', { x, y, pageWidth, pageHeight });

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);

    // Add metadata
    pdf.setProperties({
      title: 'Whiteboard Export',
      subject: 'Collaborative Whiteboard',
      author: 'Whiteboard App',
      creator: 'Whiteboard App'
    });

    // Download PDF
    const pdfFilename = filename || `whiteboard_${new Date().toISOString().slice(0, 10)}.pdf`;
    console.log('📥 Triggering PDF download:', pdfFilename);
    
    pdf.save(pdfFilename);
    console.log('✅ PDF download completed');
  } catch (error) {
    console.error('❌ PDF download failed:', error);
    throw error;
  }
};

/**
 * Gets the visible bounds of all elements on the canvas
 */
export const getVisibleBounds = (elements: WhiteboardElement[]) => {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const visibleElements = elements.filter(el => !el.deleted);
  
  if (visibleElements.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  visibleElements.forEach(element => {
    if (element.type === 'PEN' && element.points) {
      element.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    } else {
      minX = Math.min(minX, element.x1, element.x2);
      minY = Math.min(minY, element.y1, element.y2);
      maxX = Math.max(maxX, element.x1, element.x2);
      maxY = Math.max(maxY, element.y1, element.y2);
    }
  });

  return { minX, minY, maxX, maxY };
};

/**
 * Creates a cropped version of the canvas containing only the drawn content
 */
export const createCroppedCanvas = (
  originalCanvas: HTMLCanvasElement,
  elements: WhiteboardElement[]
): HTMLCanvasElement => {
  const bounds = getVisibleBounds(elements);
  const padding = 50; // Add some padding around the content
  
  const cropX = Math.max(0, bounds.minX - padding);
  const cropY = Math.max(0, bounds.minY - padding);
  const cropWidth = Math.min(
    originalCanvas.width - cropX,
    bounds.maxX - bounds.minX + 2 * padding
  );
  const cropHeight = Math.min(
    originalCanvas.height - cropY,
    bounds.maxY - bounds.minY + 2 * padding
  );

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');
  
  if (!croppedCtx) {
    return originalCanvas;
  }

  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  // Copy the cropped region
  croppedCtx.drawImage(
    originalCanvas,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  return croppedCanvas;
};