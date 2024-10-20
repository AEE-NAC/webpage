import {
    CitySelect,
    CountrySelect,
    StateSelect,
  } from "react-country-state-city";
  import { useState } from "react";
  import "react-country-state-city/dist/react-country-state-city.css";
  import "react-phone-input-2/lib/style.css"; // Import the phone input styles
  import PhoneInput from "react-phone-input-2"; // Import PhoneInput component
  import supabase from "../services/supabase"; // Supabase service
import ProfileForm from "./profile.jsx"
  const Complete_profile = () => {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 bg-white">
          <div className="fixed top-0 left-0 p-4">
            <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
          </div>
          <div className="max-w-lg w-full ">
            <ProfileForm/>
          </div>
        </div>
        <div
          className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/signup.jpg)" }}
        ></div>
      </div>
    );
  };
  
  export default Complete_profile;
  