import { EntityTrainCard } from '@/features/train-manage/model/entity/card';
import { IPlan } from '@/features/train-manage/model/entity/plan';

export enum TrainCardCode {
  successCreated = 40000,
  successGetAll,
  isExist,
  isTest,
}

export interface BaseResponse<T, K> {
  code: T;
  data: K;
  message: string;
}

export type ResFetchCard = BaseResponse<TrainCardCode, EntityTrainCard[]>;
export type ReqFetchCard = unknown;

export type ResCreateCard = BaseResponse<TrainCardCode, unknown>;

//S-TODO: 业务码定制
export type ResCreatePlan = BaseResponse<unknown, unknown>;
export type ReqCreatePlan = Pick<IPlan, 'duration' | 'name' | 'explain'> & {
  trainCards: string[];
};
