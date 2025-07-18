import React from "react";

const UserSkeleton = () => {
  return (
    <div className="py-[10px] border-b-2 border-gray-300 flex items-center justify-between animate-pulse">
      <div className="flex gap-x-[14px] w-[75%] items-center">
        <div>
          <div className="w-[52px] h-[52px] bg-gray-300 rounded-full" />
        </div>

        <div className="w-[60%] space-y-2">
          <div className="h-[14px] bg-gray-300 rounded w-[80%]" />
          <div className="h-[10px] bg-gray-200 rounded w-[60%]" />
        </div>
      </div>

      <div className="w-[50px] h-[30px] bg-gray-200 rounded" />
    </div>
  );
};

export default UserSkeleton;
