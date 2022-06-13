import React, { useCallback, useRef } from 'react';
import { useCreateCard } from '@/features/train-manage/model/view-model/useCreateCard';
import { Modal } from '@arco-design/web-react';
import { CardForm } from '@/features/train-manage/component';
import { EntityTrainCard } from '@/features/train-manage/model/entity/card';

interface CreateCardProps {
  isShow: boolean;
  doClose: () => void;
  fetchSuccessCB: () => void;
}

const CreateCard: React.FC<CreateCardProps> = ({
  isShow,
  doClose,
  fetchSuccessCB,
}) => {
  const { createLoading, executeCrate, createError } = useCreateCard();

  const handleCreateCard = useCallback(
    async (formCardEntity: EntityTrainCard) => {
      try {
        await executeCrate({ data: formCardEntity });
      } catch (e) {
        console.log(e);
      }
      fetchSuccessCB();
      //  2. 执行网络请求
      //  3. 成功的callback逻辑
    },
    [executeCrate, createError]
  );

  return (
    <Modal
      visible={isShow}
      footer={null}
      style={{ width: 750 }}
      onCancel={doClose}
    >
      <CardForm onSubmit={handleCreateCard} isSubmitting={createLoading} />
    </Modal>
  );
};

export default CreateCard;
