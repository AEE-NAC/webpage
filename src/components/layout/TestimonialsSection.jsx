import React from 'react';
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import TestimonialCard from '../common/TestimonialsCard';
const testimonials = [
  {
    text: "Lorem ipsum dolor sit amer ids mu jds dolor ipsum amer lorem",
    name: "Elene duval",
    title: "Internet Marketer",
    imgSrc: "https://via.placeholder.com/50",
  },
  {
    text: "Lorem ipsum dolor sit amer ids mu jds dolor ipsum amer lorem",
    name: "Anne Marie",
    title: "Book writer",
    imgSrc: "https://via.placeholder.com/50",
  },
  {
    text: "Lorem ipsum dolor sit amer ids mu jds dolor ipsum amer lorem",
    name: "Elene duval",
    title: "Internet Marketer",
    imgSrc: "https://via.placeholder.com/50",
  },
];
export default function TestimonialSection() {
  return (
    <div className=" flex flex-col px-10  bg-[#24befb45] py-10" style={{height:"500px"}} >
      <h2 className="text-4xl font-bold  text-left  text-black mb-6">Laissez nos utilisateurs parler de DJONDJON</h2>
      <div className="flex items-center justify-center self-end  mb-6">
        <button className="bg-white p-2 rounded-full mr-2">
          <FaArrowLeft className="text-blue-500" />
        </button>
        <span className="text-black">1/6</span>
        <button className="bg-white p-2 rounded-full ml-2">
          <FaArrowRight className="text-blue-500" />
        </button>
      </div>
      <div className="flex justify-center w-full h-full " style={{height:"300px"}}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

