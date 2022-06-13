import {
  EntityTrainCard,
  TrainType,
} from '@/features/train-manage/model/entity/card';

export const trainCardJson: EntityTrainCard = {
  _id: '123',
  name: '测试卡片1',
  memo: '我是测试卡片的备忘录',
  train_program: [
    {
      name: '动作1',
      type: TrainType.Arm,
      group_num: 5,
      repeat_num: 20,
      weight: 500,
    },
  ],
};
