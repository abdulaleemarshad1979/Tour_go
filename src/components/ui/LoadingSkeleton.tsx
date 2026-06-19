import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 select-none my-4">
      {/* Header Loading Shimmer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/8 pb-4">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-48 shimmer rounded-lg" />
          <div className="h-3.5 w-64 shimmer rounded mt-1" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-24 shimmer rounded-full" />
          <div className="h-6 w-24 shimmer rounded-full" />
        </div>
      </div>

      {/* Grid Shimmer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="glass rounded-2xl overflow-hidden flex flex-col aspect-[3/4] p-4 bg-white/2"
          >
            {/* Image Placeholder */}
            <div className="h-[58%] w-full shimmer rounded-xl mb-4" />

            {/* Content Details placeholders */}
            <div className="flex-grow flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-4.5 w-11/12 shimmer rounded" />
                <div className="h-3 w-8/12 shimmer rounded mt-1" />
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {/* Stats Row */}
                <div className="flex gap-2">
                  <div className="h-3 w-10 shimmer rounded" />
                  <div className="h-3 w-16 shimmer rounded" />
                  <div className="h-3 w-14 shimmer rounded" />
                </div>
                {/* Button */}
                <div className="h-9 w-full shimmer rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
