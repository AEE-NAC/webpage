import { useState, useEffect } from "react";
import { CountrySelect, StateSelect } from "react-country-state-city";
import supabase from "../services/supabase";

const Signup = () => {
  const [countryCode, setCountryCode] = useState(""); // Code du pays
  const [countryFlag, setCountryFlag] = useState(""); // URL du drapeau
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const [phone, setPhone] = useState(""); // Numéro de téléphone
  const [error, setError] = useState(""); // Erreurs
  const [isSuccess, setIsSuccess] = useState(false); // État pour afficher le message de succès

  // Récupérer les informations de l'utilisateur via IPAPI
  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data) {
          setCountryCode(data.country_calling_code); // Code du pays
          setCountryFlag(`https://flagcdn.com/w40/${data.country_code.toLowerCase()}.png`); // Drapeau du pays
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'IP :", error);
      }
    };

    fetchCountryInfo();
  }, []);

  // Fonction d'envoi du formulaire
  const send = async () => {
    if (!phone) {
      setError("Le numéro de téléphone est requis.");
      return;
    }

    const formData = new FormData(document.querySelector("form"));
    const data = Object.fromEntries(formData);

    const generatedUsername = `${data.prenom.toLowerCase()}.${data.nom.toLowerCase()}`;

    try {
      const { user, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signupError) {
        alert("Échec de l'inscription. Veuillez réessayer.");
        console.error("Erreur lors de l'inscription :", signupError.message);
        return;
      }

      const { error } = await supabase.from("users").insert([
        {
          nom: data.nom,
          prenom: data.prenom,
          username: generatedUsername,
          status: parseInt(data.roles),
          telephone: phone,
          phone_number: phone,
          email: data.email,
          country: countryid,
          state: stateid,
        },
      ]);

      if (error) {
        alert("Échec de l'enregistrement des données utilisateur.");
        console.error("Erreur d'insertion :", error.message);
      } else {
        setIsSuccess(true); // Afficher le message de succès
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col px-4 bg-white">
        <div className="w-full absolute md:relative top-0 left-0 bg-white z-10 md:z-0">
          <a href="../" className="flex items-center gap-4">
            <img
              src="/images/logo_1st.png"
              alt="DJONDJON Logo"
              className="w-52 h-24"
            />
          </a>
        </div>
        <div className="self-center py-9 max-w-lg w-full">
          {isSuccess ? (
            // Message de succès
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Félicitations !
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Votre compte a été créé avec succès. Nous sommes heureux de vous
                compter parmi nos adhérents. Vous recevrez régulièrement des
                newsletters sur votre boîte mail.
              </p>
              <button
                onClick={() => {
                  // Redirection ou autre action
                  window.location.href = "/"; // Rediriger vers la page d'accueil
                }}
                className="mt-6 py-2 px-6 bg-[#29293b] text-white rounded-md hover:bg-[#1a1a2c] transition duration-300"
              >
                Retour à l'accueil
              </button>
            </div>
          ) : (
            // Formulaire d'inscription
            <>
              <h1 className="text-4xl font-bold mb-6 text-center">
                Créer un compte
              </h1>
              <form>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full">
                    <label htmlFor="nom" className="text-sm font-medium">
                      Nom
                    </label>
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
                    <label htmlFor="prenom" className="text-sm font-medium">
                      Prénom
                    </label>
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

                <div className="mt-4">
                  <label htmlFor="telephone" className="text-sm font-medium">
                    Téléphone
                  </label>
                  <div className="flex items-center gap-2">
                    {countryFlag && (
                      <img src={countryFlag} alt="Drapeau" className="w-6 h-4" />
                    )}
                    <input
                      type="text"
                      id="telephone"
                      name="telephone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={`${countryCode} Numéro`}
                      className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="mt-4">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
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
                    <label htmlFor="status" className="text-sm font-medium">
                      Statut
                    </label>
                    <select
                      id="status"
                      name="roles"
                      className="block w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="" disabled selected>
                        Statut
                      </option>
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
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="w-full">
                    <label htmlFor="country" className="text-sm font-medium">
                      Pays
                    </label>
                    <CountrySelect
                      onChange={(e) => setCountryid(e.id)}
                      placeHolder="Sélectionnez le pays"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="state" className="text-sm font-medium">
                      État
                    </label>
                    <StateSelect
                      countryid={countryid}
                      onChange={(e) => setStateid(e.id)}
                      placeHolder="Sélectionnez l'état"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
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
                  className="mt-6 block w-full py-2 px-4 bg-[#29293b] text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary"
                >
                  S'inscrire
                </button>
              </form>
            </>
          )}
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
