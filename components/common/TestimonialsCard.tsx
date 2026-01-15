import React from 'react';

interface TestimonialCardProps {
  text: string;
  name: string;
  title: string;
  imgSrc: string;
}

const TestimonialCard = ({ text, name, title, imgSrc }: TestimonialCardProps) => (
    <div className="flex flex-col bg-white p-6 rounded-lg w-full md:w-2/3 h-full mx-4 justify-between shadow-sm border border-zinc-100" >
     <div className="w-full"> 
      {/* FaQuoteLeft replacement */}
      <svg className="text-blue-500 text-2xl mb-4 w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.03 14.929 15.401C15.535 14.773 16.377 14.457 17.452 14.453V4.453C14.707 4.453 12.378 5.441 10.465 7.418C8.552 9.395 7.478 12.189 7.242 15.801H4V21H14.017ZM20.017 21V18C20.017 16.896 20.321 16.03 20.929 15.401C21.535 14.773 22.377 14.457 23.452 14.453V4.453C20.707 4.453 18.378 5.441 16.465 7.418C14.552 9.395 13.478 12.189 13.242 15.801H10V21H20.017Z" />
      </svg>
      <p className="text-gray-700 mb-4">{text}</p>
      </div>
      <div className="flex items-center relative bottom-0 self-baseline mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div className='self-baseline'>
          <p className="font-bold">{name}</p>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
  
export default TestimonialCard;