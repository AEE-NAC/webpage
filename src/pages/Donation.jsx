import React, { useState } from 'react';

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
  const [materialName, setMaterialName] = useState('');
  const [materialDetails, setMaterialDetails] = useState('');
  const [donations, setDonations] = useState([]);

  // États pour gérer l'affichage des informations
  const [proceeded, setProceeded] = useState(false);
  const [showWhereInfo, setShowWhereInfo] = useState(false);

  const handleAddDonation = () => {
    if (
      !donationType ||
      !selectedMinistry ||
      (donationType === 'monetary' && !amount) ||
      (donationType === 'material' && (!materialName || !materialDetails))
    ) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const newDonation = {
      id: donations.length + 1,
      type: donationType,
      ministry: selectedMinistry,
      amount: donationType === 'monetary' ? amount : null,
      materialName: donationType === 'material' ? materialName : null,
      materialDetails: donationType === 'material' ? materialDetails : null,
    };
    setDonations([...donations, newDonation]);
    setAmount('');
    setMaterialName('');
    setMaterialDetails('');
  };

  const handleProceed = () => {
    setProceeded(true);
    setShowWhereInfo(false);
  };

  const handleWhere = () => {
    setShowWhereInfo(true);
  };

  const handleEditDonation = (id, field, value) => {
    const updatedDonations = donations.map((donation) =>
      donation.id === id ? { ...donation, [field]: value } : donation
    );
    setDonations(updatedDonations);
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form or Info Container */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <a href="../"><img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" /></a>
        </div>

        {!proceeded ? (
          // Formulaire de Don
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                Faire un don
              </h3>
              <p className="text-sm text-muted-foreground">
                Votre don aidera à soutenir les programmes de notre organisation à but non lucratif.
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 ${
                      donationType === 'monetary'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setDonationType('monetary')}
                  >
                    Argent
                  </button>
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 ${
                      donationType === 'material'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setDonationType('material')}
                  >
                    Matériel
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
                    <div className="space-y-2">
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
                  )}
                  {donationType === 'material' && (
                    <>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="materialName"
                        >
                          Nom du matériel
                        </label>
                        <input
                          id="materialName"
                          type="text"
                          value={materialName}
                          onChange={(e) => setMaterialName(e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="materialDetails"
                        >
                          Détails du matériel
                        </label>
                        <input
                          id="materialDetails"
                          type="text"
                          value={materialDetails}
                          onChange={(e) => setMaterialDetails(e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={handleAddDonation}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      Ajouter un don
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Affichage de la liste des donations */}
            {donations.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-center space-x-4">
                  {donations.some((donation) => donation.type === 'monetary') && (
                    <button
                      onClick={handleProceed}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Proceed
                    </button>
                  )}
                  {donations.some((donation) => donation.type === 'material') && (
                    <button
                      onClick={handleWhere}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Where
                    </button>
                  )}
                </div>
                {showWhereInfo && (
                  <div className="mt-4 border border-input bg-white p-4 rounded-md">
                    <h4 className="text-lg font-semibold mb-2">Point de Collecte</h4>
                    <p>Vous pouvez déposer votre matériel au point de collecte situé à :</p>
                    <p>
                      <strong>Adresse :</strong> 123 Rue Exemple, Ville, Pays
                    </p>
                    <p>
                      <strong>Horaires :</strong> Lundi - Vendredi, 9h - 17h
                    </p>
                  </div>
                )}
                <div className="mt-4 border border-input bg-white p-4 rounded-md h-64 overflow-y-auto">
                  <h4 className="text-lg font-semibold mb-2">Vos Dons</h4>
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="border border-input bg-background p-4 rounded-md"
                      >
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium leading-none">
                              Type de don
                            </label>
                            <input
                              type="text"
                              value={donation.type}
                              onChange={(e) =>
                                handleEditDonation(donation.id, 'type', e.target.value)
                              }
                              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium leading-none">
                              Ministère bénéficiaire
                            </label>
                            <input
                              type="text"
                              value={donation.ministry}
                              onChange={(e) =>
                                handleEditDonation(donation.id, 'ministry', e.target.value)
                              }
                              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                          </div>
                          {donation.type === 'monetary' && (
                            <div>
                              <label className="text-sm font-medium leading-none">
                                Montant
                              </label>
                              <input
                                type="number"
                                value={donation.amount}
                                onChange={(e) =>
                                  handleEditDonation(donation.id, 'amount', e.target.value)
                                }
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                            </div>
                          )}
                          {donation.type === 'material' && (
                            <>
                              <div>
                                <label className="text-sm font-medium leading-none">
                                  Nom du matériel
                                </label>
                                <input
                                  type="text"
                                  value={donation.materialName}
                                  onChange={(e) =>
                                    handleEditDonation(
                                      donation.id,
                                      'materialName',
                                      e.target.value
                                    )
                                  }
                                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium leading-none">
                                  Détails du matériel
                                </label>
                                <input
                                  type="text"
                                  value={donation.materialDetails}
                                  onChange={(e) =>
                                    handleEditDonation(
                                      donation.id,
                                      'materialDetails',
                                      e.target.value
                                    )
                                  }
                                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Conteneur d'Informations après Proceed
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto p-6">
            <div className="flex flex-col space-y-4">
              {/* Informations Bancaires */}
              <div className="border border-input bg-white p-4 rounded-md">
                <h4 className="text-lg font-semibold mb-2">Informations du compte Unibank</h4>
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

              {/* Bouton Where */}
              {donations.some((donation) => donation.type === 'material') && (
                <div>
                  <button
                    onClick={handleWhere}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Where
                  </button>
                </div>
              )}

              {/* Point de Collecte */}
              {showWhereInfo && (
                <div className="border border-input bg-white p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">Point de Collecte</h4>
                  <p>Vous pouvez déposer votre matériel au point de collecte situé à :</p>
                  <p>
                    <strong>Adresse :</strong> 123 Rue Exemple, Ville, Pays
                  </p>
                  <p>
                    <strong>Horaires :</strong> Lundi - Vendredi, 9h - 17h
                  </p>
                </div>
              )}

              {/* Liste des Dons */}
              <div className="border border-input bg-white p-4 rounded-md h-64 overflow-y-auto">
                <h4 className="text-lg font-semibold mb-2">Vos Dons</h4>
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-input bg-background p-4 rounded-md"
                    >
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium leading-none">
                            Type de don
                          </label>
                          <input
                            type="text"
                            value={donation.type}
                            onChange={(e) =>
                              handleEditDonation(donation.id, 'type', e.target.value)
                            }
                            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium leading-none">
                            Ministère bénéficiaire
                          </label>
                          <input
                            type="text"
                            value={donation.ministry}
                            onChange={(e) =>
                              handleEditDonation(donation.id, 'ministry', e.target.value)
                            }
                            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                        </div>
                        {donation.type === 'monetary' && (
                          <div>
                            <label className="text-sm font-medium leading-none">
                              Montant
                            </label>
                            <input
                              type="number"
                              value={donation.amount}
                              onChange={(e) =>
                                handleEditDonation(donation.id, 'amount', e.target.value)
                              }
                              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                          </div>
                        )}
                        {donation.type === 'material' && (
                          <>
                            <div>
                              <label className="text-sm font-medium leading-none">
                                Nom du matériel
                              </label>
                              <input
                                type="text"
                                value={donation.materialName}
                                onChange={(e) =>
                                  handleEditDonation(
                                    donation.id,
                                    'materialName',
                                    e.target.value
                                  )
                                }
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium leading-none">
                                Détails du matériel
                              </label>
                              <input
                                type="text"
                                value={donation.materialDetails}
                                onChange={(e) =>
                                  handleEditDonation(
                                    donation.id,
                                    'materialDetails',
                                    e.target.value
                                  )
                                }
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
