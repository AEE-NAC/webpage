import React, { useState } from 'react';

const PopupCFA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdCard, setShowAdCard] = useState(true);
  const [surveyStep, setSurveyStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    hasParticipated: '',
    hasCreatedClub: '',
    region: '',
    email: '',
    additionalInfo: '',
  });

  const openPopup = () => {
    setIsOpen(true);
    setShowAdCard(false);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSurveyStep(1);
    setFormData({
      name: '',
      hasParticipated: '',
      hasCreatedClub: '',
      region: '',
      email: '',
      additionalInfo: '',
    });
  };

  const handleNext = () => {
    setSurveyStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setSurveyStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire ici
    console.log(formData);
    setSurveyStep((prev) => prev + 1);
  };

  return (
    <>
      {/* Carte publicitaire pour le CFA */}
      {showAdCard && (
        <div
          className="fixed columns bottom-4 right-4 bg-white bg-opacity-80 shadow-2xl rounded-lg p-6 flex items-center space-x-4 z-50 max-w-sm border border-gray-200"
        >
          {/* Bouton de fermeture de la carte */}
          <button
            onClick={() => setShowAdCard(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            aria-label="Fermer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo ou image du CFA */}
          <img
            src="/cfa.png" // Assurez-vous que l'image du CFA est disponible à cet emplacement
            alt="CFA"
            className="w-24 h-24 object-contain"
          />

          {/* Texte et bouton */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Découvrez notre événement CFA en décembre !</h3>
            <p className="text-sm text-gray-600 mb-4">Rejoignez-nous pour une expérience inoubliable.</p>
            <button
              onClick={openPopup}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              En savoir plus
            </button>
          </div>
        </div>
      )}

      {/* Popup avec le mini sondage */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6 lg:px-8"
          role="dialog"
          aria-modal="true"
        >
          {/* Contenu du Popup */}
          <div className="bg-white bg-opacity-90 rounded-lg shadow-lg max-w-md p-6 relative overflow-y-auto max-h-full border border-gray-200">
            {/* Bouton de fermeture */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label="Fermer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Étapes du mini sondage */}
            {surveyStep === 1 && (
              <div className="text-center">
                {/* Image ou logo du CFA */}
                <img
                  src="/cfa.png"
                  alt="CFA"
                  className="mx-auto mb-4 w-32 h-32 sm:w-36 sm:h-36 object-contain"
                />

                {/* Texte de l'événement */}
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Participez à notre événement CFA en décembre !</h2>
                <p className="mb-6 text-base sm:text-lg text-gray-600">Répondez à quelques questions pour vous inscrire.</p>

                {/* Bouton Commencer */}
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Commencer
                </button>
              </div>
            )}

            {surveyStep === 2 && (
              <form>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Avez-vous déjà participé à un événement CFA ?</h3>

                <div className="mb-6">
                  <label className="inline-flex items-center text-base sm:text-lg text-gray-700">
                    <input
                      type="radio"
                      name="hasParticipated"
                      value="Oui"
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center ml-6 text-base sm:text-lg text-gray-700">
                    <input
                      type="radio"
                      name="hasParticipated"
                      value="Non"
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>

                {/* Boutons de navigation */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.hasParticipated}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            )}

            {surveyStep === 3 && (
              <form>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Avez-vous déjà créé un club CFA dans votre région ?</h3>

                <div className="mb-6">
                  <label className="inline-flex items-center text-base sm:text-lg text-gray-700">
                    <input
                      type="radio"
                      name="hasCreatedClub"
                      value="Oui"
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center ml-6 text-base sm:text-lg text-gray-700">
                    <input
                      type="radio"
                      name="hasCreatedClub"
                      value="Non"
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>

                {/* Boutons de navigation */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.hasCreatedClub}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            )}

            {surveyStep === 4 && (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Vos informations</h3>

                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 text-base sm:text-lg text-gray-700">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-base sm:text-lg text-gray-700">
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="region" className="block mb-2 text-base sm:text-lg text-gray-700">
                    Région
                  </label>
                  <input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="additionalInfo" className="block mb-2 text-base sm:text-lg text-gray-700">
                    Informations supplémentaires
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  ></textarea>
                </div>

                {/* Boutons de navigation */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Soumettre
                  </button>
                </div>
              </form>
            )}

            {surveyStep === 5 && (
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Merci pour votre participation !</h3>
                <p className="mb-6 text-base sm:text-lg text-gray-600">Nous vous contacterons prochainement avec plus d'informations.</p>
                <button
                  onClick={closePopup}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupCFA;
