import React from 'react';
import Image from 'next/image';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-250 text-center">
        <Image 
          src="/404-image.png" 
          alt="404 Not Found" 
          width={500}       
          height={500}           
        />
      </div>
  );
};

export default NotFound;
