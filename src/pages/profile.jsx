// src/components/ProfileForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import supabase from '../services/supabase';
import MultiStepForm from '../components/specific/multistep';
import { User, Phone, Book, Church } from 'lucide-react'; //

const config = {
  steps: [
    {
      title: 'Informations de Base',
      subtitle: 'Renseignez vos informations de base',
      fields: [
        { key: 'nom', type: 'text', label: 'Nom', required: true },
        { key: 'prenom', type: 'text', label: 'Prénom', required: true },
        { key: 'username', type: 'text', label: 'Nom d\'utilisateur', required: true },
        { key: 'status', type: 'number', label: 'Statut', required: true },
      ],
    },
    {
      title: 'Contact et Adresse',
      subtitle: 'Renseignez vos informations de contact',
      fields: [
        { key: 'telephone', type: 'text', label: 'Téléphone', required: true },
        { key: 'email', type: 'email', label: 'Email', required: true },
        { key: 'country', type: 'text', label: 'Pays', required: true },
        { key: 'state', type: 'text', label: 'État/Province', required: true },
      ],
    },
    {
      title: 'Détails Éducatifs',
      subtitle: 'Renseignez vos informations éducatives',
      fields: [
        { key: 'nationality', type: 'text', label: 'Nationalité' },
        { key: 'birth_date', type: 'date', label: 'Date de Naissance' },
        { key: 'phone_number', type: 'text', label: 'Numéro de Téléphone', required: true },
        {
          key: 'gender',
          type: 'select',
          label: 'Genre',
          options: [
            { value: '', label: 'Sélectionner' },
            { value: 'M', label: 'Masculin' },
            { value: 'F', label: 'Féminin' },
            { value: 'Autre', label: 'Autre' },
          ],
        },
        { key: 'children_number', type: 'number', label: 'Nombre d\'Enfants' },
      ],
    },
    {
      title: 'Informations sur l\'Église',
      subtitle: 'Renseignez vos informations sur l\'église',
      fields: [
        { key: 'church_name', type: 'text', label: 'Nom de l\'Église' },
        { key: 'church_address', type: 'text', label: 'Adresse de l\'Église' },
        { key: 'church_website', type: 'url', label: 'Site Web de l\'Église' },
        { key: 'pastor_name', type: 'text', label: 'Nom du Pasteur' },
        { key: 'pastor_email', type: 'email', label: 'Email du Pasteur' },
      ],
    },
    {
      title: 'Anciennes Formations',
      subtitle: 'Renseignez vos anciennes formations',
      fields: [
        {
          key: 'old_formation',
          type: 'formation',
          label: 'Anciennes Formations',
          multiple: true,
          addMoreText: 'Ajouter une formation',
          previewFields: [
            {
              key: 'formation_levels',
              label: 'Formation reçue',
            }
            ,
            {
              key: 'formation_dates',
              label: 'Date',
            },
          ],
          previewTitle: "Mes Formations",
          fields: [
            {
              key: 'formation_levels',
              type: 'select',
              label: 'Niveau de formation dans l\'organisation',
              options: [
                { value: '', label: 'Sélectionner' },
                { value: 'eee1_katak1', label: 'EEE1 (KATAK1)' },
                { value: 'eee2_katak2', label: 'EEE2 (KATAK2)' },
                { value: 'iot1', label: 'IOT 1' },
                { value: 'iot2', label: 'IOT 2' },
                { value: 'tce1', label: 'TCE 1' },
              ],
            },
            { key: 'formation_dates', type: 'date', label: 'Date' },
            { key: 'formation_locations', type: 'text', label: 'Location' },
            {
              key: 'formation_mentions',
              type: 'select',
              label: 'Mention',
              options: [
                { value: '', label: 'Sélectionner' },
                { value: 'Very Good', label: 'Very Good' },
                { value: 'Good', label: 'Good' },
                { value: 'Excellent', label: 'Excellent' },
              ],
            },
            { key: 'formation_completion_dates', type: 'date', label: 'Completion Date' },
            {
              key: 'formation_certificates',
              type: 'select',
              label: 'Obtained Certificate',
              options: [
                { value: '', label: 'Sélectionner' },
                { value: 'True', label: 'Yes' },
                { value: 'False', label: 'No' },
              ],
            },
            { key: 'formation_trainers', type: 'text', label: 'Trainer\'s Name/Code' },
          ],
        },
      ],
    },
  ],
  icons: [User, Phone, Book, Church, Book], // Icônes pour chaque étape
};
const apiClient = {
  save: async (data) => {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Data saved:', data);
        resolve({ success: true });
      }, 100);
    });
  },
};

const handleSubmit = async (formData) => {
  //e.preventDefault();
  /*try {
    const { data, error } = await supabase
      .from('votre_table')
      .insert([formData]);

    if (error) {
      throw error;
    }

    console.log('Données insérées avec succès:', data);
    onSubmit?.(formData); // Appel de la fonction de rappel si elle existe
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
    alert('Une erreur est survenue lors de la sauvegarde');
  }*/
 console.log(formData);
};

const ProfileForm = () => {
  return <MultiStepForm config={config} onSubmit={handleSubmit} />
};

export default ProfileForm;
