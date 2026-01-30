
import { supabase } from '../lib/supabase';

export interface CarMake {
  id?: number;
  name: string;
}

export interface CarModel {
  id?: number;
  make_id?: number;
  name: string;
}

// --- FALLBACK DATA (Original Hardcoded List) ---


// Simplified structure for fallback (we only really need names for the UI if we aren't enforcing years strictly yet)
// But to keep it robust we can keep the structure.
export const fallbackCarData = [
  {
    name: 'Toyota',
    models: [
      'Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner', 'Sienna', 'Prius', 'Avalon', 'Crown', 'Grand Highlander'
    ],
  },
  {
    name: 'Honda',
    models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Fit', 'Ridgeline'],
  },
  {
    name: 'Ford',
    models: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Fusion', 'Ranger', 'Bronco', 'Expedition'],
  },
  {
    name: 'Chevrolet',
    models: ['Silverado', 'Malibu', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Camaro', 'Corvette', 'Colorado'],
  },
  {
    name: 'Nissan',
    models: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Maxima', 'Murano', 'Frontier', 'Titan'],
  },
  {
    name: 'BMW',
    models: ['3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series', 'M3', 'M5'],
  },
  {
    name: 'Mercedes-Benz',
    models: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'GLA', 'A-Class'],
  },
  {
    name: 'Volkswagen',
    models: ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Atlas', 'Beetle'],
  },
  {
    name: 'Audi',
    models: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3'],
  },
  {
    name: 'Mazda',
    models: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-3', 'CX-30', 'CX-50', 'CX-90'],
  },
  {
    name: 'Hyundai',
    models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Ioniq 5'],
  },
  {
    name: 'Kia',
    models: ['Optima', 'Sorento', 'Sportage', 'Soul', 'Forte', 'Telluride', 'K5', 'EV6'],
  },
  {
    name: 'Subaru',
    models: ['Outback', 'Forester', 'Impreza', 'Crosstrek', 'Legacy', 'WRX', 'Ascent'],
  },
  {
    name: 'Jeep',
    models: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
  },
  {
    name: 'Ram',
    models: ['1500', '2500', '3500', 'ProMaster'],
  },
  {
    name: 'Tesla',
    models: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
  },
  {
    name: 'Lexus',
    models: ['RX', 'ES', 'NX', 'GX', 'IS', 'LX'],
  },
  {
    name: 'Acura',
    models: ['MDX', 'RDX', 'TLX', 'ILX', 'Integra'],
  },
  {
    name: 'Dodge',
    models: ['Charger', 'Challenger', 'Durango', 'Journey', 'Hornet'],
  },
  {
    name: 'GMC',
    models: ['Sierra', 'Terrain', 'Acadia', 'Yukon'],
  },
  {
    name: 'Buick',
    models: ['Enclave', 'Encore', 'Envision']
  },
  {
    name: 'Cadillac',
    models: ['Escalade', 'XT5', 'CT5', 'CT4', 'Lyriq']
  },
  {
    name: 'Lincoln',
    models: ['Navigator', 'Aviator', 'Nautilus', 'Corsair']
  },
  {
    name: 'Volvo',
    models: ['XC90', 'XC60', 'S60', 'XC40', 'C40']
  },
  {
    name: 'Porsche',
    models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan']
  },
  {
    name: 'Mitsubishi',
    models: ['Outlander', 'Eclipse Cross', 'Mirage']
  }
];

// --- HELPER TO GET INITIAL STATE ---
export function getInitialMakes(): CarMake[] {
  return fallbackCarData.map(m => ({ name: m.name })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getInitialModels(makeName: string): CarModel[] {
  const make = fallbackCarData.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  return make ? make.models.map(name => ({ name })).sort((a, b) => a.name.localeCompare(b.name)) : [];
}


// --- SUPABASE API ---

const PRIORITY_MAKES = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
  'Volkswagen', 'Audi', 'Mazda', 'Hyundai', 'Kia', 'Subaru', 'Jeep', 'Ram',
  'Tesla', 'Lexus', 'Acura', 'Dodge', 'GMC', 'Buick', 'Cadillac', 'Lincoln',
  'Volvo', 'Porsche', 'Mitsubishi'
];

export async function fetchCarMakes(): Promise<CarMake[]> {
  const { data, error } = await supabase
    .from('car_makes')
    .select('id, name')
    .in('name', PRIORITY_MAKES) // Strictly filter by our priority list
    .order('name');

  if (error) {
    console.error('Error fetching makes from Supabase:', error);
    return getInitialMakes(); // Fallback on error
  }

  if (!data || data.length === 0) {
    return getInitialMakes(); // Fallback if DB is empty
  }

  return data;
}

export async function fetchCarModels(makeName: string): Promise<CarModel[]> {
  // First get the make_id
  const { data: makeData, error: makeError } = await supabase
    .from('car_makes')
    .select('id')
    .ilike('name', makeName)
    .single();

  if (makeError || !makeData) {
    // If make not found in DB, try fallback matches
    return getInitialModels(makeName);
  }

  const { data, error } = await supabase
    .from('car_models')
    .select('id, make_id, name')
    .eq('make_id', makeData.id)
    .order('name');

  if (error) {
    console.error('Error fetching models:', error);
    return getInitialModels(makeName);
  }

  if (!data || data.length === 0) {
    return getInitialModels(makeName);
  }

  return data;
}

// Re-export common parts logic
const electricCarMakes = ['Tesla', 'Rivian', 'Lucid'];
const evExcludedParts = ['Air Filter', 'Oil Filter', 'Spark Plugs', 'Serpentine Belt', 'Alternator', 'Starter Motor', 'Fuel Filter', 'Radiator'];

export function getCommonParts(makeName: string): { display: string; article: string }[] {
  const isElectric = electricCarMakes.some(make => make.toLowerCase() === makeName.toLowerCase());

  const allParts = [
    { display: 'Brake Pads', article: '' },
    { display: 'Air Filter', article: 'an' },
    { display: 'Oil Filter', article: 'an' },
    { display: 'Spark Plugs', article: '' },
    { display: 'Battery', article: 'a' },
    { display: 'Cabin Air Filter', article: 'a' },
    { display: 'Wiper Blades', article: '' },
    { display: 'Headlight Bulb', article: 'a' },
    { display: 'Serpentine Belt', article: 'a' },
    { display: 'Alternator', article: 'an' },
    { display: 'Starter Motor', article: 'a' },
    { display: 'Thermostat', article: 'a' },
    { display: 'Radiator', article: 'a' },
    { display: 'Fuel Filter', article: 'a' },
    { display: 'Oxygen Sensor', article: 'an' },
  ];

  if (isElectric) {
    return allParts.filter(part => !evExcludedParts.includes(part.display));
  }

  return allParts;
}
