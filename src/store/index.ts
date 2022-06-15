import defaultSettings from '../settings.json';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import planCalendarReducer from '@/features/work-calendar/train-calendar.slice';

export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
};

// S-TODO: 不知道迁移到哪里更合适 ...
export const appSettings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    oldSetting: (state, action) => {
      // 待迁移
      switch (action.type) {
        case 'update-settings': {
          const { settings } = action.payload;
          return {
            ...state,
            settings,
          };
        }
        case 'update-userInfo': {
          const { userInfo = initialState.userInfo, userLoading } =
            action.payload;
          return {
            ...state,
            userLoading,
            userInfo,
          };
        }
        default:
          return state;
      }
    },
  },
});

export const { oldSetting } = appSettings.actions;
const store = configureStore({
  reducer: {
    planCalendar: planCalendarReducer,
    settings: appSettings.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;
export default store;
