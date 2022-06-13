import { ReqCreatePlan } from '@/features/train-manage/model/api';
import React from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
} from '@arco-design/web-react';
import { OptionsType } from '@arco-design/web-react/es/Select/interface';

interface PlanFormProps {
  cardsEntity: { name: string; id: string }[];

  onSubmit: (plan: ReqCreatePlan) => void;
  /**
   * 网络请求中？ 控制 confirm 按钮
   */
  isSubmitting: boolean;
}

const initialValues = {};

export const PlanForm: React.FC<PlanFormProps> = ({
  cardsEntity,
  onSubmit,
  isSubmitting,
}) => {
  const [form] = Form.useForm<ReqCreatePlan>();
  const [durationUnit] = React.useState('周');
  const cardsOption = React.useMemo<OptionsType>(
    () =>
      cardsEntity
        .map((card) => ({ label: card.name, value: card.id, disabled: false }))
        .concat([{ label: '休息日', value: '-1', disabled: true }]),
    [cardsEntity]
  );

  const handleSubmit = React.useCallback(async () => {
    try {
      await form.validate();
    } catch (e) {
      console.error(`form validate error!`);
      return;
    }

    onSubmit(form.getFieldsValue() as ReqCreatePlan);
  }, [form, onSubmit]);

  return (
    <Form form={form} initialValues={{ duration: 8, trainCards: ['-1'] }}>
      <Form.Item label={'计划名称'} field={'name'}>
        <Input />
      </Form.Item>
      <Form.Item label={'计划说明'} field={'explain'}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label={'持续时长'} field={'duration'}>
        <InputNumber disabled={true} prefix={durationUnit} />
      </Form.Item>
      <Form.Item label={'训练卡片'} field={'trainCards'}>
        <Select options={cardsOption} mode="multiple" dragToSort />
      </Form.Item>
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
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};
