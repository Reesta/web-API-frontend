import {
  Bath,
  Briefcase,
  Flame,
  Heater,
  Soup,
  Sparkles,
  Utensils,
  Wifi,
  Zap,
} from "lucide-react";

const amenityIcons = {
  "Hot Shower": Bath,
  Wifi,
  "Wi-ai": Wifi,
  "Dal Bhat": Soup,
  Charging: Zap,
  Heater,
  Heating: Flame,
  "Premium Stay": Sparkles,
  "Gear Storage": Briefcase,
  Dining: Utensils,
};

export function getAmenityIcon(label: string) {
  return amenityIcons[label as keyof typeof amenityIcons] || Sparkles;
}

export const amenityOptions = [
  "Hot Shower",
  "Wifi",
  "Dal Bhat",
  "Charging",
  "Heater",
  "Heating",
  "Premium Stay",
  "Gear Storage",
  "Dining",
];
