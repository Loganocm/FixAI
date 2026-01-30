import { Car, ChevronRight, Search, Loader2 } from 'lucide-react';
import { fetchCarMakes, CarMake } from '../../data/carData';
import { useEffect, useState } from 'react';

interface CarMakeStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function CarMakeStep({ value, onChange, onNext }: CarMakeStepProps) {
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadMakes() {
      try {
        const data = await fetchCarMakes();
        setMakes(data);
      } catch (error) {
        console.error('Failed to load makes', error);
      } finally {
        setLoading(false);
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
    // Optional: Auto-advance if not using submit button
    // onNext(); 
  };

  const filteredMakes = makes.filter(make => 
    make.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {/* Search Bar - unobtrusive */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search makes..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {loading ? (
                <div className="col-span-full flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : filteredMakes.length > 0 ? (
                filteredMakes.map((make) => (
                    <button
                        key={make.id}
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
                    ))
            ) : (
                <div className="col-span-full text-center text-gray-500 py-4">
                    No makes found matching "{searchTerm}"
                </div>
            )}
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
