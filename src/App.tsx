import { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { CarInfoForm } from './components/CarInfoForm';
import { ChatInterface } from './components/ChatInterface';

interface CarInfo {
  carMake: string;
  carModel: string;
  carYear: number;
  partName: string;
}

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);

  const handleBegin = () => {
    setHasStarted(true);
  };

  const handleCarInfoSubmit = (info: CarInfo) => {
    setCarInfo(info);
  };

  const handleBack = () => {
    setCarInfo(null);
  };

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
