import { MOCK_HOUSEKEEPERS } from '../add-housekeeper/data';

export const HOUSING_DATA = [
  {
    id: '1',
    name: 'Appartement T1',
    fullName: 'Appartement T1 - City Center',
    address: '12 Rue de Charenton 75012 Paris, France',
    city: 'Paris',
    zipCode: '75012',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=500',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    type: 'Apartment',
    bedrooms: '1 Bedroom',
    surface: '45m²',
    floor: '1st Floor',
    elevator: true,
    cleaningRate: '45,00 €',
    serviceFee: '2,25 €',
    status: 'Scheduled',
    alert: true,
    cleaner: {
      primary: MOCK_HOUSEKEEPERS[1],
      substitutes: [MOCK_HOUSEKEEPERS[0], MOCK_HOUSEKEEPERS[0]],
    },
    practicalInfo: {
      keyBox: true,
      keyBoxCode: '2154',
      specificInstruction: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.",
      usualFrequency: 'Every week'
    }
  },
  {
    id: '2',
    name: 'Appartement T2',
    fullName: 'Appartement T2 - City Center',
    address: '15 Rue de la Paix, 75002 Paris',
    city: 'Paris',
    zipCode: '75002',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    type: 'Apartment',
    bedrooms: '2 Bedrooms',
    surface: '65m²',
    floor: '2nd Floor',
    elevator: true,
    cleaningRate: '50,00 €',
    serviceFee: '2,50 €',
    status: 'Scheduled',
    alert: false,
    cleaner: {
      primary: MOCK_HOUSEKEEPERS[1],
      substitutes: [MOCK_HOUSEKEEPERS[0]],
    },
    practicalInfo: {
      keyBox: true,
      keyBoxCode: '1234',
      specificInstruction: "Please close the windows after cleaning.",
      usualFrequency: 'Every 2 weeks'
    }
  },
  {
    id: '3',
    name: 'Appartement T3',
    fullName: 'Appartement T3 - City Center',
    address: '12 Rue de Charenton 75012 Paris, France',
    city: 'Paris',
    zipCode: '75012',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=500',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    type: 'Apartment',
    bedrooms: '2 Bedrooms',
    surface: '85m²',
    floor: '3rd Floor',
    elevator: true,
    cleaningRate: '55,00 €',
    serviceFee: '2,75 €',
    status: 'Scheduled',
    alert: false,
    cleaner: {
      primary: MOCK_HOUSEKEEPERS[0],
      substitutes: [],
    },
    practicalInfo: {
      keyBox: true,
      keyBoxCode: '2154',
      specificInstruction: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.",
      usualFrequency: 'Every week'
    }
  },
  {
    id: '4',
    name: 'Appartement T4',
    fullName: 'Appartement T4 - City Center',
    address: '22 Avenue des Champs-Élysées, 75008 Paris',
    city: 'Paris',
    zipCode: '75008',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=500',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    type: 'Apartment',
    bedrooms: '3 Bedrooms',
    surface: '110m²',
    floor: '4th Floor',
    elevator: true,
    cleaningRate: '75,00 €',
    serviceFee: '3,75 €',
    status: 'Scheduled',
    alert: false,
    cleaner: {
      primary: MOCK_HOUSEKEEPERS[0],
      substitutes: [MOCK_HOUSEKEEPERS[1]],
    },
    practicalInfo: {
      keyBox: true,
      keyBoxCode: '9876',
      specificInstruction: "Extra care needed for the living room floor.",
      usualFrequency: 'Every week'
    }
  },
  {
    id: '5',
    name: 'Appartement T5',
    fullName: 'Appartement T5 - City Center',
    address: '10 Rue de Rivoli, 75004 Paris',
    city: 'Paris',
    zipCode: '75004',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    type: 'Apartment',
    bedrooms: '2 Bedrooms',
    surface: '75m²',
    floor: '2nd Floor',
    elevator: false,
    cleaningRate: '55,00 €',
    serviceFee: '2,75 €',
    status: 'Not Scheduled',
    alert: false,
    cleaner: {
      primary: MOCK_HOUSEKEEPERS[0],
      substitutes: [],
    },
    practicalInfo: {
      keyBox: true,
      keyBoxCode: '3456',
      specificInstruction: "Please clean the balcony.",
      usualFrequency: 'Every 2 weeks'
    }
  },
  {
    id: '6',
    name: 'Appartement T6',
    fullName: 'Appartement T6 - City Center',
    address: '5 Boulevard Haussmann, 75009 Paris',
    city: 'Paris',
    zipCode: '75009',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=500',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    type: 'Apartment',
    bedrooms: '1 Bedroom',
    surface: '50m²',
    floor: '5th Floor',
    elevator: true,
    cleaningRate: '45,00 €',
    serviceFee: '2,25 €',
    status: 'Not Scheduled',
    alert: false,
    cleaner: {
      primary: null,
      substitutes: [],
    },
    practicalInfo: {
      keyBox: false,
      keyBoxCode: '',
      specificInstruction: "Keys are with the concierge.",
      usualFrequency: 'Every week'
    }
  }
];
