import React from 'react';
import { FaGoogle } from 'react-icons/fa';
// Import additional styles if needed

const Forgotpassword = () => {
  return (
    <div className="min-h-full w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
        </div>
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Reset your password</h1>
          <form method="POST" action="/api/auth">
            <div className="space-y-2 inC">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <input name="email" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="email" placeholder="m@example.com" type="email" required />
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <p id="message"></p>
              </div>
              <div className="space-y-2" style={{ display: 'none' }} id="Singnin">
                <span className="text-sm text-gray-500 dark:text-blue-400" onClick={() => setHiddenValue('Singnin')}>
                  I don't have an account
                </span>
              </div>
              <div className="space-y-2" style={{ display: 'none' }} id="forgot">
                <span className="text-sm text-gray-500 dark:text-blue-400" onClick={() => setHiddenValue('forgot')}>
                  I forgot my password
                </span>
              </div>
              <button type="button" onClick={() => send()} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full inC">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/signup.jpg)' }}
      ></div>
    </div>
  );
};

export default Forgotpassword;
