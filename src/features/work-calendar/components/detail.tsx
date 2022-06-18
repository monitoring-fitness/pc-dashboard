import React, { useEffect, useMemo } from 'react';
import {
  AutoComplete,
  Button,
  Form,
  Grid,
  Input,
  InputNumber,
} from '@arco-design/web-react';
import { trainItem } from '@/mock/train-item';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  adjustTrainDay,
  giveUpTrainDay,
  selectOneCalendarDetail,
} from '@/features/work-calendar/train-calendar.slice';
import {
  EntityTrainCard,
  TrainItem,
  WeightUnit,
} from '@/features/train-manage/model/entity/card';

interface TrainDetailProps {
  currentID: string;
}
// S-CONTINUE: 更新训练、替换卡片、放弃训练
const helperTrain2Ops = (source: typeof trainItem) =>
  source.map((group) => (
    <AutoComplete.OptGroup key={group.trainType} label={group['cn-name']}>
      {group.trainList.map((trainItem) => (
        <AutoComplete.Option value={trainItem.name} key={trainItem.id}>
          {trainItem.name}
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>
  ));

export const Detail: React.FC<TrainDetailProps> = ({ currentID }) => {
  const dispatch = useAppDispatch();
  const detail = useAppSelector((state) =>
    selectOneCalendarDetail(state, currentID)
  );

  const [form] = Form.useForm<EntityTrainCard>();

  useEffect(() => {
    form.setFieldsValue({
      train_program: detail.train_program,
      name: detail.snap_card_name,
    });
  }, [detail]);

  const autoCompInputValue: string | undefined = Form.useWatch(
    'train_program.name',
    form
  );

  const filterTrainOptions = useMemo(
    () => helperTrain2Ops(trainItem),
    [autoCompInputValue]
  );
  return (
    <Form form={form}>
      <Form.Item label={'卡片名称'} field={'name'}>
        <Input />
      </Form.Item>
      <Form.List field={'train_program'}>
        {(fields, { add }) => {
          return (
            <>
              {fields.map((item, index) => {
                return (
                  <Form.Item
                    label={`动作${index + 1}`}
                    required
                    style={{ marginBottom: 0 }}
                    key={index}
                  >
                    <Grid.Row gutter={8}>
                      <Grid.Col span={9}>
                        <Form.Item
                          field={item.field + '.name'}
                          rules={[{ required: true }]}
                        >
                          <AutoComplete
                            placeholder="动作的名称"
                            data={filterTrainOptions}
                          />
                        </Form.Item>
                      </Grid.Col>
                      <Grid.Col span={5}>
                        <Form.Item
                          field={item.field + '.weight'}
                          rules={[{ required: true }]}
                        >
                          <InputNumber suffix={'kg'} placeholder="重量" />
                        </Form.Item>
                      </Grid.Col>
                      <Grid.Col span={5}>
                        <Form.Item
                          field={item.field + '.repeat_num'}
                          rules={[{ required: true }]}
                        >
                          <InputNumber suffix={'* 次'} placeholder="次数" />
                        </Form.Item>
                      </Grid.Col>
                      <Grid.Col span={5}>
                        <Form.Item
                          field={item.field + '.group_num'}
                          rules={[{ required: true }]}
                        >
                          <InputNumber suffix={'* 组'} placeholder="组数" />
                        </Form.Item>
                      </Grid.Col>
                    </Grid.Row>
                  </Form.Item>
                );
              })}
              <Form.Item wrapperCol={{ offset: 5 }}>
                <Button
                  onClick={() => {
                    add();
                  }}
                >
                  增加动作
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
      <Form.Item
        wrapperCol={{
          offset: 5,
        }}
      >
        <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
          替换
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => dispatch(giveUpTrainDay(detail.id))}
          style={{ marginRight: 24 }}
        >
          放弃
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() =>
            dispatch(
              adjustTrainDay({
                daily_train_id: detail.id,
                train_program: (
                  form.getFieldValue('train_program') as TrainItem[]
                ).map((train) => ({
                  ...train,
                  type: trainItem.find((sourceTrainItem) =>
                    sourceTrainItem.trainList
                      .map((item) => item.name)
                      .includes(train.name)
                  ).trainType,
                  weight_unit: WeightUnit.Kg,
                })),
              })
            )
          }
          style={{ marginRight: 24 }}
        >
          更新
        </Button>
      </Form.Item>
    </Form>
  );
};
