import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Card,
  Input,
  Radio,
  Slider,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Select
} from 'antd';
import {
  RobotOutlined,
  EditOutlined,
  AppstoreOutlined,
  NumberOutlined,
  BulbOutlined,
  RocketOutlined,
  LoadingOutlined,
  ColumnHeightOutlined
} from '@ant-design/icons';
import { aiApi } from '../services/api';
import { Icon, GenerateRequest } from '../types';
import { generateIconName } from '../utils/iconUtils';
import './IconGenerator.less';

interface IconGeneratorProps {
  onIconsGenerated: (icons: Icon[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const STYLES = [
  {
    value: 'modern',
    label: 'Modern',
    desc: 'Clean and contemporary look'
  },
  {
    value: 'line',
    label: 'Line',
    desc: 'Outline style with no fill'
  },
  { value: 'flat', label: 'Flat', desc: 'No depth or dimension' },
  {
    value: 'hand-drawn',
    label: 'Hand-drawn',
    desc: 'Sketch-like appearance'
  }
];

const SIZEOPTIONS = [
  { value: 16, label: '16x16' },
  { value: 32, label: '32x32' },
  { value: 48, label: '48x48' },
  { value: 64, label: '64x64' },
  { value: 128, label: '128x128' }
];

const IconGenerator: React.FC<IconGeneratorProps> = ({
  onIconsGenerated,
  isLoading,
  setIsLoading
}) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<number>(32);
  const [style, setStyle] = useState<string>('modern');
  const [count, setCount] = useState(2);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        'Please enter a description for the icons you want to generate'
      );
      return;
    }
    if (prompt.trim().length < 3) {
      toast.error(
        'Please provide a more detailed description (at least 3 characters)'
      );
      return;
    }

    setIsLoading(true);

    try {
      const styleInfo = STYLES.find((s) => s.value === style);
      const request: GenerateRequest = {
        prompt: prompt.trim(),
        style: styleInfo,
        count,
        size
      };

      const response = await aiApi.generateIcons(request);

      console.log('🎨 Generating icons:', response);

      if (response.success && response.data.icons.length > 0) {
        // Process and enhance icons with unique names
        const enhancedIcons = response.data.icons.map((icon, index) => ({
          ...icon,
          id: `${Date.now()}-${index}`,
          name: generateIconName(icon.name)
        }));

        onIconsGenerated(enhancedIcons);
        toast.success(`Generated ${enhancedIcons.length} icons successfully!`);
      } else {
        throw new Error('No icons were generated');
      }
    } catch (error: any) {
      console.error('❌ Icon generation failed:', error);
      toast.error(
        error.message || 'Failed to generate icons. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    'A modern settings gear icon',
    'A minimalist heart symbol',
    'A sleek arrow pointing right',
    'A cloud with upload symbol',
    'A trash bin for delete actions',
    'A user profile silhouette'
  ];

  return (
    <Card className='icon-generator-card'>
      {/* <div className='label' style={{ display: 'flex' }}>
        <div className='icon-generator-header'>
          <RobotOutlined />
        </div>
        <Title level={2} style={{ marginBottom: 0, lineHeight: '32px' }}>
          AI Icon Generator
        </Title>
      </div> */}
      <Paragraph>
        Describe your dream icons and watch AI bring them to life in seconds!
      </Paragraph>
      <Divider style={{ margin: '12px 0' }} />
      {/* Prompt Input */}
      <div className='label' style={{ marginTop: 0 }}>
        <EditOutlined style={{ marginRight: 4 }} />
        <span>Describe your icons</span>
      </div>
      <TextArea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='e.g., A modern settings gear icon with clean lines, minimalist heart symbol, sleek arrow pointing right...'
        rows={4}
        maxLength={500}
        disabled={isLoading}
        style={{ borderRadius: 0 }}
        showCount
      />

      {/* Style Selection */}
      <div className='label'>
        <AppstoreOutlined style={{ marginRight: 4 }} />
        <span>Choose your style</span>
      </div>
      <Radio.Group
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        disabled={isLoading}
      >
        <Row gutter={[16, 16]}>
          {STYLES.map((styleOption) => (
            <Col span={12} key={styleOption.value}>
              <Radio.Button
                value={styleOption.value}
                className='style-radio-button'
                disabled={isLoading}
                style={{ height: '100%' }}
              >
                <div className='text-left'>
                  <b className='font-medium'>{styleOption.label}</b>
                  <br />
                  <label>{styleOption.desc}</label>
                </div>
              </Radio.Button>
            </Col>
          ))}
        </Row>
      </Radio.Group>
      {/* size of Icons */}
      <div className='label'>
        <ColumnHeightOutlined style={{ marginRight: 4 }} />
        <span>Size of icons</span>
      </div>
      <Select
        defaultValue={size}
        onChange={(value) => setSize(value)}
        style={{ width: '100%' }}
        options={SIZEOPTIONS}
      />

      {/* Number of Icons */}
      <div className='label'>
        <NumberOutlined style={{ marginRight: 4 }} />
        <span>Number of variations</span>
      </div>
      <div className='slider-container'>
        <div className='flex items-center justify-between mb-3'>
          <Text type='secondary'>Generate</Text>
          <Text strong style={{ margin: '0 8px' }}>
            {count}
          </Text>
          <Text type='secondary'>icons</Text>
        </div>
        <Slider
          min={1}
          max={8}
          value={count}
          onChange={setCount}
          disabled={isLoading}
          marks={{
            1: '1',
            8: '8'
          }}
        />
      </div>
      <Divider />
      {/* Generate Button */}
      <Button
        type='primary'
        htmlType='submit'
        size='large'
        block
        disabled={isLoading || !prompt.trim()}
        className='generate-button'
        onClick={handleGenerate}
        icon={isLoading ? <LoadingOutlined /> : <RocketOutlined />}
      >
        {isLoading ? 'Creating magic...' : 'Generate Icons'}
      </Button>

      {/* Example Prompts */}
      <div>
        <Title level={4}>
          <div className='label'>
            <BulbOutlined />
            <span>Need inspiration? Try these:</span>
          </div>
        </Title>
        <div className='example-prompts'>
          {examplePrompts.map((examplePrompt, index) => (
            <Button
              key={index}
              block
              size='large'
              onClick={() => setPrompt(examplePrompt)}
              disabled={isLoading}
              className='example-prompt-button'
              color={examplePrompt === prompt ? 'primary' : 'default'}
              variant='outlined'
            >
              <div className='text-left'>
                <Text type='secondary' style={{ marginRight: 6 }}>
                  {index + 1}.
                </Text>
                <Text>{examplePrompt}</Text>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default IconGenerator;
