import {
  Beef,
  Beer,
  Candy,
  CupSoda,
  Droplets,
  FlaskConical,
  Flame,
  GlassWater,
  Grape,
  Martini,
  Milk,
  Package,
  ShoppingBasket,
  SprayCan,
  Utensils,
  Wine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Beef,
  Beer,
  Candy,
  CupSoda,
  Droplets,
  FlaskConical,
  Flame,
  GlassWater,
  Grape,
  Martini,
  Milk,
  Package,
  ShoppingBasket,
  SprayCan,
  Utensils,
  Wine,
  Wrench,
  Zap,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Package;
  return <Icon className={className} strokeWidth={2} />;
}
