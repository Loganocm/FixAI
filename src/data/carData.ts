export interface CarModel {
  name: string;
  years: number[];
}

export interface CarMake {
  name: string;
  models: CarModel[];
}

const currentYear = new Date().getFullYear();

export const carData: CarMake[] = [
  {
    name: 'Toyota',
    models: [
      { name: 'Camry', years: Array.from({ length: 45 }, (_, i) => 1980 + i).filter(y => y <= currentYear) },
      { name: 'Corolla', years: Array.from({ length: 58 }, (_, i) => 1966 + i).filter(y => y <= currentYear) },
      { name: 'RAV4', years: Array.from({ length: 30 }, (_, i) => 1994 + i).filter(y => y <= currentYear) },
      { name: 'Highlander', years: Array.from({ length: 24 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'Tacoma', years: Array.from({ length: 30 }, (_, i) => 1995 + i).filter(y => y <= currentYear) },
      { name: 'Tundra', years: Array.from({ length: 25 }, (_, i) => 1999 + i).filter(y => y <= currentYear) },
      { name: '4Runner', years: Array.from({ length: 41 }, (_, i) => 1984 + i).filter(y => y <= currentYear) },
      { name: 'Sienna', years: Array.from({ length: 27 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'Prius', years: Array.from({ length: 24 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'Avalon', years: Array.from({ length: 30 }, (_, i) => 1994 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Honda',
    models: [
      { name: 'Civic', years: Array.from({ length: 52 }, (_, i) => 1972 + i).filter(y => y <= currentYear) },
      { name: 'Accord', years: Array.from({ length: 48 }, (_, i) => 1976 + i).filter(y => y <= currentYear) },
      { name: 'CR-V', years: Array.from({ length: 28 }, (_, i) => 1996 + i).filter(y => y <= currentYear) },
      { name: 'Pilot', years: Array.from({ length: 23 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'Odyssey', years: Array.from({ length: 30 }, (_, i) => 1994 + i).filter(y => y <= currentYear) },
      { name: 'HR-V', years: Array.from({ length: 10 }, (_, i) => 2015 + i).filter(y => y <= currentYear) },
      { name: 'Fit', years: Array.from({ length: 21 }, (_, i) => 2006 + i).filter(y => y <= currentYear) },
      { name: 'Ridgeline', years: Array.from({ length: 19 }, (_, i) => 2005 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Ford',
    models: [
      { name: 'F-150', years: Array.from({ length: 75 }, (_, i) => 1948 + i).filter(y => y <= currentYear) },
      { name: 'Mustang', years: Array.from({ length: 60 }, (_, i) => 1964 + i).filter(y => y <= currentYear) },
      { name: 'Explorer', years: Array.from({ length: 34 }, (_, i) => 1990 + i).filter(y => y <= currentYear) },
      { name: 'Escape', years: Array.from({ length: 24 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'Edge', years: Array.from({ length: 18 }, (_, i) => 2006 + i).filter(y => y <= currentYear) },
      { name: 'Fusion', years: Array.from({ length: 14 }, (_, i) => 2006 + i).filter(y => y <= 2020) },
      { name: 'Ranger', years: Array.from({ length: 41 }, (_, i) => 1983 + i).filter(y => y <= currentYear) },
      { name: 'Bronco', years: Array.from({ length: 5 }, (_, i) => 2020 + i).filter(y => y <= currentYear) },
      { name: 'Expedition', years: Array.from({ length: 28 }, (_, i) => 1996 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Chevrolet',
    models: [
      { name: 'Silverado', years: Array.from({ length: 26 }, (_, i) => 1998 + i).filter(y => y <= currentYear) },
      { name: 'Malibu', years: Array.from({ length: 50 }, (_, i) => 1964 + i).filter(y => y <= currentYear) },
      { name: 'Equinox', years: Array.from({ length: 20 }, (_, i) => 2004 + i).filter(y => y <= currentYear) },
      { name: 'Traverse', years: Array.from({ length: 17 }, (_, i) => 2008 + i).filter(y => y <= currentYear) },
      { name: 'Tahoe', years: Array.from({ length: 30 }, (_, i) => 1994 + i).filter(y => y <= currentYear) },
      { name: 'Suburban', years: Array.from({ length: 89 }, (_, i) => 1935 + i).filter(y => y <= currentYear) },
      { name: 'Camaro', years: Array.from({ length: 57 }, (_, i) => 1966 + i).filter(y => y <= currentYear) },
      { name: 'Corvette', years: Array.from({ length: 71 }, (_, i) => 1953 + i).filter(y => y <= currentYear) },
      { name: 'Colorado', years: Array.from({ length: 21 }, (_, i) => 2003 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Nissan',
    models: [
      { name: 'Altima', years: Array.from({ length: 31 }, (_, i) => 1993 + i).filter(y => y <= currentYear) },
      { name: 'Sentra', years: Array.from({ length: 42 }, (_, i) => 1982 + i).filter(y => y <= currentYear) },
      { name: 'Rogue', years: Array.from({ length: 18 }, (_, i) => 2007 + i).filter(y => y <= currentYear) },
      { name: 'Pathfinder', years: Array.from({ length: 37 }, (_, i) => 1987 + i).filter(y => y <= currentYear) },
      { name: 'Maxima', years: Array.from({ length: 43 }, (_, i) => 1981 + i).filter(y => y <= currentYear) },
      { name: 'Murano', years: Array.from({ length: 22 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'Frontier', years: Array.from({ length: 27 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'Titan', years: Array.from({ length: 21 }, (_, i) => 2003 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'BMW',
    models: [
      { name: '3 Series', years: Array.from({ length: 49 }, (_, i) => 1975 + i).filter(y => y <= currentYear) },
      { name: '5 Series', years: Array.from({ length: 51 }, (_, i) => 1972 + i).filter(y => y <= currentYear) },
      { name: 'X3', years: Array.from({ length: 22 }, (_, i) => 2003 + i).filter(y => y <= currentYear) },
      { name: 'X5', years: Array.from({ length: 26 }, (_, i) => 1999 + i).filter(y => y <= currentYear) },
      { name: 'X1', years: Array.from({ length: 15 }, (_, i) => 2009 + i).filter(y => y <= currentYear) },
      { name: '7 Series', years: Array.from({ length: 48 }, (_, i) => 1977 + i).filter(y => y <= currentYear) },
      { name: 'M3', years: Array.from({ length: 38 }, (_, i) => 1986 + i).filter(y => y <= currentYear) },
      { name: 'M5', years: Array.from({ length: 39 }, (_, i) => 1985 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Mercedes-Benz',
    models: [
      { name: 'C-Class', years: Array.from({ length: 31 }, (_, i) => 1993 + i).filter(y => y <= currentYear) },
      { name: 'E-Class', years: Array.from({ length: 77 }, (_, i) => 1947 + i).filter(y => y <= currentYear) },
      { name: 'S-Class', years: Array.from({ length: 72 }, (_, i) => 1952 + i).filter(y => y <= currentYear) },
      { name: 'GLE', years: Array.from({ length: 27 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'GLC', years: Array.from({ length: 9 }, (_, i) => 2015 + i).filter(y => y <= currentYear) },
      { name: 'GLA', years: Array.from({ length: 11 }, (_, i) => 2013 + i).filter(y => y <= currentYear) },
      { name: 'A-Class', years: Array.from({ length: 27 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Volkswagen',
    models: [
      { name: 'Jetta', years: Array.from({ length: 42 }, (_, i) => 1979 + i).filter(y => y <= currentYear) },
      { name: 'Passat', years: Array.from({ length: 50 }, (_, i) => 1973 + i).filter(y => y <= currentYear) },
      { name: 'Golf', years: Array.from({ length: 49 }, (_, i) => 1974 + i).filter(y => y <= currentYear) },
      { name: 'Tiguan', years: Array.from({ length: 18 }, (_, i) => 2007 + i).filter(y => y <= currentYear) },
      { name: 'Atlas', years: Array.from({ length: 8 }, (_, i) => 2017 + i).filter(y => y <= currentYear) },
      { name: 'Beetle', years: Array.from({ length: 79 }, (_, i) => 1938 + i).filter(y => y <= 2019) },
    ],
  },
  {
    name: 'Audi',
    models: [
      { name: 'A4', years: Array.from({ length: 29 }, (_, i) => 1995 + i).filter(y => y <= currentYear) },
      { name: 'A6', years: Array.from({ length: 29 }, (_, i) => 1994 + i).filter(y => y <= currentYear) },
      { name: 'Q5', years: Array.from({ length: 16 }, (_, i) => 2008 + i).filter(y => y <= currentYear) },
      { name: 'Q7', years: Array.from({ length: 19 }, (_, i) => 2005 + i).filter(y => y <= currentYear) },
      { name: 'A3', years: Array.from({ length: 28 }, (_, i) => 1996 + i).filter(y => y <= currentYear) },
      { name: 'Q3', years: Array.from({ length: 14 }, (_, i) => 2011 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Mazda',
    models: [
      { name: 'Mazda3', years: Array.from({ length: 22 }, (_, i) => 2003 + i).filter(y => y <= currentYear) },
      { name: 'Mazda6', years: Array.from({ length: 22 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'CX-5', years: Array.from({ length: 14 }, (_, i) => 2011 + i).filter(y => y <= currentYear) },
      { name: 'CX-9', years: Array.from({ length: 19 }, (_, i) => 2006 + i).filter(y => y <= currentYear) },
      { name: 'MX-5 Miata', years: Array.from({ length: 36 }, (_, i) => 1989 + i).filter(y => y <= currentYear) },
      { name: 'CX-3', years: Array.from({ length: 10 }, (_, i) => 2015 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Hyundai',
    models: [
      { name: 'Elantra', years: Array.from({ length: 34 }, (_, i) => 1990 + i).filter(y => y <= currentYear) },
      { name: 'Sonata', years: Array.from({ length: 39 }, (_, i) => 1985 + i).filter(y => y <= currentYear) },
      { name: 'Tucson', years: Array.from({ length: 20 }, (_, i) => 2004 + i).filter(y => y <= currentYear) },
      { name: 'Santa Fe', years: Array.from({ length: 24 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'Kona', years: Array.from({ length: 8 }, (_, i) => 2017 + i).filter(y => y <= currentYear) },
      { name: 'Palisade', years: Array.from({ length: 6 }, (_, i) => 2019 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Kia',
    models: [
      { name: 'Optima', years: Array.from({ length: 24 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'Sorento', years: Array.from({ length: 22 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'Sportage', years: Array.from({ length: 30 }, (_, i) => 1993 + i).filter(y => y <= currentYear) },
      { name: 'Soul', years: Array.from({ length: 16 }, (_, i) => 2008 + i).filter(y => y <= currentYear) },
      { name: 'Forte', years: Array.from({ length: 16 }, (_, i) => 2008 + i).filter(y => y <= currentYear) },
      { name: 'Telluride', years: Array.from({ length: 6 }, (_, i) => 2019 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Subaru',
    models: [
      { name: 'Outback', years: Array.from({ length: 30 }, (_, i) => 1994 + i).filter(y => y <= currentYear) },
      { name: 'Forester', years: Array.from({ length: 27 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'Impreza', years: Array.from({ length: 32 }, (_, i) => 1992 + i).filter(y => y <= currentYear) },
      { name: 'Crosstrek', years: Array.from({ length: 13 }, (_, i) => 2012 + i).filter(y => y <= currentYear) },
      { name: 'Legacy', years: Array.from({ length: 35 }, (_, i) => 1989 + i).filter(y => y <= currentYear) },
      { name: 'WRX', years: Array.from({ length: 24 }, (_, i) => 2001 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Jeep',
    models: [
      { name: 'Wrangler', years: Array.from({ length: 38 }, (_, i) => 1986 + i).filter(y => y <= currentYear) },
      { name: 'Grand Cherokee', years: Array.from({ length: 33 }, (_, i) => 1992 + i).filter(y => y <= currentYear) },
      { name: 'Cherokee', years: Array.from({ length: 49 }, (_, i) => 1974 + i).filter(y => y <= currentYear) },
      { name: 'Compass', years: Array.from({ length: 18 }, (_, i) => 2006 + i).filter(y => y <= currentYear) },
      { name: 'Renegade', years: Array.from({ length: 10 }, (_, i) => 2014 + i).filter(y => y <= currentYear) },
      { name: 'Gladiator', years: Array.from({ length: 6 }, (_, i) => 2019 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Ram',
    models: [
      { name: '1500', years: Array.from({ length: 15 }, (_, i) => 2009 + i).filter(y => y <= currentYear) },
      { name: '2500', years: Array.from({ length: 15 }, (_, i) => 2009 + i).filter(y => y <= currentYear) },
      { name: '3500', years: Array.from({ length: 15 }, (_, i) => 2009 + i).filter(y => y <= currentYear) },
      { name: 'ProMaster', years: Array.from({ length: 12 }, (_, i) => 2013 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Tesla',
    models: [
      { name: 'Model S', years: Array.from({ length: 13 }, (_, i) => 2012 + i).filter(y => y <= currentYear) },
      { name: 'Model 3', years: Array.from({ length: 8 }, (_, i) => 2017 + i).filter(y => y <= currentYear) },
      { name: 'Model X', years: Array.from({ length: 10 }, (_, i) => 2015 + i).filter(y => y <= currentYear) },
      { name: 'Model Y', years: Array.from({ length: 5 }, (_, i) => 2020 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Lexus',
    models: [
      { name: 'RX', years: Array.from({ length: 28 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'ES', years: Array.from({ length: 34 }, (_, i) => 1989 + i).filter(y => y <= currentYear) },
      { name: 'NX', years: Array.from({ length: 11 }, (_, i) => 2014 + i).filter(y => y <= currentYear) },
      { name: 'GX', years: Array.from({ length: 22 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'IS', years: Array.from({ length: 26 }, (_, i) => 1998 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Acura',
    models: [
      { name: 'MDX', years: Array.from({ length: 24 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'RDX', years: Array.from({ length: 18 }, (_, i) => 2006 + i).filter(y => y <= currentYear) },
      { name: 'TLX', years: Array.from({ length: 11 }, (_, i) => 2014 + i).filter(y => y <= currentYear) },
      { name: 'ILX', years: Array.from({ length: 13 }, (_, i) => 2012 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Dodge',
    models: [
      { name: 'Charger', years: Array.from({ length: 58 }, (_, i) => 1966 + i).filter(y => y <= currentYear) },
      { name: 'Challenger', years: Array.from({ length: 54 }, (_, i) => 1970 + i).filter(y => y <= currentYear) },
      { name: 'Durango', years: Array.from({ length: 28 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'Journey', years: Array.from({ length: 13 }, (_, i) => 2008 + i).filter(y => y <= 2020) },
    ],
  },
  {
    name: 'GMC',
    models: [
      { name: 'Sierra', years: Array.from({ length: 26 }, (_, i) => 1998 + i).filter(y => y <= currentYear) },
      { name: 'Terrain', years: Array.from({ length: 16 }, (_, i) => 2009 + i).filter(y => y <= currentYear) },
      { name: 'Acadia', years: Array.from({ length: 18 }, (_, i) => 2006 + i).filter(y => y <= currentYear) },
      { name: 'Yukon', years: Array.from({ length: 30 }, (_, i) => 1992 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Buick',
    models: [
      { name: 'Enclave', years: Array.from({ length: 18 }, (_, i) => 2007 + i).filter(y => y <= currentYear) },
      { name: 'Encore', years: Array.from({ length: 13 }, (_, i) => 2012 + i).filter(y => y <= currentYear) },
      { name: 'Envision', years: Array.from({ length: 9 }, (_, i) => 2015 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Cadillac',
    models: [
      { name: 'Escalade', years: Array.from({ length: 27 }, (_, i) => 1998 + i).filter(y => y <= currentYear) },
      { name: 'XT5', years: Array.from({ length: 9 }, (_, i) => 2016 + i).filter(y => y <= currentYear) },
      { name: 'CT5', years: Array.from({ length: 6 }, (_, i) => 2019 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Lincoln',
    models: [
      { name: 'Navigator', years: Array.from({ length: 28 }, (_, i) => 1997 + i).filter(y => y <= currentYear) },
      { name: 'Aviator', years: Array.from({ length: 6 }, (_, i) => 2019 + i).filter(y => y <= currentYear) },
      { name: 'Nautilus', years: Array.from({ length: 7 }, (_, i) => 2018 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Volvo',
    models: [
      { name: 'XC90', years: Array.from({ length: 23 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'XC60', years: Array.from({ length: 17 }, (_, i) => 2008 + i).filter(y => y <= currentYear) },
      { name: 'S60', years: Array.from({ length: 25 }, (_, i) => 2000 + i).filter(y => y <= currentYear) },
      { name: 'XC40', years: Array.from({ length: 7 }, (_, i) => 2018 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Porsche',
    models: [
      { name: '911', years: Array.from({ length: 61 }, (_, i) => 1963 + i).filter(y => y <= currentYear) },
      { name: 'Cayenne', years: Array.from({ length: 22 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'Macan', years: Array.from({ length: 11 }, (_, i) => 2014 + i).filter(y => y <= currentYear) },
      { name: 'Panamera', years: Array.from({ length: 16 }, (_, i) => 2009 + i).filter(y => y <= currentYear) },
    ],
  },
  {
    name: 'Mitsubishi',
    models: [
      { name: 'Outlander', years: Array.from({ length: 22 }, (_, i) => 2002 + i).filter(y => y <= currentYear) },
      { name: 'Eclipse Cross', years: Array.from({ length: 8 }, (_, i) => 2017 + i).filter(y => y <= currentYear) },
      { name: 'Mirage', years: Array.from({ length: 13 }, (_, i) => 2012 + i).filter(y => y <= currentYear) },
    ],
  },
];

export function getCarMakes(): string[] {
  return carData.map(make => make.name).sort();
}

export function getCarModels(makeName: string): string[] {
  const make = carData.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  return make ? make.models.map(model => model.name).sort() : [];
}

export function getCarYears(makeName: string, modelName: string): number[] {
  const make = carData.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  if (!make) return [];

  const model = make.models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
  return model ? model.years.sort((a, b) => b - a) : [];
}

const electricCarMakes = ['Tesla'];
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
