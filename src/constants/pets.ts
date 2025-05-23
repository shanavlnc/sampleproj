interface Pet {
  createdAt: any;
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  imageUrl: any;
  status: 'available' | 'adopted';
}

export const placeholderPets: Pet[] = [
  {
    id: '1',
    name: 'Smiley',
    breed: 'Aspin',
    age: '2 years',
    gender: 'Male',
    description: 'Very friendly and loves to play fetch. Gets along well with other dogs.',
    imageUrl: require('../assets/images/smiley.png'),
    status: 'available',
    createdAt: undefined
  },
  {
    id: '2',
    name: 'Owen',
    breed: 'Puspin',
    age: '1.5 years',
    gender: 'Male',
    description: 'Loves cuddles and naps. Already neutered and vaccinated.',
    imageUrl: require('../assets/images/owen.png'),
    status: 'available',
    createdAt: undefined
  },
  {
    id: '3',
    name: 'Vicky',
    breed: 'Aspin',
    age: '3 years',
    gender: 'Female',
    description: 'Gentle and well-behaved. Great with children and other pets.',
    imageUrl: require('../assets/images/vicky.png'),
    status: 'available',
    createdAt: undefined
  },
  // Add all other pets following the same structure
  {
    id: '30',
    name: 'Walter White',
    breed: 'Puspin',
    age: '4 years',
    gender: 'Male',
    description: 'A calm and dignified cat who enjoys quiet environments.',
    imageUrl: require('../assets/images/walter.png'),
    status: 'available',
    createdAt: undefined
  }
];