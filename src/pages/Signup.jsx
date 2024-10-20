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

const Signup = () => {
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const [phone, setPhone] = useState(""); // State for phone number
  const [error, setError] = useState(""); // State for error messages

  // Form submission function
  const send = async () => {
    // Validate the phone number
    if (!phone) {
      setError("Phone number is required.");
      return;
    }

    // Get the form data
    const formData = new FormData(document.querySelector("form"));
    const data = Object.fromEntries(formData);

    // Generate username from nom and prenom
    const generatedUsername = `${data.prenom.toLowerCase()}.${data.nom.toLowerCase()}`;

    try {
      // Signup with Supabase
      const { user, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signupError) {
        alert("Signup failed. Please try again.");
        console.error("Error during signup:", signupError.message);
        return;
      }

      // Insert the user data into the 'users' table
      const { error } = await supabase.from('users').insert([{
        nom: data.nom,
        prenom: data.prenom,
        username: generatedUsername, // Use the generated username
        status: parseInt(data.roles), // Parse status as integer
        telephone: phone, // Use the phone number
        email: data.email,
        country: countryid,
        state: stateid,
        // Password is not stored in the database as it is managed by Supabase
      }]);

      if (error) {
        // Handle error
        alert("Failed to store user data. Please try again.");
        console.error("Error inserting data:", error.message);
      } else {
        // Handle success
        alert("Signup successful!");
        console.log("User JWT token:", supabase.auth.session().access_token); // Access the JWT token
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
        <a href="../"><img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" /></a>
        </div>
        <div className="max-w-lg w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Create an Account</h1>
          <form>
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
              <PhoneInput
                country={"us"} // Default country can be set here
                value={phone}
                onChange={setPhone} // Update the phone state
                className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
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
            <div className="space-y-2" style={{ display: 'none' }} id="Singnin">
                <span className="text-sm text-gray-500 dark:text-blue-400">
                  <a href="../signup">I don't have an account</a>
                </span>
              </div>
              <div className="space-y-2" style={{ display: 'none' }} id="forgot">
                <span className="text-sm text-gray-500 dark:text-blue-400" onClick={() => setHiddenValue('forgot')}>
                  <a href="../forgot">I forgot my password</a>
                </span>
              </div>
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
