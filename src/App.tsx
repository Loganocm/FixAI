import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { CarInfoForm } from './components/CarInfoForm';
import { ChatInterface } from './components/ChatInterface';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

interface CarInfo {
  carMake: string;
  carModel: string;
  carYear: number;
  partName: string;
  partArticle?: string;
  isCustomPart: boolean;
}

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial Data Check & Sync
  useEffect(() => {
    async function initializeData() {
      try {
        // Check if we have any makes
        const { count, error } = await supabase
          .from('car_makes')
          .select('*', { count: 'exact', head: true });

        if (!error && (count === null || count === 0)) {
           console.log("Database empty. Triggering initial sync...");
           // Trigger sync
           await supabase.functions.invoke('sync-car-data');
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsInitializing(false);
      }
    }

    initializeData();
  }, []);

  const handleBegin = () => {
    setHasStarted(true);
  };

  const handleCarInfoSubmit = (info: CarInfo) => {
    setCarInfo(info);
  };

  const handleBack = () => {
    setCarInfo(null);
  };

  if (isInitializing) {
     return (
         <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
             <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                 <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                 <p className="text-gray-600 font-medium">Initializing car database...</p>
                 <p className="text-xs text-gray-400">This only happens once.</p>
             </div>
         </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!hasStarted ? (
        <WelcomePage onBegin={handleBegin} />
      ) : !carInfo ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <CarInfoForm onSubmit={handleCarInfoSubmit} />
        </div>
      ) : (
        <ChatInterface carInfo={carInfo} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
