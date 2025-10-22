import React, { useState, useEffect } from 'react';
import { Icon, EditableIcon } from '../types';
import { toast } from 'react-hot-toast';
import { modifySVGColor, modifySVGSize, modifyStrokeWidth, validateSVG } from '../utils/iconUtils';
import {
  Modal,
  Tabs,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Typography,
  Row,
  Col,
  ColorPicker
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './IconEditor.less';

interface IconEditorProps {
  icon: Icon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedIcon: Icon) => void;
}

const { Title, Text } = Typography;
const { TextArea } = Input;

const IconEditor: React.FC<IconEditorProps> = ({
  icon,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedIcon, setEditedIcon] = useState<EditableIcon | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [svgCode, setSvgCode] = useState('');
  const [previewSize, setPreviewSize] = useState(128);

  useEffect(() => {
    if (icon) {
      const editableIcon: EditableIcon = {
        ...icon,
        selectedColor: '#000000',
        selectedSize: 32,
        strokeWidth: 2
      };
      setEditedIcon(editableIcon);
      setSvgCode(icon.svg);
    }
  }, [icon]);

  if (!isOpen || !editedIcon) return null;

  const handleColorChange = (color: string) => {
    const modifiedSVG = modifySVGColor(editedIcon.svg, color);
    setEditedIcon({ ...editedIcon, selectedColor: color, svg: modifiedSVG });
    setSvgCode(modifiedSVG);
  };

  const handleSizeChange = (size: number) => {
    const modifiedSVG = modifySVGSize(editedIcon.svg, size);
    setEditedIcon({ ...editedIcon, selectedSize: size, svg: modifiedSVG });
    setSvgCode(modifiedSVG);
  };

  const handleStrokeWidthChange = (strokeWidth: number) => {
    const modifiedSVG = modifyStrokeWidth(editedIcon.svg, strokeWidth);
    setEditedIcon({ ...editedIcon, strokeWidth, svg: modifiedSVG });
    setSvgCode(modifiedSVG);
  };

  const handleSVGCodeChange = (newCode: string) => {
    setSvgCode(newCode);
    if (validateSVG(newCode)) {
      setEditedIcon({ ...editedIcon, svg: newCode });
    }
  };

  const handleNameChange = (name: string) => {
    setEditedIcon({ ...editedIcon, name });
  };

  const handleDescriptionChange = (description: string) => {
    setEditedIcon({ ...editedIcon, description });
  };

  const handleSave = () => {
    if (!validateSVG(editedIcon.svg)) {
      toast.error('Invalid SVG code. Please check the syntax.');
      return;
    }

    const iconToSave: Icon = {
      id: editedIcon.id,
      name: editedIcon.name,
      description: editedIcon.description,
      svg: editedIcon.svg,
      category: editedIcon.category,
      isEdited: true
    };

    onSave(iconToSave);
    onClose();
    toast.success('Icon saved successfully!');
  };

  const resetToOriginal = () => {
    if (icon) {
      setEditedIcon({
        ...icon,
        selectedColor: '#000000',
        selectedSize: 32,
        strokeWidth: 2
      });
      setSvgCode(icon.svg);
      toast.success('Reset to original icon');
    }
  };

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
  ];

  const tabItems = [
    {
      key: 'visual',
      label: (
        <span>
          <EditOutlined />
          Visual Editor
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                value={editedIcon.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter icon name"
              />
            </Form.Item>

            <Form.Item label="Description">
              <TextArea
                value={editedIcon.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={2}
                placeholder="Enter icon description"
              />
            </Form.Item>

            <Form.Item label="Color">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <ColorPicker
                    value={editedIcon.selectedColor}
                    onChange={(color) => handleColorChange(color.toHexString())}
                    showText
                  />
                  <Input
                    value={editedIcon.selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#000000"
                    style={{ flex: 1 }}
                  />
                </Space>
                <Row gutter={[8, 8]}>
                  {presetColors.map((color) => (
                    <Col key={color}>
                      <Button
                        size="small"
                        onClick={() => handleColorChange(color)}
                        style={{
                          backgroundColor: color,
                          borderColor: color,
                          width: 32,
                          height: 32
                        }}
                        title={color}
                      />
                    </Col>
                  ))}
                </Row>
              </Space>
            </Form.Item>

            <Form.Item label={`Icon Size: ${editedIcon.selectedSize}px`}>
              <InputNumber
                min={16}
                max={128}
                value={editedIcon.selectedSize}
                onChange={(value) => handleSizeChange(value || 32)}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label={`Stroke Width: ${editedIcon.strokeWidth}px`}>
              <InputNumber
                min={0}
                max={8}
                step={0.5}
                value={editedIcon.strokeWidth}
                onChange={(value) => handleStrokeWidthChange(value || 2)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </Space>
      )
    },
    {
      key: 'code',
      label: (
        <span>
          <EditOutlined />
          Code Editor
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form layout="vertical">
            <Form.Item
              label="SVG Code"
              help={validateSVG(svgCode) ?
                <Text type="success">✓ Valid SVG</Text> :
                <Text type="danger">✗ Invalid SVG</Text>
              }
            >
              <TextArea
                value={svgCode}
                onChange={(e) => handleSVGCodeChange(e.target.value)}
                rows={16}
                placeholder="<svg>...</svg>"
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Item>
          </Form>
        </Space>
      )
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Edit Icon"
      width={1200}
      className="icon-editor-modal"
      footer={[
        <Button key="reset" icon={<ReloadOutlined />} onClick={resetToOriginal}>
          Reset to Original
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          disabled={!validateSVG(editedIcon.svg)}
        >
          Save Changes
        </Button>
      ]}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="preview-section">
              <Title level={4}>
                <EyeOutlined /> Preview
              </Title>
              <div className="preview-container">
                <div
                  className="preview-svg"
                  style={{ width: previewSize, height: previewSize }}
                  dangerouslySetInnerHTML={{ __html: editedIcon.svg }}
                />
              </div>
              <div className="preview-controls">
                <Text type="secondary">Preview Size: {previewSize}px</Text>
                <InputNumber
                  min={32}
                  max={256}
                  value={previewSize}
                  onChange={(value) => setPreviewSize(value || 128)}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </div>
            </div>
          </Space>
        </Col>
        <Col span={12}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'visual' | 'code')}
            items={tabItems}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default IconEditor;