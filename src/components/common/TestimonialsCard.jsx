import React from 'react';
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
const TestimonialCard = ({ text, name, title, imgSrc }) => (
    <div className="flex flex-col bg-white p-6 rounded-lg  w-2/3 h-full mx-4 justify-between " >
     <div className="w-full"> 
      <FaQuoteLeft className="text-blue-500 text-2xl mb-4" />
      <p className="text-gray-700 mb-4">{text}</p>
      </div>
      <div className="flex items-center relative bottom-0 self-baseline">
        <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div className='self-baseline'>
          <p className="font-bold">{name}</p>
          <p className="text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
  export default TestimonialCard;