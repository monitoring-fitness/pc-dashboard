export type RerankViewData = Array<{
  daily_train_id: string;
  new_date: string; // 新的日期
}>;

export type ReRankRequest = {
  plan_id: string;
  changed_daily_list: RerankViewData;
};
