// src/components/ProfileForm.jsx
import React, { useState, useEffect, useRef ,useContext } from 'react';
import supabase from '../services/supabase';
import {MultiStepForm} from '../components/specific/multistep';
import { User, Phone, Book, Church } from 'lucide-react'; //
import { LanguageContext } from '../context/Languagecontext';
const config_fr = {
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
const config_es = {
  steps: [
    {
      title: 'Información Básica',
      subtitle: 'Proporcione su información básica',
      fields: [
        { key: 'nombre', type: 'text', label: 'Nombre', required: true },
        { key: 'apellido', type: 'text', label: 'Apellido', required: true },
        { key: 'nombre_usuario', type: 'text', label: 'Nombre de Usuario', required: true },
        { key: 'estado', type: 'number', label: 'Estado', required: true },
      ],
    },
    {
      title: 'Contacto y Dirección',
      subtitle: 'Proporcione su información de contacto',
      fields: [
        { key: 'telefono', type: 'text', label: 'Teléfono', required: true },
        { key: 'correo', type: 'email', label: 'Correo Electrónico', required: true },
        { key: 'pais', type: 'text', label: 'País', required: true },
        { key: 'estado_provincia', type: 'text', label: 'Estado/Provincia', required: true },
      ],
    },
    {
      title: 'Detalles Educativos',
      subtitle: 'Proporcione su información educativa',
      fields: [
        { key: 'nacionalidad', type: 'text', label: 'Nacionalidad' },
        { key: 'fecha_nacimiento', type: 'date', label: 'Fecha de Nacimiento' },
        { key: 'numero_telefono', type: 'text', label: 'Número de Teléfono', required: true },
        {
          key: 'genero',
          type: 'select',
          label: 'Género',
          options: [
            { value: '', label: 'Seleccionar' },
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Femenino' },
            { value: 'Otro', label: 'Otro' },
          ],
        },
        { key: 'numero_hijos', type: 'number', label: 'Número de Hijos' },
      ],
    },
    {
      title: 'Información de la Iglesia',
      subtitle: 'Proporcione su información de la iglesia',
      fields: [
        { key: 'nombre_iglesia', type: 'text', label: 'Nombre de la Iglesia' },
        { key: 'direccion_iglesia', type: 'text', label: 'Dirección de la Iglesia' },
        { key: 'sitio_web_iglesia', type: 'url', label: 'Sitio Web de la Iglesia' },
        { key: 'nombre_pastor', type: 'text', label: 'Nombre del Pastor' },
        { key: 'correo_pastor', type: 'email', label: 'Correo Electrónico del Pastor' },
      ],
    },
    {
      title: 'Formaciones Anteriores',
      subtitle: 'Proporcione sus formaciones anteriores',
      fields: [
        {
          key: 'formacion_anterior',
          type: 'formation',
          label: 'Formaciones Anteriores',
          multiple: true,
          addMoreText: 'Agregar una formación',
          previewFields: [
            {
              key: 'niveles_formacion',
              label: 'Formación recibida',
            },
            {
              key: 'fechas_formacion',
              label: 'Fecha',
            },
          ],
          previewTitle: "Mis Formaciones",
          fields: [
            {
              key: 'niveles_formacion',
              type: 'select',
              label: 'Nivel de formación en la organización',
              options: [
                { value: '', label: 'Seleccionar' },
                { value: 'eee1_katak1', label: 'EEE1 (KATAK1)' },
                { value: 'eee2_katak2', label: 'EEE2 (KATAK2)' },
                { value: 'iot1', label: 'IOT 1' },
                { value: 'iot2', label: 'IOT 2' },
                { value: 'tce1', label: 'TCE 1' },
              ],
            },
            { key: 'fechas_formacion', type: 'date', label: 'Fecha' },
            { key: 'ubicaciones_formacion', type: 'text', label: 'Ubicación' },
            {
              key: 'menciones_formacion',
              type: 'select',
              label: 'Mención',
              options: [
                { value: '', label: 'Seleccionar' },
                { value: 'Muy Bueno', label: 'Muy Bueno' },
                { value: 'Bueno', label: 'Bueno' },
                { value: 'Excelente', label: 'Excelente' },
              ],
            },
            { key: 'fechas_completacion_formacion', type: 'date', label: 'Fecha de Completación' },
            {
              key: 'certificados_formacion',
              type: 'select',
              label: 'Certificado Obtenido',
              options: [
                { value: '', label: 'Seleccionar' },
                { value: 'True', label: 'Sí' },
                { value: 'False', label: 'No' },
              ],
            },
            { key: 'entrenadores_formacion', type: 'text', label: 'Nombre/Código del Entrenador' },
          ],
        },
      ],
    },
  ],
  icons: [User, Phone, Book, Church, Book], // Iconos para cada paso
};
const config_en= {
  steps: [
    {
      title: 'Basic Information',
      subtitle: 'Enter your basic information',
      fields: [
        { key: 'nom', type: 'text', label: 'Last Name', required: true },
        { key: 'prenom', type: 'text', label: 'First Name', required: true },
        { key: 'username', type: 'text', label: 'Username', required: true },
        { key: 'status', type: 'number', label: 'Status', required: true },
      ],
    },
    {
      title: 'Contact and Address',
      subtitle: 'Enter your contact information',
      fields: [
        { key: 'telephone', type: 'text', label: 'Phone', required: true },
        { key: 'email', type: 'email', label: 'Email', required: true },
        { key: 'country', type: 'text', label: 'Country', required: true },
        { key: 'state', type: 'text', label: 'State/Province', required: true },
      ],
    },
    {
      title: 'Educational Details',
      subtitle: 'Enter your educational information',
      fields: [
        { key: 'nationality', type: 'text', label: 'Nationality' },
        { key: 'birth_date', type: 'date', label: 'Date of Birth' },
        { key: 'phone_number', type: 'text', label: 'Phone Number', required: true },
        {
          key: 'gender',
          type: 'select',
          label: 'Gender',
          options: [
            { value: '', label: 'Select' },
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ],
        },
        { key: 'children_number', type: 'number', label: 'Number of Children' },
      ],
    },
    {
      title: 'Church Information',
      subtitle: 'Enter your church information',
      fields: [
        { key: 'church_name', type: 'text', label: 'Church Name' },
        { key: 'church_address', type: 'text', label: 'Church Address' },
        { key: 'church_website', type: 'url', label: 'Church Website' },
        { key: 'pastor_name', type: 'text', label: 'Pastor\'s Name' },
        { key: 'pastor_email', type: 'email', label: 'Pastor\'s Email' },
      ],
    },
    {
      title: 'Previous Training',
      subtitle: 'Enter your previous training',
      fields: [
        {
          key: 'old_formation',
          type: 'formation',
          label: 'Previous Training',
          multiple: true,
          addMoreText: 'Add a training',
          previewFields: [
            {
              key: 'formation_levels',
              label: 'Training Received',
            },
            {
              key: 'formation_dates',
              label: 'Date',
            },
          ],
          previewTitle: "My Training",
          fields: [
            {
              key: 'formation_levels',
              type: 'select',
              label: 'Training level in the organization',
              options: [
                { value: '', label: 'Select' },
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
                { value: '', label: 'Select' },
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
                { value: '', label: 'Select' },
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
  icons: [User, Phone, Book, Church, Book], // Icons for each step
};
const config_kr = {
  steps: [
    {
      title: 'Enfòmasyon de baz',
      subtitle: 'Antre enfòmasyon de baz ou',
      fields: [
        { key: 'nom', type: 'text', label: 'Non fanmi', required: true },
        { key: 'prenom', type: 'text', label: 'Prenom', required: true },
        { key: 'username', type: 'text', label: 'Non itilizatè', required: true },
        { key: 'status', type: 'number', label: 'Estati', required: true },
      ],
    },
    {
      title: 'Kontak ak Adres',
      subtitle: 'Antre enfòmasyon kontak ou',
      fields: [
        { key: 'telephone', type: 'text', label: 'Telefòn', required: true },
        { key: 'email', type: 'email', label: 'Imèl', required: true },
        { key: 'country', type: 'text', label: 'Peyi', required: true },
        { key: 'state', type: 'text', label: 'Eta/Provins', required: true },
      ],
    },
    {
      title: 'Detay Edikatif',
      subtitle: 'Antre enfòmasyon edikatif ou',
      fields: [
        { key: 'nationality', type: 'text', label: 'Nasyonalite' },
        { key: 'birth_date', type: 'date', label: 'Dat nesans' },
        { key: 'phone_number', type: 'text', label: 'Numèro telefòn', required: true },
        {
          key: 'gender',
          type: 'select',
          label: 'Sèks',
          options: [
            { value: '', label: 'Chwazi' },
            { value: 'M', label: 'Maskil' },
            { value: 'F', label: 'Femèl' },
            { value: 'Other', label: 'Lòt' },
          ],
        },
        { key: 'children_number', type: 'number', label: 'Nmè pitit' },
      ],
    },
    {
      title: 'Enfòmasyon Legliz',
      subtitle: 'Antre enfòmasyon legliz ou',
      fields: [
        { key: 'church_name', type: 'text', label: 'Non legliz' },
        { key: 'church_address', type: 'text', label: 'Adres legliz' },
        { key: 'church_website', type: 'url', label: 'Sitwèb legliz' },
        { key: 'pastor_name', type: 'text', label: 'Non pèchè' },
        { key: 'pastor_email', type: 'email', label: 'Imèl pèchè' },
      ],
    },
    {
      title: 'Fòmasyon Anvan',
      subtitle: 'Antre enfòmasyon fòmasyon anvan ou',
      fields: [
        {
          key: 'old_formation',
          type: 'formation',
          label: 'Fòmasyon anvan',
          multiple: true,
          addMoreText: 'Ajoute yon fòmasyon',
          previewFields: [
            {
              key: 'formation_levels',
              label: 'Nivo fòmasyon',
            },
            {
              key: 'formation_dates',
              label: 'Dat',
            },
          ],
          previewTitle: "Fòmasyon mwen",
          fields: [
            {
              key: 'formation_levels',
              type: 'select',
              label: 'Nivo fòmasyon nan òganizasyon',
              options: [
                { value: '', label: 'Chwazi' },
                { value: 'eee1_katak1', label: 'EEE1 (KATAK1)' },
                { value: 'eee2_katak2', label: 'EEE2 (KATAK2)' },
                { value: 'iot1', label: 'IOT 1' },
                { value: 'iot2', label: 'IOT 2' },
                { value: 'tce1', label: 'TCE 1' },
              ],
            },
            { key: 'formation_dates', type: 'date', label: 'Dat' },
            { key: 'formation_locations', type: 'text', label: 'Lokasyon' },
            {
              key: 'formation_mentions',
              type: 'select',
              label: 'Mention',
              options: [
                { value: '', label: 'Chwazi' },
                { value: 'Very Good', label: 'Tres byen' },
                { value: 'Good', label: 'Byen' },
                { value: 'Excellent', label: 'Eksepsyonèl' },
              ],
            },
            { key: 'formation_completion_dates', type: 'date', label: 'Dat konplèt' },
            {
              key: 'formation_certificates',
              type: 'select',
              label: 'Sètifika obtèni',
              options: [
                { value: '', label: 'Chwazi' },
                { value: 'True', label: 'Wi' },
                { value: 'False', label: 'Non' },
              ],
            },
            { key: 'formation_trainers', type: 'text', label: 'Non fòmasyon/ Kòd' },
          ],
        },
      ],
    },
  ],
  icons: [User, Phone, Book, Church, Book], // Icons for each step
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
 console.log(formData);
 //send the formdata to the users table with supabase use supabase api
 //convert the value of key old_formation in formData  to json to send them 
 const { old_formation, ...rest } = formData;
  const { data, error } = await supabase.from('users').insert([{...rest, old_formation: JSON.stringify(old_formation)}]);
  if (error) {
    console.error(error);
  }
};

const ProfileForm = () => {
  const { currentLang } = useContext(LanguageContext);
  useEffect(() => {
    console.log('Language changed to:', currentLang);
    // Perform any action needed when the language change
  }, [currentLang]);
  // Define the configuration based on the current language if en config=config_en like: const config = currentLang === 'fr' ? config_fr : currentLang === 'es' ? config_es : config_en; en prenant kr en compte config_kr
  const config = currentLang === 'fr' ? config_fr : currentLang === 'es' ? config_es : currentLang === 'kr' ? config_kr : config_en;
  return <MultiStepForm config={config} onSubmit={handleSubmit} language={currentLang} />
};

export default ProfileForm;
