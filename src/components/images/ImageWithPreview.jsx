import React from 'react'
import { useState } from 'react';
import ImagePreviewModal from './ImagePreviewModal';
import { Image } from 'antd';

const ImageWithPreview = ({src, width, height}) => {

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Image
        src={src}
        preview={false}
        onClick={() => setVisible(true)}
        style={{ cursor: 'pointer' }}
        width={width}
        height={height}
        className='object-cover flex items-center justify-center rounded-full border border-blue-200 dark:border-gray-200'
      />

      <ImagePreviewModal
        visible={visible}
        imageUrl={src}
        onClose={() => setVisible(false)}
      />
    </>
  )
}

export default ImageWithPreview