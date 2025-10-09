import { Wrench, ArrowRight, Car, Sparkles } from 'lucide-react';

interface WelcomePageProps {
  onBegin: () => void;
}

export function WelcomePage({ onBegin }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <Wrench className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-800" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Car Part Installer
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Get AI-powered installation instructions for any car part.
          Step-by-step guidance, tools needed, and video recommendations.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Select Your Car</h3>
            <p className="text-sm text-gray-600">Choose from hundreds of makes and models</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pick the Part</h3>
            <p className="text-sm text-gray-600">Tell us what you're installing</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Get Help</h3>
            <p className="text-sm text-gray-600">Receive detailed AI-powered instructions</p>
          </div>
        </div>

        <button
          onClick={onBegin}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold px-12 py-5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-xl shadow-blue-500/30 flex items-center gap-3 mx-auto"
        >
          Let's Begin
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
