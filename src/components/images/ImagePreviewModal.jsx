import { Modal } from 'antd';

const ImagePreviewModal = ({ visible, imageUrl, onClose }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <img src={imageUrl} alt="Preview" style={{ width: '100%' }} className='z-10' />
    </Modal>
  );
};

export default ImagePreviewModal;