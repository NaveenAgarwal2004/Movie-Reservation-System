import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'list';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1,
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-gray-800 rounded-lg overflow-hidden animate-pulse ${className}`}>
            <div className="h-64 bg-gray-700"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-10 bg-gray-700 rounded mt-4"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        );
      
      case 'avatar':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`bg-gray-800 rounded-lg p-6 animate-pulse ${className}`}>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default LoadingSkeleton;