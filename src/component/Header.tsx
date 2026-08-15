import { LucideIcon } from "lucide-react";

type HeaderProps = {
  title: string;
  icon?: LucideIcon;
  rightSlot?: React.ReactNode;
};

export default function Header({ title, icon: Icon, rightSlot }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full h-16 border-b border-dotted border-outline bg-background text-primary font-label-caps text-label-caps flex justify-between items-center px-margin-mobile md:px-margin-desktop z-50">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{title}</span>
      </div>

      {rightSlot && <div className="flex items-center">{rightSlot}</div>}
    </header>
  );
}