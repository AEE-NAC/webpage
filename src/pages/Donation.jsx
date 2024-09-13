import React, { useState } from 'react';

const ministries = [
  { id: 1, name: 'Ministry of Health' },
  { id: 2, name: 'Ministry of Education' },
  // Add more ministries as needed
];

const Donation = () => {
  const [donationType, setDonationType] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [amount, setAmount] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [materialDetails, setMaterialDetails] = useState('');
  const [donations, setDonations] = useState([]);

  const handleAddDonation = () => {
    if (!donationType || !selectedMinistry || (donationType === 'monetary' && !amount) || (donationType === 'material' && (!materialName || !materialDetails))) {
      alert('Please fill in all required fields.');
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

  const handleEditDonation = (id, field, value) => {
    const updatedDonations = donations.map(donation => 
      donation.id === id ? { ...donation, [field]: value } : donation
    );
    setDonations(updatedDonations);
  };

  const handleCheckout = () => {
    // Implement payment method logic here
    alert('Proceed to payment');
  };

  const handleNext = () => {
    // Implement QR code generation logic here
    alert('QR code generated for collection point');
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto p-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Faire un don</h3>
        <p className="text-sm text-muted-foreground">
          Votre don aidera à soutenir les programmes de notre organisation à but non lucratif.
        </p>
      </div>
      <div className="p-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${donationType === 'monetary' ? 'bg-primary text-primary-foreground' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => setDonationType('monetary')}
            >
              Argent
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${donationType === 'material' ? 'bg-primary text-primary-foreground' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => setDonationType('material')}
            >
              Matériel
            </button>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="ministry">
                  Ministère bénéficiaire
                </label>
                <select
                  id="ministry"
                  value={selectedMinistry}
                  onChange={(e) => setSelectedMinistry(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Ministry</option>
                  {ministries.map((ministry) => (
                    <option key={ministry.id} value={ministry.name}>
                      {ministry.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {donationType === 'monetary' && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}
            {donationType === 'material' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="materialName">
                    Material Name
                  </label>
                  <input
                    id="materialName"
                    type="text"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="materialDetails">
                    Material Details
                  </label>
                  <input
                    id="materialDetails"
                    type="text"
                    value={materialDetails}
                    onChange={(e) => setMaterialDetails(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleAddDonation}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Ajouter un don
              </button>
              {donationType === 'monetary' && donations.length > 0 && (
                <button
                  onClick={handleCheckout}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Passer à la caisse
                </button>
              )}
              {donationType === 'material' && donations.length > 0 && (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
        <div className="flex space-x-4">
          {donations.map((donation) => (
            <div key={donation.id} className="border border-input bg-background p-4 rounded-md min-w-[300px]">
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium leading-none">Type de don</label>
                  <input
                    type="text"
                    value={donation.type}
                    onChange={(e) => handleEditDonation(donation.id, 'type', e.target.value)}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none">Ministère bénéficiaire</label>
                  <input
                    type="text"
                    value={donation.ministry}
                    onChange={(e) => handleEditDonation(donation.id, 'ministry', e.target.value)}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                {donation.type === 'monetary' && (
                  <div>
                    <label className="text-sm font-medium leading-none">Amount</label>
                    <input
                      type="number"
                      value={donation.amount}
                      onChange={(e) => handleEditDonation(donation.id, 'amount', e.target.value)}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                )}
                {donation.type === 'material' && (
                  <>
                    <div>
                      <label className="text-sm font-medium leading-none">Material Name</label>
                      <input
                        type="text"
                        value={donation.materialName}
                        onChange={(e) => handleEditDonation(donation.id, 'materialName', e.target.value)}
                        className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none">Material Details</label>
                      <input
                        type="text"
                        value={donation.materialDetails}
                        onChange={(e) => handleEditDonation(donation.id, 'materialDetails', e.target.value)}
                        className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/signup.jpg)' }}
      ></div>
    </div>
  );
};

export default Donation;