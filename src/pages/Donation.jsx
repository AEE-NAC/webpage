import React, { useState, useEffect } from 'react';

const ministries = [
  { id: 1, name: 'Ministry of Health' },
  { id: 2, name: 'Ministry of Education' },
  { id: 3, name: 'MBE (Ministère Biblique dans les Ecoles)' },
  { id: 4, name: 'CBN/KBN (Club de la Bonne Nouvelle/Klèb Bòn Nouvèl)' },
  { id: 5, name: 'Clubs Spéciaux : CFA (Club de Fin d’Année)' },
  { id: 6, name: 'Clubs Spéciaux : Club de Pâques' },
  { id: 7, name: 'Clubs Spéciaux : Autres' },
  { id: 8, name: 'JCA (Jeunesse Chrétienne en Action)' },
  { id: 9, name: 'C5J/K5J (Club de 5 Jours/Klèb 5 Jou)' },
];

const Donation = () => {
  const [donationType, setDonationType] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [materials, setMaterials] = useState([]);
  const [materialInput, setMaterialInput] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [donations, setDonations] = useState([]);
  const [currentDonationIndex, setCurrentDonationIndex] = useState(0);

  // État pour gérer l'affichage du conteneur d'informations
  const [showInfo, setShowInfo] = useState(false);

  // Charger les dons depuis le localStorage au montage du composant
  useEffect(() => {
    const storedDonations = JSON.parse(localStorage.getItem('donations'));
    if (storedDonations) {
      setDonations(storedDonations);
    }
  }, []);

  // Sauvegarder les dons dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
  }, [donations]);

  // Charger le don actuel dans le formulaire
  useEffect(() => {
    const currentDonation = donations[currentDonationIndex];
    if (currentDonation) {
      setDonationType(currentDonation.type);
      setSelectedMinistry(currentDonation.ministry);
      setAmount(currentDonation.amount || '');
      setCurrency(currentDonation.currency || 'USD');
      setPaymentMethod(currentDonation.paymentMethod || '');
      setMaterials(currentDonation.materials || []);
      setServiceDescription(currentDonation.serviceDescription || '');
      setMaterialInput('');
    } else {
      // Réinitialiser le formulaire si aucun don actuel
      setDonationType('');
      setSelectedMinistry('');
      setAmount('');
      setCurrency('USD');
      setPaymentMethod('');
      setMaterials([]);
      setMaterialInput('');
      setServiceDescription('');
    }
  }, [currentDonationIndex, donations]);

  const handleSaveDonation = () => {
    const updatedDonation = {
      type: donationType,
      ministry: selectedMinistry,
      amount: donationType === 'monetary' ? amount : null,
      currency: donationType === 'monetary' ? currency : null,
      paymentMethod: donationType === 'monetary' ? paymentMethod : null,
      materials: donationType === 'material' ? materials : null,
      serviceDescription: donationType === 'service' ? serviceDescription : null,
    };

    setDonations((prevDonations) => {
      const updatedDonations = [...prevDonations];
      updatedDonations[currentDonationIndex] = updatedDonation;
      return updatedDonations;
    });
  };

  const handleAddDonation = () => {
    // Sauvegarder le don actuel
    handleSaveDonation();

    // Ajouter un nouveau don vide
    const newDonation = {
      type: '',
      ministry: '',
      amount: null,
      currency: 'USD',
      paymentMethod: '',
      materials: [],
      serviceDescription: '',
    };

    setDonations((prevDonations) => {
      const updatedDonations = [...prevDonations, newDonation];
      setCurrentDonationIndex(updatedDonations.length - 1); // Index du nouveau don
      return updatedDonations;
    });

    // Les champs du formulaire seront réinitialisés par le useEffect
  };

  const handleSuivant = () => {
    // Sauvegarder le don actuel
    handleSaveDonation();
    // Afficher le conteneur d'informations
    setShowInfo(true);
  };

  const handlePreviousDonation = () => {
    if (currentDonationIndex > 0) {
      // Sauvegarder le don actuel
      handleSaveDonation();
      setCurrentDonationIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextDonation = () => {
    if (currentDonationIndex < donations.length - 1) {
      // Sauvegarder le don actuel
      handleSaveDonation();
      setCurrentDonationIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleAddMaterial = () => {
    if (materialInput.trim() !== '') {
      setMaterials([...materials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index) => {
    const newMaterials = [...materials];
    newMaterials.splice(index, 1);
    setMaterials(newMaterials);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form or Info Container */}
      <div className="w-full md:w-1/2 flex flex-col items-center p-2 bg-white">
        <div className="w-full p-4 fixed md:relative top-0 left-0 bg-white z-10 md:z-0 ">
          <a href="../" className="flex items-center gap-4">
            <img
              src="/images/logo_1st.png"
              alt="DJONDJON Logo"
              className="w-52 h-24"
            />
            <span className="text-lg md:text-xl lg:text-2xl text-[#2b2b3f]">
              
            </span>
          </a>
        </div>

        <div className="w-full pt-24 px-4">
          {!showInfo ? (
            // Formulaire de Don
            <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto p-6">
              {/* Badge du nombre de dons */}
              {donations.length > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {donations.length}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                    Faire un don
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Votre don aidera à soutenir les programmes de notre
                    organisation à but non lucratif.
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                <div className="grid gap-4">
              <div className="flex flex-row items-center gap-4">
                <p className="text-sm font-medium leading-none mb-2">
                  Please select the type of donation you wish to make:
                </p>
              </div>
              </div>
                  <div className="flex flex-row items-center gap-4">
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 ${
                        donationType === 'monetary'
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-input bg-white hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => setDonationType('monetary')}
                    >
                      Argent
                    </button>
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 ${
                        donationType === 'material'
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-input bg-white hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => setDonationType('material')}
                    >
                      Matériel
                    </button>
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 ${
                        donationType === 'service'
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-input bg-white hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => setDonationType('service')}
                    >
                      Service
                    </button>
                  </div>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor="ministry"
                      >
                        Ministère bénéficiaire
                      </label>
                      <select
                        id="ministry"
                        value={selectedMinistry}
                        onChange={(e) => setSelectedMinistry(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Sélectionnez un ministère</option>
                        {ministries.map((ministry) => (
                          <option key={ministry.id} value={ministry.name}>
                            {ministry.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {donationType === 'monetary' && (
                      <>
                        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
                          <div className="space-y-2 flex-1">
                            <label
                              className="text-sm font-medium leading-none"
                              htmlFor="amount"
                            >
                              Montant
                            </label>
                            <input
                              id="amount"
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                          </div>
                          <div className="space-y-2 mt-4 sm:mt-0">
                            <label
                              className="text-sm font-medium leading-none"
                              htmlFor="currency"
                            >
                              Devise
                            </label>
                            <select
                              id="currency"
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="HTG">HTG</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="paymentMethod"
                          >
                            Méthode de paiement
                          </label>
                          <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="">Sélectionnez une méthode</option>
                            <option value="CreditCard">Carte de crédit</option>
                            <option value="BankTransfer">Virement bancaire</option>
                            <option value="Paypal">PayPal</option>
                          </select>
                        </div>
                      </>
                    )}
                    {donationType === 'material' && (
                      <>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="materialInput"
                          >
                            Matériel
                          </label>
                          <div className="flex items-center">
                            <input
                              id="materialInput"
                              type="text"
                              value={materialInput}
                              onChange={(e) => setMaterialInput(e.target.value)}
                              className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                            <button
                              type="button"
                              onClick={handleAddMaterial}
                              className="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                        {materials.length > 0 && (
                          <div className="mt-4">
                            <label className="text-sm font-medium leading-none">
                              Matériels
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {materials.map((material, index) => (
                                <div
                                  key={index}
                                  className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                                >
                                  {material}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMaterial(index)}
                                    className="ml-2 text-gray-600 hover:text-gray-800"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {donationType === 'service' && (
                      <>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="serviceDescription"
                          >
                            Description du service
                          </label>
                          <textarea
                            id="serviceDescription"
                            value={serviceDescription}
                            onChange={(e) => setServiceDescription(e.target.value)}
                            className="flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            rows="4"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        type="button"
                        onClick={handleSuivant}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        Suivant
                      </button>
                      <button
                        type="button"
                        onClick={handleAddDonation}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        Ajouter un don
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDonation}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        Sauvegarder le don
                      </button>
                    </div>
                  </div>
                  {donations.length > 0 && (
                    <div className="flex justify-center items-center space-x-4 mt-4">
                      <button
                        onClick={handlePreviousDonation}
                        disabled={currentDonationIndex === 0}
                        className="inline-flex items-center justify-center rounded-full text-sm font-medium border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 w-10"
                      >
                        &#8592;
                      </button>
                      <span className="text-sm font-medium">
                        {currentDonationIndex + 1}/{donations.length}
                      </span>
                      <button
                        onClick={handleNextDonation}
                        disabled={currentDonationIndex >= donations.length - 1}
                        className="inline-flex items-center justify-center rounded-full text-sm font-medium border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 w-10"
                      >
                        &#8594;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Conteneur d'Informations après Suivant
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto p-6">
              {/* Bouton Before pour retourner au formulaire */}
              <div className="flex justify-start mb-4">
                <button
                  type="button"
                  onClick={() => setShowInfo(false)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Before
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                {/* Informations Bancaires */}
                <div className="border border-input bg-white p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">
                    Informations du compte Unibank
                  </h4>
                  <p>
                    <strong>Nom :</strong> AEE
                  </p>
                  <p>
                    <strong>Banque :</strong> Unibank
                  </p>
                  <p>
                    <strong>Dollars :</strong> 270-1022-1147584
                  </p>
                  <p>
                    <strong>Gdes :</strong> 270-1021-1084861
                  </p>
                </div>

                {/* Point de Collecte */}
                <div className="border border-input bg-white p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">Point de Collecte</h4>
                  <p>
                    Vous pouvez déposer votre matériel au point de collecte situé à :
                  </p>
                  <p>
                    <strong>Adresse :</strong> 123 Rue Exemple, Ville, Pays
                  </p>
                  <p>
                    <strong>Horaires :</strong> Lundi - Vendredi, 9h - 17h
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right side - Image */}
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/signup.jpg)' }}
      ></div>
    </div>
  );
};

export default Donation;
