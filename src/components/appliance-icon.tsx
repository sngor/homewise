import { Thermometer, CookingPot, Waves, Tv, Wind, Microwave, Heater, Spline as DefaultApplianceIcon, Flame, Trash2, ChefHat } from 'lucide-react';
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
    case 'dryer':
        return <Wind {...iconProps} />;
    case 'dishwasher':
      return <Waves {...iconProps} />;
    case 'tv':
      return <Tv {...iconProps} />;
    case 'ac':
      return <Wind {...iconProps} />;
    case 'furnace':
        return <Flame {...iconProps} />;
    case 'microwave':
      return <Microwave {...iconProps} />;
    case 'water-heater':
      return <Heater {...iconProps} />;
    case 'garbage-disposal':
        return <Trash2 {...iconProps} />;
    case 'range-hood':
        return <ChefHat {...iconProps} />;
    case 'other':
    default:
      return <DefaultApplianceIcon {...iconProps} />;
  }
};
