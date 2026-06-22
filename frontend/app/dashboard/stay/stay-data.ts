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

export const stays = [
  {
    slug: "yeti-mountain-home",
    name: "Yeti Mountain Home",
    price: "NPR 18,500",
    image: "/stay1.png",
    distance: "0.3 km from Poon Hill Trail",
    description:
      "Khumbu Region. A pinnacle of comfort at 3,800m featuring heated beds, gourmet cuisine,",
    experience:
      "Awaken to panoramic views of Everest and Ama Dablam. This legendary lodge offers the comfort of high-end hospitality at the roof of the world. Experience authentic Sherpa warmth combined with modern luxuries.",
    amenities: [
      { label: "Hot Shower", icon: Bath },
      { label: "Wi-ai", icon: Wifi },
      { label: "Dal Bhat", icon: Soup },
      { label: "Charging", icon: Zap },
    ],
  },
  {
    slug: "ama-dablam-lodge",
    name: "Ama Dablam Lodge",
    price: "NPR 24,000",
    image: "/stay2.png",
    distance: "1.1 km from Everest Base Trail",
    description:
      "Everest Base. High-tech shelter with pressurized suites and a 24/7 expedition support",
    experience:
      "A refined mountain lodge built for trekkers who want warmth, reliability, and sweeping Himalayan views after long trail days.",
    amenities: [
      { label: "Heater", icon: Heater },
      { label: "Premium Stay", icon: Sparkles },
      { label: "Gear Storage", icon: Briefcase },
      { label: "Charging", icon: Zap },
    ],
  },
  {
    slug: "mustang-royal-retreat",
    name: "Mustang Royal Retreat",
    price: "NPR 14,500",
    image: "/stay3.png",
    distance: "0.8 km from Upper Mustang Route",
    description:
      "Upper Mustang. A bridge between tradition and luxury in the forbidden kingdom.",
    experience:
      "Stay close to Mustang's dramatic landscape with a quiet retreat inspired by local architecture, warm meals, and restful rooms.",
    amenities: [
      { label: "Hot Shower", icon: Bath },
      { label: "Dining", icon: Utensils },
      { label: "Dal Bhat", icon: Soup },
      { label: "Wi-ai", icon: Wifi },
    ],
  },
  {
    slug: "machapuchare-lodge",
    name: "Machapuchare Lodge",
    price: "NPR 9,800",
    image: "/stay4.png",
    distance: "0.5 km from Annapurna South Trail",
    description:
      "Annapurna South. Serene forest retreat with therapeutic hot springs and organic farm",
    experience:
      "A peaceful lodge surrounded by forest trails, warm meals, and views toward the sacred Machapuchare peak.",
    amenities: [
      { label: "Dal Bhat", icon: Soup },
      { label: "Heating", icon: Flame },
      { label: "Premium Stay", icon: Sparkles },
      { label: "Charging", icon: Zap },
    ],
  },
  {
    slug: "langtang-zenith",
    name: "Langtang Zenith",
    price: "NPR 21,000",
    image: "/stay5.png",
    distance: "0.9 km from Langtang Valley Trail",
    description:
      "Langtang Valley. An architectural marvel perched at 4,200m, offering unmatched",
    experience:
      "A high-altitude stay with dramatic valley views, warm hospitality, and practical comforts for serious trekkers.",
    amenities: [
      { label: "Premium Stay", icon: Sparkles },
      { label: "Heater", icon: Heater },
      { label: "Dining", icon: Utensils },
      { label: "Wi-ai", icon: Wifi },
    ],
  },
  {
    slug: "thorang-la-base",
    name: "Thorang La Base",
    price: "NPR 12,500",
    image: "/stay6.png",
    distance: "0.4 km from Thorong La Pass Route",
    description:
      "Annapurna Circuit. Essential high-altitude refuge for trekkers crossing the pass,",
    experience:
      "A dependable base stay designed for trekkers preparing for the Thorong La crossing with warm food and essential rest.",
    amenities: [
      { label: "Hot Shower", icon: Bath },
      { label: "Gear Storage", icon: Briefcase },
      { label: "Dal Bhat", icon: Soup },
      { label: "Charging", icon: Zap },
    ],
  },
];
