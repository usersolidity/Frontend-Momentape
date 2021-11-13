import React from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageUIProps {
  src: string;
  alt: string;
  objectFit: ImageProps['objectFit'];
  priority?: boolean;
}

export default function ImageUI({ src, alt, objectFit, priority }: ImageUIProps) {
  return <Image src={src} alt={alt} layout='fill' objectFit={objectFit} priority={priority} />;
}
