import Image from "next/image";
import { LucideIcon } from "lucide-react";

type HeaderProps = {
  title: string;
  icon?: LucideIcon;
  showProfile?: boolean;
  avatarUrl?: string;
  rightSlot?: React.ReactNode;
};

export default function Header({
  title,
  icon: Icon,
  showProfile = false,
  avatarUrl,
  rightSlot,
}: HeaderProps) {
  return (
    <header className="fixed top-0 w-full h-16 border-b border-dotted border-outline bg-background text-primary font-label-caps text-label-caps flex justify-between items-center px-margin-mobile md:px-margin-desktop z-50">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{title}</span>
      </div>

      {rightSlot ? (
        <div className="flex items-center">{rightSlot}</div>
      ) : (
        showProfile && (
          <div className="w-8 h-8 border border-primary p-0.5 relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User avatar"
                fill
                className="object-cover grayscale"
              />
            ) : (
              <div className="w-full h-full bg-surface-variant" />
            )}
          </div>
        )
      )}
    </header>
  );
}