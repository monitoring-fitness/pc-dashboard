import { TrainItem } from '@/pages/train-manage/model/entity/card';

export interface Schedule {
  id: string;
  date: string;
  is_giving_up_training: boolean; // 是否放弃今天的训练
  snap_card_id: string; // 使用的卡片id快照,为了能够实现替换未来相关卡片
  snap_card_name: string;
  train_program: Array<TrainItem>;
}