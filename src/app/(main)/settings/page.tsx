"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Users, AppWindow, X, KeyRound, Mail } from "lucide-react";
import {
  appSettingsSchema,
  profileSettingsSchema,
  type AppSettingsInput,
  type AppSettingsValues,
  type ProfileSettingsInput,
  type ProfileSettingsValues,
} from "@/features/settings/schemas";

type TabId = "profile" | "family" | "app";

type FamilyMember = {
  id: string;
  name: string;
  title: string;
  role: string;
  isAdmin?: boolean;
};

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: "fm1", name: "SENNA ANNABA AHMAD", title: "FATHER", role: "ADMIN", isAdmin: true },
  { id: "fm2", name: "SHAYIDA RACHIEMMA", title: "MOTHER", role: "MEMBER" },
  { id: "fm3", name: "AHMAD FAUZAN", title: "CHILD", role: "MEMBER" },
];

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "PROFILE", icon: User },
  { id: "family", label: "FAMILY", icon: Users },
  { id: "app", label: "APP", icon: AppWindow },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [isSaved, setIsSaved] = useState(false);
  const profileForm = useForm<ProfileSettingsInput, unknown, ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: { username: "SENNA ANNABA AHMAD" },
  });
  const appForm = useForm<AppSettingsInput, unknown, AppSettingsValues>({
    resolver: zodResolver(appSettingsSchema),
    defaultValues: { cycleStartDay: 1 },
  });

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const showSaved = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          SETTINGS
        </h3>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex md:flex-col gap-2 md:w-48 shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border ${
                    activeTab === tab.id
                      ? "bg-primary text-background border-primary"
                      : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                    * PROFILE
                  </h4>
                  {isSaved && (
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                      SAVED
                    </span>
                  )}
                </div>

                <form
                  onSubmit={profileForm.handleSubmit(() => showSaved())}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="profile-username"
                      className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
                    >
                      USERNAME
                    </label>
                    <input
                      id="profile-username"
                      type="text"
                      {...profileForm.register("username")}
                      required
                      className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="profile-email"
                      className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
                    >
                      EMAIL
                    </label>
                    <div className="relative">
                      <input
                        id="profile-email"
                        type="email"
                        value="senna.annaba@gmail.com"
                        readOnly
                        className="w-full bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-outline focus:outline-none cursor-not-allowed pr-11"
                      />
                      <Mail className="w-4 h-4 text-outline absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-2">
                    <button
                      type="submit"
                      className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      SAVE_CHANGES
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "family" && (
              <div className="flex flex-col gap-5">
                <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                  * FAMILY
                </h4>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    INVITATION_CODE
                  </label>
                  <div className="border border-dashed border-primary px-4 py-3 flex items-center justify-between gap-3">
                    <span className="font-body-sm text-body-sm text-primary tracking-widest">
                      SEEN-FAM-2026
                    </span>
                    <KeyRound className="w-4 h-4 text-primary shrink-0" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    MEMBERS
                  </label>
                  <div className="border border-outline-variant divide-y divide-outline-variant">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 px-4 py-3"
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-primary shrink-0">
                          <span className="font-label-caps text-label-caps text-background">
                            {member.name.charAt(0)}
                          </span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-body-sm text-body-sm text-primary uppercase truncate">
                            {member.name}
                          </div>
                          <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                            {member.title} • {member.role}
                          </div>
                        </div>
                        {member.isAdmin ? (
                          <span className="flex items-center gap-1 font-label-caps text-label-caps text-primary uppercase tracking-wider shrink-0">
                            <KeyRound className="w-3 h-3" />
                            ADMIN
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="flex items-center gap-1 border border-outline-variant px-2 py-1 font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer shrink-0"
                          >
                            <X className="w-3 h-3" />
                            REMOVE
                          </button>
                        )}
                      </div>
                    ))}
                    {members.length === 0 && (
                      <div className="px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
                        NO_FAMILY_MEMBERS
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "app" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                    * APP
                  </h4>
                  {isSaved && (
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                      SAVED
                    </span>
                  )}
                </div>

                <form
                  onSubmit={appForm.handleSubmit(() => showSaved())}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-2 max-w-xs">
                    <label
                      htmlFor="app-cycle-day"
                      className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
                    >
                      CYCLE_START_DAY
                    </label>
                    <input
                      id="app-cycle-day"
                      type="number"
                      min={1}
                      max={25}
                      {...appForm.register("cycleStartDay", { valueAsNumber: true })}
                      required
                      className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                    />
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      START_DAY_OF_MONTHLY_CYCLE (1 - 25)
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-2">
                    <button
                      type="submit"
                      className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      SAVE_CHANGES
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}