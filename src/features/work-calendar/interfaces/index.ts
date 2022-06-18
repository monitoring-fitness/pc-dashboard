import { TrainItem } from '@/features/train-manage/model/entity/card';

export type RerankViewData = {
  // S-MARK： 后期做成批量更新，直接换成数组既可
  daily_train_id: string;
  new_date: string; // 新的日期
};

export type ReRankRequest = {
  plan_id: string;
  changed_daily_list: Array<RerankViewData>;
};

export type GiveUpRequest = {
  plan_id: string;
  daily_train_id: string;
};

export type AdjustRequest = {
  plan_id: string;
  daily_train_id: string;
  train_program: Array<TrainItem>;
};
