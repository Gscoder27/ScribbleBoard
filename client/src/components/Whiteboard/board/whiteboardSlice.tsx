import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WhiteboardElement } from './utils/createElements';

interface WhiteboardState {
  tool: string | null;
  elements: WhiteboardElement[];
  strokeColor: string;
  brushSize: number;
  history: WhiteboardElement[][];
  future: WhiteboardElement[][];
}

const initialState: WhiteboardState = {
  tool: null,
  elements: [],
  strokeColor: '#000000',
  brushSize: 2,
  history: [],
  future: [],
};

const whiteboardSlice = createSlice({
  name: 'whiteboardPage',
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<string>) => {
      state.tool = action.payload;
      // Set default brush size based on tool
      if (action.payload === 'ERASER') {
        state.brushSize = 30;
      } else if (action.payload === 'PEN') {
        state.brushSize = 2;
      }
    },
    setStrokeColor: (state, action: PayloadAction<string>) => {
      state.strokeColor = action.payload;
    },
    setBrushSize: (state, action: PayloadAction<number>) => {
      state.brushSize = action.payload;
    },
    pushHistory: (state) => {
      state.history.push([...state.elements]);
      state.future = [];
    },
    undo: (state) => {
      if (state.history.length > 0) {
        state.future.push([...state.elements]);
        state.elements = state.history.pop()!;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        state.history.push([...state.elements]);
        state.elements = state.future.pop()!;
      }
    },
    updateElements: (state, action: PayloadAction<WhiteboardElement[]>) => {
      state.history.push([...state.elements]);
      state.future = [];
      action.payload.forEach(newEl => {
        if (!newEl || !newEl.id || !newEl.type) return;
        const index = state.elements.findIndex(el => el.id === newEl.id);
        if (index !== -1) {
          state.elements[index] = newEl;
        } else {
          state.elements.push(newEl);
        }
      });
    },
    updateElementRemote: (state, action: PayloadAction<WhiteboardElement>) => {
      const newEl = action.payload;
      const index = state.elements.findIndex(el => el.id === newEl.id);
      if (index !== -1) {
        state.elements[index] = newEl;
      } else {
        state.elements.push(newEl);
      }
    },
    setElements: (state, action: PayloadAction<WhiteboardElement[]>) => {
      state.history = [];
      state.future = [];
      state.elements = action.payload;
    },
    addElement: (state, action: PayloadAction<WhiteboardElement>) => {
      state.history.push([...state.elements]);
      state.future = [];
      state.elements.push(action.payload);
    },
    // Add socket-related actions
    colorChanged: (state, action: PayloadAction<string>) => {
      state.strokeColor = action.payload;
    },
    brushSizeChanged: (state, action: PayloadAction<number>) => {
      state.brushSize = action.payload;
    },
    replaceElements: (state, action: PayloadAction<WhiteboardElement[]>) => {
      state.elements = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    downloadInitiated: (_state, _action: PayloadAction<{ format: 'png' | 'pdf'; quality: number }>) => {},
  },
  
});

export const { 
  setTool, 
  setStrokeColor, 
  setBrushSize, 
  colorChanged,
  brushSizeChanged,
  updateElements, 
  setElements, 
  addElement, 
  pushHistory,
  undo,
  redo,
  replaceElements,
  downloadInitiated,
  updateElementRemote
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;