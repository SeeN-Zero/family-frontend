"use client";

import { KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ApiFamilyMember } from "@/hooks/types";

type UserRosterProps = {
  members: ApiFamilyMember[];
  isLoading?: boolean;
};

export default function UserRoster({
  members,
  isLoading = false,
}: UserRosterProps) {
  // Filter FATHER and MOTHER
  const parents = members.filter(
    (m) => m.title === "FATHER" || m.title === "MOTHER"
  );
  
  // Count children
  const childrenCount = members.filter((m) => m.title === "CHILD").length;

  // Display items: parents + children count row
  const displayItems = [
    ...parents,
    ...(childrenCount > 0
      ? [
          {
            memberId: "children-count",
            name: "TOTAL CHILD",
            email: "",
            role: "MEMBER" as const,
            title: "CHILD" as const,
            isCountRow: true,
            count: childrenCount,
          },
        ]
      : []),
  ];

  const hasFamily = members.length > 0;

  return (
    <section className="border border-primary p-6 flex flex-col h-full bg-background">
      <div className="font-label-caps text-label-caps text-primary mb-6 flex items-center justify-between">
        <span>FAMILY MEMBERS</span>
        <Link
          href="/settings?tab=family"
          className="text-on-surface-variant hover:text-primary transition-colors"
          title="Go to Family Settings"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-primary bg-surface-variant" />
                <div className="flex-grow">
                  <div className="h-4 bg-surface-variant w-32 mb-2" />
                  <div className="h-3 bg-surface-variant w-20" />
                </div>
              </div>
              {i < 3 && <div className="h-px w-full bg-outline-variant mt-4" />}
            </div>
          ))}
        </div>
      ) : !hasFamily ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <div className="text-on-surface-variant font-body-sm text-center">
            NO_FAMILY_MEMBERS
          </div>
          <Link
            href="/settings?tab=family"
            className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors"
          >
            FAMILY_SETTINGS
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayItems.map((member, index) => (
            <div key={member.memberId}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-primary bg-primary shrink-0">
                  <div className="w-full h-full flex items-center justify-center font-label-caps text-label-caps text-background">
                    {"isCountRow" in member && member.isCountRow
                      ? member.count.toString()
                      : member.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="font-body-lg text-body-lg text-primary uppercase">
                    {member.name}
                  </div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant">
                    {"isCountRow" in member && member.isCountRow
                      ? member.count.toString()
                      : member.title}
                  </div>
                </div>

                {member.role === "OWNER" && (
                  <KeyRound className="w-4 h-4 text-primary shrink-0" />
                )}
              </div>

              {index < displayItems.length - 1 && (
                <div className="h-px w-full bg-outline-variant mt-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

