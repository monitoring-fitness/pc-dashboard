import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { CalendarSchedule } from '@/features/dashboard/model/entity';
import axios from 'axios';
import { AppRootState } from '@/store';
import {
  ReRankRequest,
  RerankViewData,
} from '@/features/work-calendar/interfaces';

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

export const rerankTrainsDay = createAsyncThunk(
  'rerank/work-calendar/trains',
  async (source: RerankViewData, { dispatch, getState }) => {
    /**
     * 组装request
     */
    const getRequestBody = (): ReRankRequest => {
      const planId = 'test_plan_id';
      return {
        plan_id: planId,
        changed_daily_list: source,
      };
    };

    await axios.put<unknown>('/api/plan', getRequestBody());

    // CONTINUE: 更新日历数据
    // CONTINUE: 检查后端接口，重命名 ReRankRequest 相关字段
    // CONTINUE: plan该怎么取？放哪里？
    // dispatch(dailyTrainUpdate({}));
  }
);

export const getAllCalendars = createAsyncThunk(
  'get/all/work-calendar',
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
const trainCalendarSlice = createSlice({
  name: 'planCalendar',
  initialState: initialState,
  reducers: {
    dailyTrainUpdate: planEntityAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCalendars.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getAllCalendars.fulfilled, (state, action) => {
      state.status = 'succeeded';
      planEntityAdapter.setAll(state, action);
    });
    builder.addCase(getAllCalendars.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

// 3. 根据业务需要，定制并导出action 和 selector
export const { selectAll: selectAllPlanCalendar } =
  planEntityAdapter.getSelectors<AppRootState>((state) => state.planCalendar);

export const { dailyTrainUpdate } = trainCalendarSlice.actions;
export default trainCalendarSlice.reducer;
