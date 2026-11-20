import { useEffect, useState } from 'react';
import Image from '@plone/volto/components/theme/Image/Image';
import { createImageUrl } from '@eeacms/volto-embed/PrivacyProtection/helpers';

const PreviewImage = ({ image, alt }) => {
  const item = Array.isArray(image) ? image[0] : image;
  const [uploadedFileSrc, setUploadedFileSrc] = useState();

  useEffect(() => {
    if (!item?.data) {
      setUploadedFileSrc(undefined);
      return undefined;
    }

    const imageUrl = createImageUrl(item);
    setUploadedFileSrc(imageUrl);

    return () => URL.revokeObjectURL?.(imageUrl);
  }, [item]);

  if (!item) return null;

  return (
    <Image
      src={typeof item === 'string' ? item : uploadedFileSrc}
      alt={alt || ''}
      className="print-map-preview"
      loading="eager"
      responsive
    />
  );
};

export default PreviewImage;
