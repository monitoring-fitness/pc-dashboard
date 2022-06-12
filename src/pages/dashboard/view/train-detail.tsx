import {
  EntityTrainCard,
  WeightUnit,
} from '@/pages/train-manage/model/entity/card';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AutoComplete,
  Button,
  Form,
  Grid,
  Input,
  InputNumber,
} from '@arco-design/web-react';
import _ from 'lodash';
import { trainItem } from '@/mock/train-item';

interface TrainDetailProps {
  cardEntity?: Omit<EntityTrainCard, 'memo'>;
  /**
   * 表单提交操作，交给使用者来定义，例如：创建卡片、更新卡片
   * @param card
   */
  onSubmit: (card: Partial<EntityTrainCard>) => void;
  /**
   * 网络请求中？ 控制 confirm 按钮
   */
  isSubmitting: boolean;
}

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

export const TrainDetail: React.FC<TrainDetailProps> = ({
  cardEntity,
  onSubmit,
  isSubmitting,
}) => {
  const [form] = Form.useForm<EntityTrainCard>();
  const [weightUnit] = useState(WeightUnit.Kg);

  const autoCompInputValue: string | undefined = Form.useWatch(
    'train_program.name',
    form
  );

  const filterTrainOptions = useMemo(
    () => helperTrain2Ops(trainItem),
    [autoCompInputValue]
  );

  const handleSubmit = useCallback(async () => {
    try {
      await form.validate();
    } catch (e) {
      console.error(`form validate error!`);
      return;
    }
    let formEntity = form.getFieldsValue();
    //  补充动作所属的类目
    formEntity = {
      ...formEntity,
      train_program: formEntity.train_program.map((train) => ({
        ...train,
        type: trainItem.find((sourceTrainItem) =>
          sourceTrainItem.trainList
            .map((item) => item.name)
            .includes(train.name)
        ).trainType,
        weight_unit: weightUnit,
      })),
    };
    onSubmit(formEntity);
  }, [form, onSubmit]);

  /**
   * 当 cardEntity 发生改变时（通常对应着切换展示不同的卡片），需要刷新form中的内容。
   */
  useEffect(() => {
    form.clearFields();
    form.setFieldsValue(cardEntity);
  }, [cardEntity, form]);

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
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginRight: 24 }}
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
