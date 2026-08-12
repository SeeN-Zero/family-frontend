import { KeyRound } from "lucide-react";
import Image from "next/image";

type Member = {
  name: string;
  role: string;
  avatarUrl?: string;
  isAdmin?: boolean;
};

const MEMBERS: Member[] = [
  { name: "SENNA ANNABA AHMAD", role: "FATHER", isAdmin: true },
  { name: "SHAYIDA RACHIEMMA", role: "MOTHER", isAdmin: false },
  { name: "TOTAL CHILD", role: "3", isAdmin: false },
];

export default function UserRoster() {
  return (
    <section className="border border-primary p-6 flex flex-col h-full bg-background">
      <div className="font-label-caps text-label-caps text-primary mb-6">
        FAMILY MEMBERS
      </div>

      <div className="flex flex-col gap-4">
        {MEMBERS.slice(0, 3).map((member, index) => (
          <div key={member.name}>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 border border-primary p-0.5 group-hover:invert transition-all shrink-0">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    className="object-cover grayscale"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-variant" />
                )}
              </div>

              <div className="flex-grow">
                <div className="font-body-lg text-body-lg text-primary uppercase">
                  {member.name}
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">
                  {member.role}
                </div>
              </div>

              {member.isAdmin && (
                <KeyRound className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>

            {index < MEMBERS.length - 1 && (
              <div className="h-px w-full bg-outline-variant mt-4" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
