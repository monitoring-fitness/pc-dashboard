import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { CalendarSchedule } from '@/features/dashboard/model/entity';
import axios from 'axios';
import { AppRootState } from '@/store';

export type BasicStatus = {
  /**
   * 异步操作状态
   */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const planEntityAdapter = createEntityAdapter<CalendarSchedule>({
  selectId: (model) => model._id,
});

export const getAllCalendars = createAsyncThunk(
  'get/all/calendar',
  async () => {
    const data = await axios.get<CalendarSchedule[]>('/api/plan');
    return data.data;
  }
);

// 1. 创建entity
const initialState = planEntityAdapter.getInitialState<BasicStatus>({
  status: 'idle',
  error: null,
});

// 2. 初始化reducer
const planCalendarSlice = createSlice({
  name: 'planCalendar',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCalendars.fulfilled, planEntityAdapter.setAll);
  },
});

// 3. 根据业务需要，定制并导出action 和 selector
export const { selectAll: selectAllPlanCalendar } =
  planEntityAdapter.getSelectors<AppRootState>((state) => state.planCalendar);

export default planCalendarSlice.reducer;
