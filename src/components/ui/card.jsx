import React from "react";

const Card = ({ title, description, image }) => {
  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 w-full max-w-sm">
      {image && <img src={image} alt={title} className="w-full h-40 object-cover rounded-t-2xl" />}
      <div className="p-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Card;
