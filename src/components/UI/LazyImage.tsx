import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23374151" width="400" height="600"/%3E%3C/svg%3E',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imgRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before element enters viewport
        }
      );

      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const loadImage = () => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoading(false);
      onError?.();
    };
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'blur-sm' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default LazyImage;
