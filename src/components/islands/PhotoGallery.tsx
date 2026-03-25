import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PhotoGalleryProps {
  images: { src: string; alt: string }[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const withBase = (path: string) => {
    if (!path.startsWith('/')) return path;
    return `${baseUrl}${path.replace(/^\/+/, '')}`;
  };

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openLightbox = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="photo-gallery">
        {images.map((img, i) => (
          <button
            key={i}
            className="photo-gallery__thumb"
            onClick={() => openLightbox(i)}
            aria-label={`Открыть фото: ${img.alt}`}
          >
            <img src={withBase(img.src)} alt={img.alt} loading="lazy" />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: withBase(img.src), alt: img.alt }))}
      />
    </>
  );
}
