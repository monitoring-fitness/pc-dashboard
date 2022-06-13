import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card } from '@arco-design/web-react';
import CreateCard from '@/features/train-manage/view/card/create-card';
import { IconPlus } from '@arco-design/web-react/icon';
import BrowseCardList from '@/features/train-manage/view/card/browse-card-list';
import { useFetchCards } from '@/features/train-manage/model/view-model/useFetchCards';

function TrainBoard() {
  const {
    data: cards,
    loading: getCardsLoading,
    executeGet: fetchCards,
  } = useFetchCards();

  useEffect(() => {
    fetchCards();
  }, []);

  const [showCreateCard, setShowCreateCard] = useState(false);

  const openCreateCard = useCallback(() => {
    setShowCreateCard((v) => !v);
  }, [setShowCreateCard]);

  return (
    <Card style={{ height: '80vh' }}>
      <Button onClick={openCreateCard} icon={<IconPlus />} type={'text'}>
        {'训练卡片'}
      </Button>
      <BrowseCardList data={cards} loading={getCardsLoading} />
      <CreateCard
        isShow={showCreateCard}
        doClose={openCreateCard}
        fetchSuccessCB={() => fetchCards()}
      />
    </Card>
  );
}

export default TrainBoard;
