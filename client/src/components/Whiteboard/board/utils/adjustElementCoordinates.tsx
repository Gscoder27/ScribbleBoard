import { toolTypes } from "../../constants";
import type { WhiteboardElement } from "./createElements";

export const adjustElementCoordinates = (element: WhiteboardElement) => {
  const { type, x1, y1, x2, y2 } = element;

  if (type === toolTypes.RECTANGLE || type === toolTypes.CIRCLE) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  }

  if (type === toolTypes.LINE) {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return {
        x1: x2,
        y1: y2,
        x2: x1,
        y2: y1,
      };
    }
  }

  return null; // ⚠️ Fallback to avoid undefined
};
