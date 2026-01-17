import React from 'react';

interface TestimonialCardProps {
  name: string;
  title: string;
  text: string;
  imgSrc: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, title, text, imgSrc }) => {
  return (
    <div className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-xl md:rounded-2xl overflow-hidden p-4 md:p-6 space-y-3 md:space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={imgSrc || 'https://via.placeholder.com/50'}
            alt={name}
            className="w-10 h-10 md:w-12.5 md:h-12.5 rounded-full object-cover"
          />
          <div className="flex flex-col pl-3 md:pl-4">
            <span className="text-sm md:text-base text-[#0f0f0fff] font-semibold">
              {name}
            </span>
            <span className="text-xs md:text-sm text-[#878578ff]">
              {title}
            </span>
          </div>
        </div>
        <img 
          src="/images/logo_1st.png"
          className="w-6 h-6 object-contain opacity-50" 
          alt="logo"
        />
      </div>
      
      <div className="relative">
        {/* Quote Icon Background */}
        <svg 
          className="absolute -top-2 -left-2 w-8 h-8 text-[#981a3c]/10 -z-1" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.03 14.929 15.401C15.535 14.773 16.377 14.457 17.452 14.453V4.453C14.707 4.453 12.378 5.441 10.465 7.418C8.552 9.395 7.478 12.189 7.242 15.801H4V21H14.017ZM20.017 21V18C20.017 16.896 20.321 16.03 20.929 15.401C21.535 14.773 22.377 14.457 23.452 14.453V4.453C20.707 4.453 18.378 5.441 16.465 7.418C14.552 9.395 13.478 12.189 13.242 15.801H10V21H20.017Z" />
        </svg>
        <p className="text-sm md:text-base text-[#0f0f0fff] leading-relaxed italic relative z-10">
          {text}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;