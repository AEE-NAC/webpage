import React from "react";

interface CardProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
}

const Card = ({ title, description, image, className = "" }: CardProps) => {
  return (
    <div className={`rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 w-full max-w-sm overflow-hidden ${className}`}>
      {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title} className="w-full h-40 object-cover rounded-xl mb-3" />
      )}
      <div className="p-2">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Card;
