import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingState {
  site_name: string;
  site_description: string;
  favicon_url: string;
  logo_url: string;
  default_theme: 'light' | 'dark' | 'system';
  maintenance_mode: boolean;
  pageTitle: string;
  pageDescription: string;
  isSettingsLoaded: boolean;
}

const initialState: SettingState = {
  site_name: 'NovaKit',
  site_description: '',
  favicon_url: '',
  logo_url: '',
  default_theme: 'dark',
  maintenance_mode: false,
  pageTitle: '',
  pageDescription: '',
  isSettingsLoaded: false,
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSetting: (state, action: PayloadAction<Partial<SettingState>>) => {
      return {
        ...state,
        ...action.payload,
        isSettingsLoaded: true,
      };
    },
    resetSetting: () => initialState,
  },
});

export const { setSetting, resetSetting } = settingSlice.actions;
export default settingSlice.reducer;
