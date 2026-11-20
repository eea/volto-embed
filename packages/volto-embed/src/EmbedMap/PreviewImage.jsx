import Image from '@plone/volto/components/theme/Image/Image';

const PreviewImage = ({ image, alt }) => {
  const item = Array.isArray(image) ? image[0] : image;
  const uploadedFileSrc =
    item?.data && item['content-type']
      ? `data:${item['content-type']};base64,${item.data}`
      : undefined;
  const src = typeof item === 'string' ? item : uploadedFileSrc;

  if (!item) return null;

  return (
    <Image
      item={src ? undefined : item}
      src={src}
      alt={alt || ''}
      className="print-map-preview"
      loading="eager"
      responsive
    />
  );
};

export default PreviewImage;
