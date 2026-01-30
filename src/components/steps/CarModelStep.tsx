import { Gauge, ChevronRight, ChevronLeft } from 'lucide-react';
import { fetchCarModels, CarModel, getInitialModels } from '../../data/carData';
import { useEffect, useState } from 'react';

interface CarModelStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  carMake: string;
}

export function CarModelStep({ value, onChange, onNext, onBack, carMake }: CarModelStepProps) {
  // Initialize with fallback for instant render
  const [models, setModels] = useState<CarModel[]>(getInitialModels(carMake));

  useEffect(() => {
    // If make changed, reset and load
    setModels(getInitialModels(carMake));
    
    async function loadModels() {
      if (!carMake) return;
      try {
        const data = await fetchCarModels(carMake);
        if (data.length > 0) {
            setModels(data);
        }
      } catch (error) {
        console.error('Failed to load models', error);
      }
    }
    loadModels();
  }, [carMake]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onNext();
    }
  };

  const handleModelSelect = (model: string) => {
    onChange(model);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Gauge className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{carMake}</p>
            <h1 className="text-3xl font-bold text-gray-900">What's the model?</h1>
            <p className="text-gray-600 mt-1">Select your car's model</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
             {models.map((model) => (
                    <button
                        key={model.name}
                        type="button"
                        onClick={() => handleModelSelect(model.name)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        value === model.name
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        {model.name}
                    </button>
                    ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-4 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
