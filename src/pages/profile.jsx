// src/components/ProfileForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import supabase from '../services/supabase';
import {
  User,
  Phone,
  Book,
  Church,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Trash2,
} from 'lucide-react';

const ProfileForm = () => {
  const initialState = {
    nom: '',
    prenom: '',
    username: '',
    status: '',
    telephone: '',
    email: '',
    country: '',
    state: '',
    nationality: '',
    birth_date: '',
    phone_number: '',
    gender: '',
    children_number: '',
    educate_level: '',
    studies: '',
    skills: '',
    church_name: '',
    church_address: '',
    church_website: '',
    pastor_name: '',
    pastor_email: '',
    old_formation: [], // Array of formations
  };

  const [formData, setFormData] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Indique si l'utilisateur est en mode édition
  const userIdRef = useRef(null); // Référence pour stocker l'ID utilisateur

  const steps = [
    { id: 1, label: 'Informations de Base', icon: User },
    { id: 2, label: 'Contact & Adresse', icon: Phone },
    { id: 3, label: 'Détails Éducatifs', icon: Book },
    { id: 4, label: 'Église & Formations', icon: Church },
  ];

  // Références pour gérer le focus des champs
  const formRefs = useRef([]);

  // Fonction pour ajouter des références dynamiques
  const addToRefs = (el) => {
    if (el && !formRefs.current.includes(el)) {
      formRefs.current.push(el);
    }
  };

  // Effet pour vérifier si un utilisateur existe et charger ses données
  useEffect(() => {
    const checkUser = async () => {
      const token = supabase.auth.session()?.access_token; // Récupérer le token d'authentification
      if (token) {
        // Décoder le token pour obtenir l'ID utilisateur (selon votre implémentation)
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .single();

        if (userData) {
          setFormData({
            nom: userData.nom || '',
            prenom: userData.prenom || '',
            username: userData.username || '',
            status: userData.status || '',
            telephone: userData.telephone || '',
            email: userData.email || '',
            country: userData.country || '',
            state: userData.state || '',
            nationality: userData.nationality || '',
            birth_date: userData.birth_date
              ? new Date(userData.birth_date).toISOString().substr(0, 10)
              : '',
            phone_number: userData.phone_number || '',
            gender: userData.gender || '',
            children_number: userData.children_number || '',
            educate_level: userData.educate_level || '',
            studies: userData.studies || '',
            skills: userData.skills || '',
            church_name: userData.church_name || '',
            church_address: userData.church_address || '',
            church_website: userData.church_website || '',
            pastor_name: userData.pastor_name || '',
            pastor_email: userData.pastor_email || '',
            old_formation: userData.old_formation || [],
          });
          userIdRef.current = userData.id; // Stocker l'ID utilisateur
          setIsEditing(true);
        }
      }
    };

    checkUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormations = formData.old_formation.map((formation, i) => {
      if (i === index) {
        return { ...formation, [name]: value };
      }
      return formation;
    });

    setFormData((prevData) => ({
      ...prevData,
      old_formation: updatedFormations,
    }));
  };

  const addFormation = () => {
    setFormData((prevData) => ({
      ...prevData,
      old_formation: [
        ...prevData.old_formation,
        {
          formation_levels: '',
          formation_dates: '',
          formation_locations: '',
          formation_mentions: '',
          formation_completion_dates: '',
          formation_certificates: '',
          formation_trainers: '',
        },
      ],
    }));
  };

  const removeFormation = (index) => {
    const updatedFormations = formData.old_formation.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      old_formation: updatedFormations,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    // Déplacer le focus vers le premier champ du prochain step
    setTimeout(() => {
      if (formRefs.current[currentStep]) {
        formRefs.current[currentStep].focus();
      }
    }, 100);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    // Déplacer le focus vers le premier champ du step précédent
    setTimeout(() => {
      if (formRefs.current[currentStep - 2]) {
        formRefs.current[currentStep - 2].focus();
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    // Validation de base
    if (!formData.nom || !formData.prenom || !formData.username || !formData.email) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }

    // Convertir old_formation en JSONB
    let oldFormationParsed = formData.old_formation.map((formation) => ({
      formation_levels: formation.formation_levels,
      formation_dates: formation.formation_dates,
      formation_locations: formation.formation_locations,
      formation_mentions: formation.formation_mentions,
      formation_completion_dates: formation.formation_completion_dates,
      formation_certificates: formation.formation_certificates,
      formation_trainers: formation.formation_trainers,
    }));

    if (isEditing && userIdRef.current) {
      // Mettre à jour les données existantes
      const { data, error } = await supabase
        .from('users')
        .update({
          nom: formData.nom,
          prenom: formData.prenom,
          username: formData.username,
          status: parseInt(formData.status, 10),
          telephone: formData.telephone,
          email: formData.email,
          country: formData.country,
          state: formData.state,
          nationality: formData.nationality,
          birth_date: formData.birth_date ? new Date(formData.birth_date) : null,
          phone_number: formData.phone_number,
          gender: formData.gender,
          children_number: formData.children_number ? parseInt(formData.children_number, 10) : null,
          educate_level: formData.educate_level,
          studies: formData.studies,
          skills: formData.skills,
          church_name: formData.church_name,
          church_address: formData.church_address,
          church_website: formData.church_website,
          pastor_name: formData.pastor_name,
          pastor_email: formData.pastor_email,
          old_formation: oldFormationParsed,
        })
        .eq('id', userIdRef.current);

      if (error) {
        setMessage(`Erreur: ${error.message}`);
      } else {
        setMessage('Profil mis à jour avec succès !');
      }
    } else {
      // Insérer les données dans la table 'users'
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            nom: formData.nom,
            prenom: formData.prenom,
            username: formData.username,
            status: parseInt(formData.status, 10),
            telephone: formData.telephone,
            email: formData.email,
            country: formData.country,
            state: formData.state,
            nationality: formData.nationality,
            birth_date: formData.birth_date ? new Date(formData.birth_date) : null,
            phone_number: formData.phone_number,
            gender: formData.gender,
            children_number: formData.children_number ? parseInt(formData.children_number, 10) : null,
            educate_level: formData.educate_level,
            studies: formData.studies,
            skills: formData.skills,
            church_name: formData.church_name,
            church_address: formData.church_address,
            church_website: formData.church_website,
            pastor_name: formData.pastor_name,
            pastor_email: formData.pastor_email,
            old_formation: oldFormationParsed,
          },
        ]);

      if (error) {
        setMessage(`Erreur: ${error.message}`);
      } else {
        setMessage('Profil complété avec succès !');
        setFormData(initialState);
        setCurrentStep(1);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md mt-10 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? 'Modifier votre Profil' : 'Compléter votre Profil'}
      </h2>
      {message && <p className="text-center mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-indigo-500 h-2.5 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-6 space-x-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-indigo-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className="mt-2 text-sm text-center">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Informations de Base */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="nom">
                Nom *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                ref={addToRefs}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="prenom">
                Prénom *
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                Statut *
              </label>
              <input
                type="number"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Suivant
                <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact et Adresse */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="telephone">
                Téléphone *
              </label>
              <input
                type="text"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                ref={addToRefs}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="country">
                Pays *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="state">
                État/Province *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <ArrowLeft className="mr-2" />
                Précédent
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Suivant
                <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Détails Éducatifs */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="nationality">
                Nationalité
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                ref={addToRefs}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="birth_date">
                Date de Naissance
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="phone_number">
                Numéro de Téléphone *
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
                Genre
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="children_number">
                Nombre d'Enfants
              </label>
              <input
                type="number"
                id="children_number"
                name="children_number"
                value={formData.children_number}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <ArrowLeft className="mr-2" />
                Précédent
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Suivant
                <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Informations sur l'Église et Anciennes Formations */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Informations sur l'Église */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="educate_level">
                Niveau d'Éducation
              </label>
              <input
                type="text"
                id="educate_level"
                name="educate_level"
                value={formData.educate_level}
                onChange={handleChange}
                ref={addToRefs}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="studies">
                Études
              </label>
              <input
                type="text"
                id="studies"
                name="studies"
                value={formData.studies}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="skills">
                Compétences
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="church_name">
                Nom de l'Église
              </label>
              <input
                type="text"
                id="church_name"
                name="church_name"
                value={formData.church_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="church_address">
                Adresse de l'Église
              </label>
              <input
                type="text"
                id="church_address"
                name="church_address"
                value={formData.church_address}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="church_website">
                Site Web de l'Église
              </label>
              <input
                type="url"
                id="church_website"
                name="church_website"
                value={formData.church_website}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="pastor_name">
                Nom du Pasteur
              </label>
              <input
                type="text"
                id="pastor_name"
                name="pastor_name"
                value={formData.pastor_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="pastor_email">
                Email du Pasteur
              </label>
              <input
                type="email"
                id="pastor_email"
                name="pastor_email"
                value={formData.pastor_email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Anciennes Formations */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Anciennes Formations</h3>
              {formData.old_formation.map((formation, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-medium">Formation {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeFormation(index)}
                      className="flex items-center text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <Trash2 className="mr-1" />
                      Supprimer
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor={`formation-level-${index}`}>
                      Niveau de formation dans l'organisation
                    </label>
                    <select
                      id={`formation-level-${index}`}
                      name="formation_levels"
                      value={formation.formation_levels}
                      onChange={(e) => handleFormationChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="eee1_katak1">EEE1 (KATAK1)</option>
                      <option value="eee2_katak2">EEE2 (KATAK2)</option>
                      <option value="iot1">IOT 1</option>
                      <option value="iot2">IOT 2</option>
                      <option value="tce1">TCE 1</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700" htmlFor={`formation-date-${index}`}>
                        Date
                      </label>
                      <input
                        type="date"
                        id={`formation-date-${index}`}
                        name="formation_dates"
                        value={formation.formation_dates}
                        onChange={(e) => handleFormationChange(index, e)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700" htmlFor={`formation-location-${index}`}>
                        Location
                      </label>
                      <input
                        type="text"
                        id={`formation-location-${index}`}
                        name="formation_locations"
                        value={formation.formation_locations}
                        onChange={(e) => handleFormationChange(index, e)}
                        placeholder="Location"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`formation-mention-${index}`}>
                      Mention
                    </label>
                    <select
                      id={`formation-mention-${index}`}
                      name="formation_mentions"
                      value={formation.formation_mentions}
                      onChange={(e) => handleFormationChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>

                  <div className="space-y-2 mt-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={`formation-completion-date-${index}`}
                    >
                      Completion Date
                    </label>
                    <input
                      type="date"
                      id={`formation-completion-date-${index}`}
                      name="formation_completion_dates"
                      value={formation.formation_completion_dates}
                      onChange={(e) => handleFormationChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2 mt-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={`formation-certificate-${index}`}
                    >
                      Obtained Certificate
                    </label>
                    <select
                      id={`formation-certificate-${index}`}
                      name="formation_certificates"
                      value={formation.formation_certificates}
                      onChange={(e) => handleFormationChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="True">Yes</option>
                      <option value="False">No</option>
                    </select>
                  </div>

                  <div className="space-y-2 mt-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={`formation-trainer-${index}`}
                    >
                      Trainer's Name/Code
                    </label>
                    <input
                      type="text"
                      id={`formation-trainer-${index}`}
                      name="formation_trainers"
                      value={formation.formation_trainers}
                      onChange={(e) => handleFormationChange(index, e)}
                      placeholder="Trainer's Name/Code"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFormation}
                className="flex items-center mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <PlusCircle className="mr-2" />
                Ajouter une Formation
              </button>
            </div>

            {/* Boutons de Navigation */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <ArrowLeft className="mr-2" />
                Précédent
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {loading ? 'Soumission en cours...' : 'Soumettre'}
              </button>
            </div>
          </div>
        )}

        {/* Afficher le message de succès ou d'erreur */}
      </form>
    </div>
  );
};

export default ProfileForm;
