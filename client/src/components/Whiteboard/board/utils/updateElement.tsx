// import { createElements } from "../utils/createElements";
import { toolTypes } from "../../constants/toolType";
import { store } from "../../store/store";
import { setElements } from "../whiteboardSlice";
import type { WhiteboardElement } from "./createElements";
import { emitElementUpdate } from '@/lib/socketConn';

interface UpdateElementProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
  index: number;
  text?: string; // add this
}

/**
 * Updates the coordinates of a shape while keeping its original seed
 * (so RoughJS produces identical strokes each re‑draw).
**/

export const updateElement = (
  { x1, y1, x2, y2, type, index, text, }: UpdateElementProps,
  elements: WhiteboardElement[],
): void => {
  // 1 copy array immutably
  const elementsCopy = [...elements];

  switch (type) {
    case toolTypes.CIRCLE:
    case toolTypes.LINE:
    case toolTypes.RECTANGLE: {
      const existing = elementsCopy[index];

      if (!existing) {
        console.warn(`No element found at index ${index}`);
        return;
      }

      // 2 keep the same id & seed, just update coords
      elementsCopy[index] = {
        ...existing,
        x1,
        y1,
        x2,
        y2,
      };

      // 3 dispatch once
      store.dispatch(setElements(elementsCopy));

      emitElementUpdate(elementsCopy[index]); 

      break;
    }
    case toolTypes.PEN: {
      const existing = elementsCopy[index];
      if (!existing) {
        console.warn(`No element found at index ${index}`);
        return;
      }
      // Ensure points is always an array
      const prevPoints = Array.isArray(existing.points) ? existing.points : [];
      elementsCopy[index] = {
        ...existing,
        points: [
          ...prevPoints,
          {
            x: x2,
            y: y2,
          },
        ],
      };
      const updatedPenElement = elementsCopy[index];
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedPenElement);
      break;
    }
    case toolTypes.TEXT: {
      const existing = elementsCopy[index];
      if (!existing) {
        console.warn(`No element found at index ${index}`);
        return;
      }
      // Update text and bounding box
      const textValue = text || '';
      const textHeight = 24;
      // Optionally, measure text width using a canvas if needed
      // For now, just use x2 = x1 + 200 as a placeholder
      elementsCopy[index] = {
        ...existing,
        x1,
        y1,
        x2: x1 + 200,
        y2: y1 + textHeight,
        text: textValue,
      };
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(elementsCopy[index]);
      break;
    }
    default: {
      console.error(`Unsupported element type: ${type}`);
      break;
    }
  }
};