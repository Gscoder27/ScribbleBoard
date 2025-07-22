
export interface WhiteboardElement {
  id: string;
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  seed: number;
  points?: { x: number; y: number }[];   // Add this for pen
  text?: string;                        // Add this for text
  deleted?: boolean;
  strokeColor?: string;                 // Add stroke color
  strokeWidth?: number; 
  userId?: string;                      // Add userId for per-user erasing
}

export const createElements = ({
  id, x1, y1, x2, y2, toolType, text, strokeColor = '#000000', strokeWidth = 2, userId,
}: {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  toolType: string;
  text?: string;
  strokeColor?: string;
  strokeWidth?: number;
  userId?: string;
}): WhiteboardElement => {
  const baseElement = {
    id,
    type: toolType,
    x1,
    y1,
    x2,
    y2,
    seed: Math.floor(Math.random() * 2 ** 31),
    strokeColor,
    strokeWidth,
    userId,
  };

  if (toolType === "CIRCLE") {
    return baseElement;
  }  
  if (toolType === "PEN") {
    return {
      ...baseElement,
      points: [{ x: x1, y: y1 }],
    };
  }
  if (toolType === "TEXT") {
    return {
      ...baseElement,
      x2: x1 + 200, // bounding box width for erasing
      y2: y1 + 24,  // bounding box height for erasing
      text: text || '',
    };
  }
  return baseElement;
};