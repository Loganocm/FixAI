import { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { CarMakeStep } from './steps/CarMakeStep';
import { CarModelStep } from './steps/CarModelStep';
import { CarYearStep } from './steps/CarYearStep';
import { PartNameStep } from './steps/PartNameStep';

interface CarInfoFormProps {
  onSubmit: (carInfo: {
    carMake: string;
    carModel: string;
    carYear: number;
    partName: string;
    partArticle?: string;
    isCustomPart: boolean;
  }) => void;
}

export function CarInfoForm({ onSubmit }: CarInfoFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [partName, setPartName] = useState('');
  const [partArticle, setPartArticle] = useState('');
  const [isCustomPart, setIsCustomPart] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    onSubmit({
      carMake,
      carModel,
      carYear: parseInt(carYear),
      partName,
      partArticle,
      isCustomPart,
    });
  };

  const handlePartChange = (part: string, article?: string, custom?: boolean) => {
    setPartName(part);
    setPartArticle(article || '');
    setIsCustomPart(custom || false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {currentStep === 1 && (
        <CarMakeStep
          value={carMake}
          onChange={setCarMake}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <CarModelStep
          value={carModel}
          onChange={setCarModel}
          onNext={handleNext}
          onBack={handleBack}
          carMake={carMake}
        />
      )}

      {currentStep === 3 && (
        <CarYearStep
          value={carYear}
          onChange={setCarYear}
          onNext={handleNext}
          onBack={handleBack}
          carMake={carMake}
          carModel={carModel}
        />
      )}

      {currentStep === 4 && (
        <PartNameStep
          value={partName}
          onChange={handlePartChange}
          onSubmit={handleSubmit}
          onBack={handleBack}
          carMake={carMake}
          carModel={carModel}
          carYear={carYear}
        />
      )}
    </div>
  );
}
