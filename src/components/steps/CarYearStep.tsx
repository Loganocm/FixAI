import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { getCarYears } from '../../data/carData';

interface CarYearStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  carMake: string;
  carModel: string;
}

export function CarYearStep({ value, onChange, onNext, onBack, carMake, carModel }: CarYearStepProps) {
  const availableYears = getCarYears(carMake, carModel);
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(value);
    if (value && year >= 1900 && year <= currentYear + 1) {
      onNext();
    }
  };

  const handleYearSelect = (year: number) => {
    onChange(year.toString());
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{carMake} {carModel}</p>
            <h1 className="text-3xl font-bold text-gray-900">What year?</h1>
            <p className="text-gray-600 mt-1">Select your car's year</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1">
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearSelect(year)}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                  value === year.toString()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {year}
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
              disabled={!value || parseInt(value) < 1900 || parseInt(value) > currentYear + 1}
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
