import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  Layout,
  Button,
  Space,
  Typography,
  Badge,
  FloatButton,
  Drawer,
  Tag
} from 'antd';
import {
  AppstoreOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  DownloadOutlined,
  GithubOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Icon } from './types';
import IconGenerator from './components/IconGenerator';
import IconDisplay from './components/IconDisplay';
import IconEditor from './components/IconEditor';
import ExportPanel from './components/ExportPanel';
import './App.less';

const { Header, Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

function App() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedIcons, setSelectedIcons] = useState<Icon[]>([]);
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileExportVisible, setMobileExportVisible] = useState(false);

  const handleIconsGenerated = (newIcons: Icon[]) => {
    setIcons(newIcons);
    setSelectedIcons([]);
  };

  const handleIconSelect = (icon: Icon) => {
    setSelectedIcons((prev) => {
      const isSelected = prev.some((selected) => selected.id === icon.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== icon.id);
      } else {
        return [...prev, icon];
      }
    });
  };

  const handleIconEdit = (icon: Icon) => {
    setEditingIcon(icon);
    setIsEditorOpen(true);
  };

  const handleIconSave = (editedIcon: Icon) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === editedIcon.id ? editedIcon : icon))
    );

    setSelectedIcons((prev) =>
      prev.map((icon) => (icon.id === editedIcon.id ? editedIcon : icon))
    );
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingIcon(null);
  };

  const handleClearSelection = () => {
    setSelectedIcons([]);
  };

  const handleSelectAll = () => {
    setSelectedIcons(icons);
  };

  const handleDeselectAll = () => {
    setSelectedIcons([]);
  };

  return (
    <Layout className='app-layout'>
      <Header className='app-header'>
        <div className='header-content'>
          <div className='layout-header-title'>
            <Title level={1} className='app-title' style={{ margin: 0 }}>
              <AppstoreOutlined className='title-icon' />
              AI Icon Factory
            </Title>
            <Text className='app-subtitle'>
              Transform ideas into beautiful icons
            </Text>
            <Tag color='blue' className='animate-pulse'>
              ✨ New
            </Tag>
          </div>

          <div className='header-actions'>
            {icons.length > 0 && (
              <Space>
                <Button
                  icon={<CheckSquareOutlined />}
                  onClick={handleSelectAll}
                  size='small'
                >
                  Select All ({icons.length})
                </Button>
                <Button
                  icon={<CloseSquareOutlined />}
                  onClick={handleDeselectAll}
                  size='small'
                >
                  Deselect All
                </Button>
              </Space>
            )}
            {selectedIcons.length > 0 && (
              <Badge
                count={selectedIcons.length}
                style={{ backgroundColor: '#52c41a' }}
                className='selected-badge'
              >
                <Text>Selected</Text>
              </Badge>
            )}
          </div>
        </div>
      </Header>

      <Content className='app-content'>
        {/* Hero section for empty state */}
        {icons.length === 0 && (
          <div className='empty-state'>
            <div className='empty-state-content'>
              <Title level={2} className='empty-state-title'>
                🎨 Create Your First Icon
              </Title>
            </div>
          </div>
        )}

        <div className='content-grid'>
          {/* Left Column - Generator */}
          <div className='generator-column'>
            <IconGenerator
              onIconsGenerated={handleIconsGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Right Column - Results */}
          <div className='results-column'>
            <IconDisplay
              icons={icons}
              onIconSelect={handleIconSelect}
              selectedIcons={selectedIcons}
              onIconEdit={handleIconEdit}
            />

            {selectedIcons.length > 0 && (
              <div className='export-section'>
                <ExportPanel
                  selectedIcons={selectedIcons}
                  onClearSelection={handleClearSelection}
                />
              </div>
            )}
          </div>
        </div>

        {/* Floating action button for mobile */}
        {selectedIcons.length > 0 && (
          <FloatButton
            icon={<DownloadOutlined />}
            type='primary'
            className='mobile-float-button'
            onClick={() => setMobileExportVisible(true)}
          />
        )}

        {/* Mobile Export Drawer */}
        <Drawer
          title='Export Icons'
          placement='bottom'
          onClose={() => setMobileExportVisible(false)}
          open={mobileExportVisible}
          className='mobile-export-drawer'
        >
          <ExportPanel
            selectedIcons={selectedIcons}
            onClearSelection={handleClearSelection}
          />
        </Drawer>
      </Content>

      <Footer className='app-footer'>
        <div className='footer-content'>
          <Space split={<span className='footer-divider'>•</span>}>
            <Link
              href='https://github.com/lxfu1/ai-icon-factory'
              target='_blank'
              rel='noopener noreferrer'
              className='footer-link'
            >
              <GithubOutlined />
              View on GitHub
            </Link>
            <Text className='footer-text'>
              Made with <HeartOutlined /> by AI Icon Factory Team
            </Text>
          </Space>
        </div>
      </Footer>

      {/* Background decorations */}
      <div className='bg-decoration bg-decoration-1'></div>
      <div className='bg-decoration bg-decoration-2'></div>
      <div className='bg-decoration bg-decoration-3'></div>

      {/* Icon Editor Modal */}
      <IconEditor
        icon={editingIcon}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleIconSave}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className='loading-overlay'>
          <div className='loading-content'>
            <div className='loading-spinner'>
              <AppstoreOutlined />
            </div>
            <Title level={4} className='loading-title'>
              Creating Magic...
            </Title>
            <Text className='loading-text'>
              AI is generating your custom icons
            </Text>
            <div className='loading-dots'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </Layout>
  );
}

export default App;
