import React from 'react';
import { FaGoogle } from 'react-icons/fa';
// Import additional styles if needed

const Signup = () => {
  return (
    <div className="min-h-full w-full flex flex-col md:flex-row  overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
      <div class="fixed top-0 left-0 p-4">
        <img src="/images/logo@1x.png" alt="DJONDJON Logo" className="w-36 h-12"/>
    </div>
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Create an Account</h1>
          <button className="flex items-center justify-center w-full mb-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            <FaGoogle className="mr-2" /> Sign up with Google
          </button>
          <div className="w-full mb-4 flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500">or</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <form className="w-full">
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
            />
            <button className="w-full mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Sign Up
            </button>
          </form>
          <a href="/forgotpassword" className="text-blue-500 hover:underline mb-4 block text-center">
            Forgot password?
          </a>
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

export default Signup;
