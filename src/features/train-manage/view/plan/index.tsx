import React from 'react';
import { useCreatePlan } from '@/features/train-manage/model/view-model/useCreatePlan';

import { Card } from '@arco-design/web-react';
import { useFetchCards } from '@/features/train-manage/model/view-model/useFetchCards';
import { PlanForm } from '@/features/train-manage/view/plan/plan-form';

const Plan = () => {
  const { createLoading, executeCrate } = useCreatePlan();
  const { data: userCards, executeGet } = useFetchCards();

  // S-TODO: 这里要等到开始创建plan的时候再拉取！
  // S-TODO: 所有的路由组件都渲染了两次，为什么？
  React.useEffect(() => {
    console.log('执行两次？');
    executeGet();
  }, []);

  return (
    <Card style={{ height: '80vh' }}>
      Plan组件
      {userCards.length > 0 && (
        <PlanForm
          cardsEntity={userCards.map((card) => ({
            name: card.name,
            id: card._id,
          }))}
          onSubmit={(values) => executeCrate({ data: values })}
          isSubmitting={createLoading}
        />
      )}
    </Card>
  );
};

export default Plan;
