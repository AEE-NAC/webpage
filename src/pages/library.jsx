import React, { useState, useEffect, useRef, useContext } from 'react';
import { MultiStepForm } from '../components/specific/multistep';
import supabase from '../services/supabase';
import { Book, BookOpen, MapPin } from 'react-feather';
import { LanguageContext } from '../context/Languagecontext';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
//import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImagePreview);

const config_fr = {
  steps: [
    {
      title: 'Informations de Base',
      subtitle: 'Renseignez les informations de base du livre',
      fields: [
        { key: 'titre', type: 'text', label: 'Titre', required: true },
        { key: 'auteur', type: 'text', label: 'Auteur', required: true },
        { key: 'theme', type: 'text', label: 'Thème', required: true },
        { key: 'ISBN', type: 'text', label: 'ISBN', required: true },
        { key: 'image_couverture', type: 'filepond', label: 'Image de couverture', accept: 'image/*' },
        { key: 'page', type: 'number', label: 'Nombre de pages', required: true, min: 0 },
        { key: 'quantite_totale', type: 'number', label: 'Quantité totale', required: true, min: 0 },
        { key: 'annee_publication', type: 'number', label: 'Année de publication', required: true, min: 0 },
        { key: 'format_livre', type: 'select', label: 'Format du livre', required: true, options: [] }, // Les options seront dynamiquement remplies
        { key: 'editeur', type: 'text', label: 'Éditeur', required: true },
        { key: 'langue', type: 'text', label: 'Langue', required: true },
        { key: 'disponibilite', type: 'select', label: 'Disponibilité', required: true, options: [] }, // Les options seront dynamiquement remplies
      ],
    },
    {
      title: 'Description et Mots-clés',
      subtitle: 'Ajoutez une description et des mots-clés pour le livre',
      fields: [
        { key: 'description', type: 'textarea', label: 'Description', required: true, rows: 3 },
        { key: 'mots_cles', type: 'textarea', label: 'Mots-clés', rows: 3 },
      ],
    },
    {
      title: 'Localisation et Clubs',
      subtitle: 'Renseignez la localisation et les clubs associés',
      fields: [
        { key: 'pays', type: 'select', label: 'Pays', options: [] }, // Les options seront dynamiquement remplies
        { key: 'villes', type: 'select', label: 'Villes', options: [] }, // Les options seront dynamiquement remplies
        { key: 'clubs', type: 'text', label: 'Clubs' },
      ],
    },
  ],
  icons: [Book, BookOpen, MapPin], // Icônes pour chaque étape
};

const handleSubmit = async (formData) => {
  console.log(formData);
  
  const { data, error } = await supabase.from('livre').insert([formData]);
  if (error) {
    console.error(error);
  }
};

const Library = () => {
  const { currentLang } = useContext(LanguageContext);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log('Language changed to:', currentLang);
    // Perform any action needed when the language change
  }, [currentLang]);

  return (
    <div>
      <h1>Library</h1>
      <MultiStepForm config={config_fr} onSubmit={handleSubmit} language={currentLang} />
      <FilePond
        files={files}
        allowMultiple={true}
        onupdatefiles={setFiles}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
};

export default Library;