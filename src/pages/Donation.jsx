import React, { useState } from 'react';

const ministries = [
  { id: 3, name: 'MBE (Ministère Biblique dans les Ecoles)' },
  { id: 4, name: 'CBN/KBN (Club de la Bonne Nouvelle/Klèb Bòn Nouvèl)' },
  { id: 5, name: 'Clubs Spéciaux : CFA (Club de Fin d Année)' },
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
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="h-screen flex justify-center p-4">
      <div className="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center rounded-3xl overflow-hidden">
          <div className="relative w-full h-full">
            <img 
              src="/CP_pichon.jpeg"
              alt="Donation illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full h-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <a href='../'><img 
                src="images/aee.jpg"
                alt="Logo"
                width={100}
                height={60}
              /></a>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Faire un don
              </h1>
              <p className="text-gray-600">
                Votre don aidera à soutenir les programmes de notre organisation à but non lucratif.
              </p>
            </div>

            <div className="max-w-md mx-auto w-full">
              {!showInfo ? (
                <div>
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Type de don</label>
                    <div className="flex gap-2">
                      {['monetary', 'material', 'service'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setDonationType(type)}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                            donationType === type
                              ? 'bg-[#981a3c] text-white'
                              : 'bg-gray-50 border border-gray-300 text-gray-900'
                          }`}
                        >
                          {type === 'monetary' ? 'Argent' : type === 'material' ? 'Matériel' : 'Service'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <select
                        value={selectedMinistry}
                        onChange={(e) => setSelectedMinistry(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
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
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Montant"
                            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                          />
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-28 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="HTG">HTG</option>
                          </select>
                        </div>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        >
                          <option value="">Méthode de paiement</option>
                          <option value="CreditCard">Carte de crédit</option>
                          <option value="BankTransfer">Virement bancaire</option>
                          <option value="Paypal">PayPal</option>
                        </select>
                      </>
                    )}

                    {donationType === 'material' && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={materialInput}
                            onChange={(e) => setMaterialInput(e.target.value)}
                            placeholder="Description du matériel"
                            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                          />
                          <button
                            onClick={handleAddMaterial}
                            className="px-4 py-2 bg-[#981a3c] text-white rounded-lg text-sm font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                        {materials.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {materials.map((material, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                              >
                                {material}
                                <button
                                  onClick={() => handleRemoveMaterial(index)}
                                  className="ml-2 text-gray-500 hover:text-gray-700"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {donationType === 'service' && (
                      <textarea
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        placeholder="Description du service"
                        rows="4"
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                      />
                    )}

                    <button
                      onClick={() => setShowInfo(true)}
                      className="w-full bg-[#981a3c] text-white py-3 rounded-lg font-medium hover:bg-[#981a3c] transition-colors"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={() => setShowInfo(false)}
                    className="text-[#981a3c] font-medium flex items-center gap-2 mb-4"
                  >
                    ← Retour
                  </button>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">Informations bancaires</h3>
                    <div className="space-y-2">
                      <p><strong>Nom :</strong> AEE</p>
                      <p><strong>Banque :</strong> Unibank</p>
                      <p><strong>Compte USD :</strong> 270-1022-1147584</p>
                      <p><strong>Compte HTG :</strong> 270-1021-1084861</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">Point de collecte</h3>
                    <div className="space-y-2">
                      <p><strong>Adresse :</strong> 123 Rue Exemple, Ville</p>
                      <p><strong>Horaires :</strong> Lundi - Vendredi, 9h - 17h</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
