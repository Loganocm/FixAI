import { Wrench, ChevronLeft } from 'lucide-react';

interface PartNameStepProps {
  value: string;
  onChange: (value: string, article?: string, isCustom?: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  carMake: string;
  carModel: string;
  carYear: string;
}

const commonParts = [
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

export function PartNameStep({ value, onChange, onSubmit, onBack, carMake, carModel, carYear }: PartNameStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  const handlePartSelect = (part: { display: string; article: string }) => {
    onChange(part.display, part.article, false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{carYear} {carMake} {carModel}</p>
            <h1 className="text-3xl font-bold text-gray-900">Which part are you installing?</h1>
            <p className="text-gray-600 mt-1">Select a common part or type your own</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value, '', true)}
              placeholder="Type part name..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              autoFocus
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Common parts:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {commonParts.map((part) => (
                <button
                  key={part.display}
                  type="button"
                  onClick={() => handlePartSelect(part)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    value === part.display
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {part.display}
                </button>
              ))}
            </div>
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
              <Wrench className="w-5 h-5" />
              Get Installation Help
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
