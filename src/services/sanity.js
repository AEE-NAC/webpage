import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'bdb1lixi', // Remplace par ton ID de projet Sanity
  dataset: 'production', // Remplace par ton dataset
  apiVersion: '2023-01-01', // Remplace par la version de l'API que tu utilises
  useCdn: true, // Utilise le CDN pour les requêtes en lecture seule
});

export default sanityClient;

