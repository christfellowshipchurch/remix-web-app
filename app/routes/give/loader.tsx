import { LoaderFunction } from 'react-router';

export type LoaderReturnType = {
  campusList: string[];
};

export const loader: LoaderFunction = async () => {
  const pageData: LoaderReturnType = {
    campusList: [
      'Belle Glade',
      'Boca Raton',
      'Boynton Beach',
      'En Español',
      'Jupiter',
      'Okeechobee',
      'CF Everywhere (Online)',
      'Downtown West Palm Beach',
      'Palm Beach Gardens',
      'Port St. Lucie',
      'Royal Palm Beach',
      'Stuart',
      'Trinity',
      'Vero Beach',
      'Westlake - Loxahatchee',
    ],
  };

  return pageData;
};
