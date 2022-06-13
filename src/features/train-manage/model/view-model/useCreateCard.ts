import useAxios from 'axios-hooks';
import { EntityTrainCard } from '@/features/train-manage/model/entity/card';
import { useUpdateEffect } from 'ahooks';
import {
  ResCreateCard,
  TrainCardCode,
} from '@/features/train-manage/model/api';
import { Notification } from '@arco-design/web-react';

export const useCreateCard = () => {
  //  createError 这里的error信息如何确认呢？怎么根据后端定制的业务code 来呢？
  const [{ data, loading: createLoading, error: createError }, executeCrate] =
    useAxios<ResCreateCard, EntityTrainCard>(
      {
        url: '/api/train-card',
        method: 'POST',
      },
      { manual: true }
    );

  useUpdateEffect(() => {
    switch (data.code) {
      case TrainCardCode.successCreated:
        Notification.success({
          title: 'Success',
          content: data.message,
          duration: 3000,
        });
        break;
      case TrainCardCode.isExist:
        Notification.error({
          title: 'Error',
          content: data.message,
          duration: 3000,
        });
        break;
    }
  }, [data]);

  return {
    createLoading,
    executeCrate,
    createError,
  };
};
