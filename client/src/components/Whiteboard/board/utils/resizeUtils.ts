export const getResizeHandleAtPosition = (x: number, y: number, element: any) => {
  const handles = [
    { name: 'nw', x: element.x1, y: element.y1 },
    { name: 'ne', x: element.x2, y: element.y1 },
    { name: 'sw', x: element.x1, y: element.y2 },
    { name: 'se', x: element.x2, y: element.y2 },
  ];
  return handles.find(h => Math.abs(x - h.x) < 8 && Math.abs(y - h.y) < 8);
}; 