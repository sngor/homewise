import { Thermometer, CookingPot, Waves, Tv, Wind, Spline as DefaultApplianceIcon } from 'lucide-react';
import type { Appliance } from '@/lib/types';

export const ApplianceIcon = ({ type, className }: { type: Appliance['type'], className?: string }) => {
  const iconProps = { className: className || "w-6 h-6" };
  switch (type) {
    case 'refrigerator':
      return <Thermometer {...iconProps} />;
    case 'oven':
      return <CookingPot {...iconProps} />;
    case 'washer':
      return <Waves {...iconProps} />;
    case 'dishwasher':
      return <Waves {...iconProps} />;
    case 'tv':
      return <Tv {...iconProps} />;
    case 'ac':
      return <Wind {...iconProps} />;
    case 'other':
    default:
      return <DefaultApplianceIcon {...iconProps} />;
  }
};
