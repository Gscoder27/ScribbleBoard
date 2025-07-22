import { toolTypes } from "../../constants";
import type { WhiteboardElement } from "./createElements";
import type { RoughCanvas } from 'roughjs/bin/canvas';
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from ".";

interface DrawElementArgs {
  roughCanvas: RoughCanvas;
  element: WhiteboardElement;
  context: CanvasRenderingContext2D;
}

const drawPenElement = (context: CanvasRenderingContext2D, element: WhiteboardElement) => {
  const points = element.points ?? [];
  if (points.length < 2) return;

  const inputPoints = points.map(p => [p.x, p.y] as [number, number]);
  const strokeWidth = element.strokeWidth || 2;
  const strokeColor = element.strokeColor || '#000000';

  const stroke = getStroke(inputPoints, {
    size: strokeWidth * 3, // Multiply by 3 for better visual effect
    thinning: 0.6,
    smoothing: 0.6,
    streamline: 0.4,
  });

  const pathData = getSvgPathFromStroke(stroke as [number, number][]);
  const myPath = new Path2D(pathData);

  context.fillStyle = strokeColor;
  context.fill(myPath);

  // Optional stroke outline
  context.strokeStyle = strokeColor;
  context.lineWidth = 1;
  context.stroke(myPath);
};

const drawTextElement = (context: CanvasRenderingContext2D, element: WhiteboardElement) => {
  console.log("📝 Drawing text:", element.text, "at", element.x1, element.y1);
  // context.textBaseline = "top";
  // context.font = '24px sans-serif';
  // context.fillStyle = element.strokeColor || '#000000';
  // context.fillText(element.text || '', element.x1, element.y1);
  const height = Math.abs(element.y2 - element.y1);
  const fontSize = Math.max(12, height); // avoid too small text
  context.textBaseline = "top";
  context.font = `${fontSize}px sans-serif`;
  context.fillStyle = element.strokeColor || '#000000';
  context.fillText(element.text || '', element.x1, element.y1);
};

export const drawElement = ({ roughCanvas, element, context }: DrawElementArgs) => {
  if (element.deleted) return;
  
  const strokeColor = element.strokeColor || '#000000';
  const strokeWidth = element.strokeWidth || 2;
  
  switch (element.type) {
    case toolTypes.RECTANGLE: {
      const rect = roughCanvas.generator.rectangle(
        element.x1,
        element.y1,
        element.x2 - element.x1,
        element.y2 - element.y1,
        {
          seed: element.seed,
          fillStyle: "solid",
          stroke: strokeColor,
          fill: "transparent",
          roughness: 2,
          strokeWidth: strokeWidth,
        }
      );
      return roughCanvas.draw(rect);
    }
    case toolTypes.LINE: {
      const line = roughCanvas.generator.line(
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        {
          seed: element.seed,
          fillStyle: "solid",
          stroke: strokeColor,
          roughness: 2,
          strokeWidth: strokeWidth,
        }
      );
      return roughCanvas.draw(line);
    }
    case toolTypes.CIRCLE: {
      const cx = (element.x1 + element.x2) / 2;
      const cy = (element.y1 + element.y2) / 2;
      const rx = Math.abs(element.x2 - element.x1) / 2;
      const ry = Math.abs(element.y2 - element.y1) / 2;

      const ellipse = roughCanvas.generator.ellipse(cx, cy, rx * 2, ry * 2, {
        seed: element.seed,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        fillStyle: "solid",
        fill: "transparent",
        roughness: 2,
      });

      return roughCanvas.draw(ellipse);
    }
    case toolTypes.PEN: {
      drawPenElement(context, element);
      break;
    }
    case toolTypes.TEXT: {
      drawTextElement(context, element);
      break;
    }
    default:
      console.warn(`Skipping unsupported element type: ${element.type}`);
      return;
  }
};