export enum WeightUnit {
  Lb,
  Kg,
}

/**
 * 和训练总量关联，
 */
export enum TrainType {
  Shoulder,
  Chest,
  Back,
  Leg,
  Hip,
  Arm,
}

/**
 * 训练卡片中的动作说明
 */
export type TrainItem = {
  name: string; // 训练项目名称
  type: TrainType;
  weight?: number; // 重量
  weight_unit?: WeightUnit; // 重量单位
  group_num?: number; // 组数
  repeat_num?: number; // 重复次数
};

export interface EntityTrainCard {
  _id: string;
  name: string;
  memo: string;
  train_program: Array<TrainItem>;
}
