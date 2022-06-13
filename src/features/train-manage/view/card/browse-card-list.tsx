import React from 'react';
import { Table } from '@arco-design/web-react';
import { EntityTrainCard } from '@/features/train-manage/model/entity/card';
import dayjs from 'dayjs';
interface BrowseCardListProps {
  data: EntityTrainCard[];
  loading: boolean;
}
const columns = [
  {
    title: '卡片',
    dataIndex: 'name',
  },
  {
    title: '备忘录',
    dataIndex: 'memo',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    render: (value) => dayjs.unix(value).format('YYYY-MM-DD'),
  },
];

const BrowseCardList: React.FC<BrowseCardListProps> = ({ loading, data }) => {
  return <Table loading={loading} data={data || []} columns={columns} />;
};

export default BrowseCardList;
