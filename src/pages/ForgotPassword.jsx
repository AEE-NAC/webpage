import React from 'react';
import { FaGoogle } from 'react-icons/fa';
// Import additional styles if needed

const Forgotpassword = () => {
  return (
    <div className="min-h-full w-full flex flex-col md:flex-row  overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
      <div class="fixed top-0 left-0 p-4">
        <img src="/images/logo@1x.png" alt="DJONDJON Logo" className="w-36 h-12"/>
    </div>
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Retrieve your account</h1>
          <form className="w-full">
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
            />
            <button className="w-full mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Submit
            </button>
          </form>
          <p className="text-center">
            Have an account?{' '}
            <a href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/Frame4@1x.png)' }}
      ></div>
    </div>
  );
};

export default Forgotpassword;
