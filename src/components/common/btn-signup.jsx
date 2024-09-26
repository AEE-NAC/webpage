import React from 'react';

const SignupButton = () => {
  return (
    <>
  <div className='w-[200px] flex justify-around'>
   <a href='/donation'>
    <button className="items-center text-white   bg-[#981a3c] text-white justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground  h-10 px-4 py-2 hidden md:inline-flex">
           Donate
     </button>
  </a>
    <a href='/signup'>
      <button className="items-center text-white   bg-[#2b2b3f] text-white justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground  h-10 px-4 py-2 hidden md:inline-flex">
             S'inscrire
       </button>
    </a>
    </div>
    </>
  );
};

export default SignupButton;
