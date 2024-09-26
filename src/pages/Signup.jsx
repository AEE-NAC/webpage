import {
  CitySelect,
  CountrySelect,
  StateSelect,
  LanguageSelect,
} from "react-country-state-city";
import { useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";

const Signup = () => {
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);

  // Form submission function
  const send = async () => {
    // Get the form data
    const formData = new FormData(document.querySelector("form"));
    // Convert formData to JSON object
    const data = Object.fromEntries(formData);

    try {
      // Submit the form data
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle success
        alert("Signup successful!");
      } else {
        // Handle error
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
        </div>
        <div className="max-w-lg w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Create an Account</h1>
          <form method="POST">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label htmlFor="nom" className="text-sm font-medium">Nom</label>
                <input
                  name="nom"
                  id="nom"
                  className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Kyllian"
                  type="text"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="prenom" className="text-sm font-medium">Prenom</label>
                <input
                  name="prenom"
                  id="prenom"
                  className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  placeholder="John"
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="w-full">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <input
                  name="username"
                  id="username"
                  className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Doe"
                  type="text"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select
                  id="status"
                  name="roles"
                  className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="" disabled selected>Status</option>
                  <option value="0">Volontaire</option>
                  <option value="1">Membre de conseil</option>
                  <option value="2">Moniteur</option>
                  <option value="3">Supporteur</option>
                  <option value="5">Formateur</option>
                  <option value="6">Ouvrier à temps plein</option>
                  <option value="7">Ouvrier à temps partiel</option>
                  <option value="4">Autres</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="telephone" className="text-sm font-medium">Téléphone</label>
              <input
                name="telephone"
                id="telephone"
                type="tel"
                className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                name="email"
                id="email"
                type="email"
                className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="w-full">
                <label htmlFor="country" className="text-sm font-medium">Country</label>
                <CountrySelect
                  onChange={(e) => setCountryid(e.id)}
                  placeHolder="Select Country"
                />
              </div>
              <div className="w-full">
                <label htmlFor="state" className="text-sm font-medium">State</label>
                <StateSelect
                  countryid={countryid}
                  onChange={(e) => setStateid(e.id)}
                  placeHolder="Select State"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                name="password"
                id="password"
                type="password"
                className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="button"
              onClick={send}
              className="mt-6 block w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/signup.jpg)" }}
      ></div>
    </div>
  );
};

export default Signup;
