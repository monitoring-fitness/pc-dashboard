import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { CalendarSchedule } from '@/features/dashboard/model/entity';
import axios from 'axios';
import { AppRootState } from '@/store';
import {
  AdjustRequest,
  GiveUpRequest,
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

export type EventDialog = {
  eventDialog: {
    open: boolean;
    anchorPosition: { top: number; left: number };
  };
};

export const mockPlanId = '62a15e24faab15092d60e938';

const planEntityAdapter = createEntityAdapter<CalendarSchedule>({
  selectId: (model) => model.id,
});

export const reRankTrainsDay = createAsyncThunk(
  'rerank/work-calendar/trains',
  async (source: RerankViewData, { dispatch, getState }) => {
    /**
     * 组装request
     */
    const getRequestBody = (): ReRankRequest => {
      // S-MARK: plan id 之后从用户当前激活的plan里面取
      return {
        plan_id: mockPlanId,
        changed_daily_list: [source],
      };
    };

    try {
      await axios.patch<unknown>('/api/plan', getRequestBody());
      dispatch(
        dailyTrainUpdate({
          id: source.daily_train_id,
          changes: { date: source.new_date },
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
);

export const getAllCalendars = createAsyncThunk(
  'get/all/work-calendar',
  async () => {
    const data = await axios.get<CalendarSchedule[]>('/api/plan');
    return data.data;
  }
);

export const adjustTrainDay = createAsyncThunk(
  '',
  async (body: Omit<AdjustRequest, 'plan_id'>, { dispatch }) => {
    try {
      await axios.put<unknown, unknown, AdjustRequest>('/api/plan/adjust', {
        plan_id: mockPlanId,
        ...body,
      });
      dispatch(getAllCalendars());
    } catch (e) {
      console.error(e);
    }
  }
);

export const giveUpTrainDay = createAsyncThunk(
  '',
  async (id: GiveUpRequest['daily_train_id'], { dispatch }) => {
    try {
      await axios.patch<unknown, unknown, GiveUpRequest>('/api/plan/give-up', {
        plan_id: mockPlanId,
        daily_train_id: id,
      });
      dispatch(getAllCalendars());
    } catch (e) {
      console.error(e);
    }
  }
);

// 1. 创建entity
const initialState = planEntityAdapter.getInitialState<
  BasicStatus & EventDialog
>({
  status: 'idle',
  error: null,
  eventDialog: {
    open: false,
    anchorPosition: { top: 200, left: 400 },
  },
});

// 2. 初始化reducer
const trainCalendarSlice = createSlice({
  name: 'planCalendar',
  initialState: initialState,
  reducers: {
    dailyTrainUpdate: planEntityAdapter.updateOne,
    openEventDialog: (state, action) => {
      state.eventDialog = {
        open: true,
        ...action.payload,
      };
    },
    closeEventDialog: (state, action) => {
      state.eventDialog = {
        ...state.eventDialog,
        open: false,
      };
    },
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
export const {
  selectAll: selectAllPlanCalendar,
  selectById: selectOneCalendarDetail,
} = planEntityAdapter.getSelectors<AppRootState>((state) => state.planCalendar);

export const selectEventDialog = (state: AppRootState) =>
  state.planCalendar.eventDialog;
export const { dailyTrainUpdate, openEventDialog, closeEventDialog } =
  trainCalendarSlice.actions;
export default trainCalendarSlice.reducer;
