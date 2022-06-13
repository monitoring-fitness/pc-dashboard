import useAxios from 'axios-hooks';
import { useUpdateEffect } from 'ahooks';
import {
  ReqCreatePlan,
  ResCreatePlan,
} from '@/features/train-manage/model/api';

export const useCreatePlan = () => {
  const [{ data, loading: createLoading, error: createError }, executeCrate] =
    useAxios<ResCreatePlan, ReqCreatePlan>(
      {
        url: '/api/plan',
        method: 'POST',
      },
      { manual: true }
    );

  useUpdateEffect(() => {
    switch (
      data.code
      //
    ) {
    }
  }, [data]);

  return {
    createLoading,
    executeCrate,
    createError,
  };
};
