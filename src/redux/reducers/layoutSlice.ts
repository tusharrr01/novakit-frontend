import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
  sidebarCollapsed: boolean;
  isRTL: boolean;
}

const initialState: LayoutState = {
  sidebarCollapsed: false,
  isRTL: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setRTL: (state, action: PayloadAction<boolean>) => {
      state.isRTL = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setRTL } = layoutSlice.actions;
export default layoutSlice.reducer;
