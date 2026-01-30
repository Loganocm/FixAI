
import { supabase } from '../lib/supabase';

export interface CarMake {
  id: number;
  name: string;
}

export interface CarModel {
  id: number;
  make_id: number;
  name: string;
}

export async function fetchCarMakes(): Promise<CarMake[]> {
  const { data, error } = await supabase
    .from('car_makes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching makes:', error);
    return [];
  }
  return data || [];
}

export async function fetchCarModels(makeName: string): Promise<CarModel[]> {
  // First get the make_id
  const { data: makeData, error: makeError } = await supabase
    .from('car_makes')
    .select('id')
    .ilike('name', makeName)
    .single();

  if (makeError || !makeData) {
    console.error('Error fetching make ID associated with:', makeName, makeError);
    return [];
  }

  const { data, error } = await supabase
    .from('car_models')
    .select('*')
    .eq('make_id', makeData.id)
    .order('name');

  if (error) {
    console.error('Error fetching models:', error);
    return [];
  }
  return data || [];
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
