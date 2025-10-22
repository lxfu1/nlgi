import React, { useState } from 'react';
import {
  Card,
  Empty,
  Typography,
  Badge,
  Dropdown,
  Button,
  Tooltip,
  Row,
  Col,
  message
} from 'antd';
import {
  EditOutlined,
  CopyOutlined,
  DownloadOutlined,
  CheckOutlined,
  AppstoreOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Icon } from '../types';
import { downloadIcon, copySVGToClipboard } from '../utils/iconUtils';
import './IconDisplay.less';

const { Title, Text, Paragraph } = Typography;

interface IconDisplayProps {
  icons: Icon[];
  onIconSelect: (icon: Icon) => void;
  selectedIcons: Icon[];
  onIconEdit: (icon: Icon) => void;
}

const IconDisplay: React.FC<IconDisplayProps> = ({
  icons,
  onIconSelect,
  selectedIcons,
  onIconEdit
}) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleCopySVG = async (icon: Icon) => {
    try {
      const success = await copySVGToClipboard(icon.svg);
      if (success) {
        message.success('SVG copied to clipboard!');
      } else {
        message.error('Failed to copy SVG');
      }
    } catch (error) {
      console.error('Failed to copy SVG:', error);
      message.error('Failed to copy SVG');
    }
  };

  const handleDownload = async (icon: Icon, format: 'svg' | 'png' | 'jpg') => {
    try {
      await downloadIcon(icon.svg, icon.name, format);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isSelected = (icon: Icon) => {
    return selectedIcons.some((selected) => selected.id === icon.id);
  };

  if (icons.length === 0) {
    return (
      <Card className='icon-display-empty'>
        <Empty
          image={
            <div className='empty-icon'>
              <EyeOutlined />
            </div>
          }
          description={
            <div>
              <Title level={4} className='mb-3'>
                No icons yet
              </Title>
              <Paragraph className='text-gray-600'>
                Start by describing your dream icons in the generator. Watch as
                AI creates beautiful variations for you!
              </Paragraph>
              <Text type='secondary' className='text-sm'>
                💡 Try something like "modern settings gear" to get started
              </Text>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <Card className='icon-display-card'>
      <div className='icon-display-header'>
        <div className='header-title'>
          <Title level={2}>
            <AppstoreOutlined style={{ marginRight: 6 }} />
            Your Generated Icons
            <Badge count={icons.length} />
          </Title>
          <p>
            Click to select, hover for actions, and unleash your creativity!
          </p>
        </div>
      </div>

      <Row gutter={[24, 24]} className='icon-grid'>
        {icons.map((icon, index) => {
          const downloadItems = [
            {
              key: 'svg',
              label: (
                <span>
                  <span className='mr-2'>📄</span>
                  Download SVG
                </span>
              ),
              onClick: () => handleDownload(icon, 'svg')
            },
            {
              key: 'png',
              label: (
                <span>
                  <span className='mr-2'>🖼️</span>
                  Download PNG
                </span>
              ),
              onClick: () => handleDownload(icon, 'png')
            },
            {
              key: 'jpg',
              label: (
                <span>
                  <span className='mr-2'>📷</span>
                  Download JPG
                </span>
              ),
              onClick: () => handleDownload(icon, 'jpg')
            }
          ];

          return (
            <Col
              key={icon.id}
              xs={12}
              sm={8}
              md={6}
              lg={6}
              xl={6}
              className='icon-card-container'
            >
              <Card
                className={`
                  icon-card
                  ${isSelected(icon) ? 'selected' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                hoverable
                onClick={() => onIconSelect(icon)}
                onMouseEnter={() => setHoveredIcon(icon.id || null)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                {/* Icon Preview */}
                <div className='icon-preview'>
                  <div className='icon-svg-container'>
                    <div
                      className='icon-svg'
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                  </div>

                  {/* Quick Actions Badge */}
                  {hoveredIcon === icon.id && (
                    <div className='quick-actions-badge'>
                      <EditOutlined />
                    </div>
                  )}
                </div>

                {/* Icon Info */}
                <div className='icon-info'>
                  <Text
                    type='secondary'
                    className='icon-description'
                    title={icon.description}
                  >
                    {icon.description}
                  </Text>
                </div>

                {/* Hover Actions */}
                <div
                  className={`hover-actions ${
                    hoveredIcon === icon.id ? 'visible' : ''
                  }`}
                >
                  <div className='actions-column'>
                    {/* Edit Button */}
                    <Tooltip title='Edit icon'>
                      <Button
                        type='text'
                        size='small'
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onIconEdit(icon);
                        }}
                      />
                    </Tooltip>

                    {/* Copy SVG Button */}
                    <Tooltip title='Copy SVG'>
                      <Button
                        type='text'
                        size='small'
                        icon={<CopyOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopySVG(icon);
                        }}
                      />
                    </Tooltip>

                    {/* Download Menu */}
                    <Dropdown
                      menu={{ items: downloadItems }}
                      trigger={['click']}
                      placement='bottomRight'
                    >
                      <Button
                        type='text'
                        size='small'
                        icon={<DownloadOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected(icon) && (
                  <div className='selection-indicator'>
                    <CheckOutlined />
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default IconDisplay;
