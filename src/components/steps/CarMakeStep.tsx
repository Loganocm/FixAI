import { Car, ChevronRight } from 'lucide-react';
import { fetchCarMakes, CarMake, getInitialMakes } from '../../data/carData';
import { useEffect, useState } from 'react';

interface CarMakeStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function CarMakeStep({ value, onChange, onNext }: CarMakeStepProps) {
  // Initialize with fallback data for instant render
  const [makes, setMakes] = useState<CarMake[]>(getInitialMakes());

  useEffect(() => {
    async function loadMakes() {
      try {
        const data = await fetchCarMakes();
        // Only update if we got data back
        if (data.length > 0) {
            setMakes(data);
        }
      } catch (error) {
        console.error('Failed to load makes', error);
      }
    }
    loadMakes();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onNext();
    }
  };

  const handleMakeSelect = (make: string) => {
    onChange(make);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Car className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">What's your car make?</h1>
            <p className="text-gray-600 mt-1">Select from the list below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
                {makes.map((make) => (
                    <button
                        key={make.name}
                        type="button"
                        onClick={() => handleMakeSelect(make.name)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        value === make.name
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        {make.name}
                    </button>
                    ))}
          </div>

          <button
            type="submit"
            disabled={!value.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
