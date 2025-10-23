import React, { useState } from 'react';
import { Icon, ExportFormat, ExportSize } from '../types';
import { toast } from 'react-hot-toast';
import { iconsApi } from '../services/api';
import { downloadIcon } from '../utils/iconUtils';
import {
  Card,
  Empty,
  Form,
  Radio,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Select,
  Badge,
  Divider,
  Alert
} from 'antd';
import {
  DownloadOutlined,
  CopyOutlined,
  SaveOutlined,
  ClearOutlined,
  InboxOutlined,
  FileTextOutlined,
  PictureOutlined
} from '@ant-design/icons';
import './ExportPanel.less';

interface ExportPanelProps {
  selectedIcons: Icon[];
  onClearSelection: () => void;
}

const { Title, Text } = Typography;

const ExportPanel: React.FC<ExportPanelProps> = ({
  selectedIcons,
  onClearSelection
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('svg');
  const [exportSize, setExportSize] = useState<ExportSize>(32);
  const [collectionName, setCollectionName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const sizeOptions = [
    { label: '16px - Extra Small', value: 16 },
    { label: '24px - Small', value: 24 },
    { label: '32px - Medium', value: 32 },
    { label: '48px - Large', value: 48 },
    { label: '64px - Extra Large', value: 64 },
    { label: '128px - Huge', value: 128 },
    { label: '256px - Massive', value: 256 }
  ];

  const handleExportSelected = async () => {
    if (selectedIcons.length === 0) {
      toast.error('No icons selected for export');
      return;
    }

    setIsExporting(true);

    try {
      for (const icon of selectedIcons) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay between downloads
        await downloadIcon(icon.svg, icon.name, exportFormat, exportSize);
      }

      toast.success(
        `Exported ${
          selectedIcons.length
        } icons as ${exportFormat.toUpperCase()}`
      );
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveCollection = async () => {
    if (selectedIcons.length === 0) {
      toast.error('No icons selected to save');
      return;
    }

    if (!collectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    setIsSaving(true);

    try {
      const response = await iconsApi.saveCollection({
        icons: selectedIcons,
        collection_name: collectionName.trim()
      });

      if (response.success) {
        toast.success('Collection saved successfully!');
        setCollectionName('');
        onClearSelection();
      } else {
        throw new Error(response.error || 'Failed to save collection');
      }
    } catch (error: any) {
      console.error('Save collection failed:', error);
      toast.error(error.message || 'Failed to save collection');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyAllSVGs = async () => {
    if (selectedIcons.length === 0) {
      toast.error('No icons selected');
      return;
    }

    try {
      const allSVGs = selectedIcons
        .map((icon) => `<!-- ${icon.name} -->\n${icon.svg}`)
        .join('\n\n');

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(allSVGs);
        toast.success('All SVGs copied to clipboard!');
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = allSVGs;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        textArea.remove();

        if (success) {
          toast.success('All SVGs copied to clipboard!');
        } else {
          throw new Error('Failed to copy to clipboard');
        }
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy SVGs to clipboard');
    }
  };

  if (selectedIcons.length === 0) {
    return (
      <Card className='export-panel-empty'>
        <Empty
          image={<InboxOutlined />}
          description={
            <div>
              <Title level={4} className='mb-3'>
                Ready to export?
              </Title>
              <Text type='secondary' className='block'>
                Select some icons from your generated collection to unlock
                export options and save your favorites!
              </Text>
              <Text type='secondary' className='text-sm mt-2 block'>
                👆 Click on icons to select them
              </Text>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <Card className='export-panel'>
      <div className='panel-header'>
        <Title level={2} className='flex items-center'>
          <DownloadOutlined className='mr-3' />
          Export & Save
          <Badge count={selectedIcons.length} className='ml-3' />
        </Title>
        <Text type='secondary'>
          Download your icons in multiple formats or save them to your personal
          library
        </Text>
      </div>

      {/* Selected Icons Preview */}
      <div className='selected-icons-preview'>
        <Title level={4} className='flex items-center'>
          ✨ Your Selected Icons
        </Title>
        <div className='icons-list'>
          {selectedIcons.map((icon, index) => (
            <div
              key={icon.id}
              className='icon-chip'
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className='icon-chip-svg'
                dangerouslySetInnerHTML={{ __html: icon.svg }}
              />
              <span className='icon-chip-name'>
                {icon.name || icon.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <div className='export-settings'>
            <Title level={3}>⚙️ Export Settings</Title>

            <Form layout='vertical'>
              <Form.Item label='🎨 Choose Format'>
                <Radio.Group
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <Space direction='vertical' style={{ width: '100%' }}>
                    <Radio.Button value='svg' className='format-option'>
                      <FileTextOutlined className='mr-2' />
                      SVG
                    </Radio.Button>
                    <Radio.Button value='png' className='format-option'>
                      <PictureOutlined className='mr-2' />
                      PNG
                    </Radio.Button>
                    <Radio.Button value='jpg' className='format-option'>
                      <PictureOutlined className='mr-2' />
                      JPG
                    </Radio.Button>
                  </Space>
                </Radio.Group>
              </Form.Item>

              {exportFormat !== 'svg' && (
                <Form.Item label='📏 Export Size'>
                  <Select
                    value={exportSize}
                    onChange={setExportSize}
                    style={{ width: '100%' }}
                    options={sizeOptions}
                  />
                </Form.Item>
              )}

              <Space direction='vertical' style={{ width: '100%' }}>
                <Button
                  type='primary'
                  size='large'
                  block
                  loading={isExporting}
                  onClick={handleExportSelected}
                  icon={<DownloadOutlined />}
                >
                  {isExporting
                    ? 'Exporting...'
                    : `Download ${
                        selectedIcons.length
                      } ${exportFormat.toUpperCase()} files`}
                </Button>

                {exportFormat === 'svg' && (
                  <Button
                    block
                    onClick={handleCopyAllSVGs}
                    icon={<CopyOutlined />}
                  >
                    Copy All SVGs to Clipboard
                  </Button>
                )}
              </Space>
            </Form>
          </div>
        </Col>

        <Col span={12}>
          <div className='save-collection'>
            <Title level={3}>💾 Save to Library</Title>

            <Form layout='vertical'>
              <Form.Item label='📝 Collection Name'>
                <Input
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder='My Awesome Icon Set'
                />
              </Form.Item>

              <Button
                type='primary'
                block
                size='large'
                loading={isSaving}
                disabled={!collectionName.trim()}
                onClick={handleSaveCollection}
                icon={<SaveOutlined />}
                className='save-button'
              >
                {isSaving ? 'Saving...' : 'Save Collection'}
              </Button>
            </Form>

            <Alert
              message='💡 Pro Tip'
              description='Save collections to build your personal icon library and access them anytime!'
              type='info'
              showIcon
              className='pro-tip'
            />
          </div>
        </Col>
      </Row>

      <Divider />

      <div className='panel-footer'>
        <Space>
          <Button icon={<ClearOutlined />} onClick={onClearSelection}>
            Clear Selection
          </Button>
          <Text type='secondary'>
            {selectedIcons.length} icon{selectedIcons.length !== 1 ? 's' : ''}{' '}
            ready to export
          </Text>
        </Space>
      </div>
    </Card>
  );
};

export default ExportPanel;
