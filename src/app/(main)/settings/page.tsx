"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Users, AppWindow, X, Copy, Check, LogOut, Trash2, UserPlus } from "lucide-react";
import ConfirmDialog from "@/component/ConfirmDialog";
import {
  appSettingsSchema,
  profileSettingsSchema,
  type AppSettingsInput,
  type AppSettingsValues,
  type ProfileSettingsInput,
  type ProfileSettingsValues,
} from "@/features/settings/schemas";
import {
  createFamilySchema,
  joinFamilySchema,
  type CreateFamilyInput,
  type JoinFamilyInput,
} from "@/features/family/schemas";
import { useMyFamily, useFamilyMembers } from "@/hooks/useFamily";
import {
  useCreateFamily,
  useJoinFamily,
  useDeleteFamily,
  useLeaveFamily,
  useRemoveMember,
} from "@/hooks/useFamilyMutations";
import { useUserAccount, useUpdateUserAccount } from "@/hooks/useUserAccount";
import type { CreateFamilyRequest, JoinFamilyRequest, Title } from "@/hooks/types";

type TabId = "profile" | "family" | "app";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "PROFILE", icon: User },
  { id: "family", label: "FAMILY", icon: Users },
  { id: "app", label: "APP", icon: AppWindow },
];

const TITLE_LABELS: Record<Title, string> = {
  FATHER: "FATHER",
  MOTHER: "MOTHER",
  CHILD: "CHILD",
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center py-16">
          <div className="border-2 border-primary bg-surface p-8 text-primary font-label-caps text-label-caps uppercase tracking-wider">
            LOADING...
          </div>
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(tabParam || "profile");
  const [isSaved, setIsSaved] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  const { data: userAccount, isLoading: userLoading } = useUserAccount();
  const updateUserAccount = useUpdateUserAccount();
  const { data: family, isLoading: familyLoading } = useMyFamily();
  const { data: members = [], isLoading: membersLoading } = useFamilyMembers();
  const createFamily = useCreateFamily();
  const joinFamily = useJoinFamily();
  const deleteFamily = useDeleteFamily();
  const leaveFamily = useLeaveFamily();
  const removeMember = useRemoveMember();

  const profileForm = useForm<ProfileSettingsInput, unknown, ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: { username: "" },
  });

  // Populate form with user data
  useEffect(() => {
    if (userAccount) {
      profileForm.reset({ username: userAccount.name });
    }
  }, [userAccount, profileForm]);
  const appForm = useForm<AppSettingsInput, unknown, AppSettingsValues>({
    resolver: zodResolver(appSettingsSchema),
    defaultValues: { cycleStartDay: 1 },
  });
  const createFamilyForm = useForm<CreateFamilyInput, unknown, CreateFamilyRequest>({
    resolver: zodResolver(createFamilySchema),
    defaultValues: { name: "", title: "FATHER" },
  });
  const joinFamilyForm = useForm<JoinFamilyInput, unknown, JoinFamilyRequest>({
    resolver: zodResolver(joinFamilySchema),
    defaultValues: { inviteCode: "", title: "FATHER" },
  });

  const showSaved = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleProfileSave = (values: ProfileSettingsValues) => {
    updateUserAccount.mutate(
      { name: values.username },
      {
        onSuccess: () => {
          showSaved();
        },
      }
    );
  };

  const handleCreateFamily = (payload: CreateFamilyRequest) => {
    createFamily.mutate(payload, {
      onSuccess: () => {
        setShowCreateForm(false);
        createFamilyForm.reset();
      },
    });
  };

  const handleJoinFamily = (payload: JoinFamilyRequest) => {
    joinFamily.mutate(payload, {
      onSuccess: () => {
        setShowJoinForm(false);
        joinFamilyForm.reset();
      },
    });
  };

  const handleCopyInviteCode = () => {
    if (family?.inviteCode) {
      navigator.clipboard.writeText(family.inviteCode);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  const handleDeleteFamily = () => {
    if (family?.familyId) {
      deleteFamily.mutate(family.familyId, {
        onSuccess: () => setConfirmDelete(false),
      });
    }
  };

  const handleLeaveFamily = () => {
    leaveFamily.mutate(undefined, {
      onSuccess: () => setConfirmLeave(false),
    });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember.mutate(memberId, {
      onSuccess: () => setRemovingMember(null),
    });
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

                {userLoading ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-surface-variant w-24 animate-pulse" />
                      <div className="h-12 bg-surface-variant animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-surface-variant w-24 animate-pulse" />
                      <div className="h-12 bg-surface-variant animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileSave)}
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
                      disabled={userLoading}
                      className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        value={userAccount?.email || ""}
                        readOnly
                        className="w-full bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-outline focus:outline-none cursor-not-allowed pr-11"
                      />
                      
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={updateUserAccount.isPending || userLoading}
                      className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateUserAccount.isPending ? "SAVING..." : "SAVE_CHANGES"}
                    </button>
                  </div>
                </form>
                )}
              </div>
            )}

            {activeTab === "family" && (
              <div className="flex flex-col gap-5">
                {familyLoading ? (
                  <>
                    <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                      * FAMILY
                    </h4>
                    <div className="px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
                      LOADING...
                    </div>
                  </>
                ) : !family ? (
                  <>
                    <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                      * FAMILY
                    </h4>
                    <div className="px-4 py-8 text-center border border-outline-variant">
                      <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
                        YOU_ARE_NOT_IN_A_FAMILY_YET
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(true)}
                          className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer"
                        >
                          CREATE_FAMILY
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowJoinForm(true)}
                          className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        >
                          JOIN_FAMILY
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                      * FAMILY
                    </h4>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        FAMILY_NAME
                      </label>
                      <span className="font-display-lg text-display-lg text-primary">
                        {family.name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        YOUR_ROLE
                      </label>
                      <span className="font-body-lg text-body-lg text-primary uppercase">
                        {TITLE_LABELS[family.title]} ({family.role})
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        INVITE_CODE
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="font-display-lg text-display-lg text-primary">
                          {family.inviteCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyInviteCode}
                          className="flex items-center gap-2 border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        >
                          {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedInvite ? "COPIED" : "COPY"}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        MEMBERS ({members.length})
                      </label>
                      {membersLoading ? (
                        <div className="px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
                          LOADING_MEMBERS...
                        </div>
                      ) : members.length === 0 ? (
                        <div className="px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
                          NO_FAMILY_MEMBERS
                        </div>
                      ) : (
                        members.map((member) => (
                          <div
                            key={member.memberId}
                            className="flex items-center justify-between border border-outline-variant px-4 py-3 gap-4"
                          >
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <span className="font-body-lg text-body-lg text-primary">
                                {member.name}
                              </span>
                              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                                {TITLE_LABELS[member.title]}
                              </span>
                            </div>
                            {member.role === "OWNER" ? (
                              <span className="flex items-center gap-1 border border-primary px-2 py-1 font-label-caps text-label-caps text-primary uppercase tracking-wider shrink-0">
                                <UserPlus className="w-3 h-3" />
                                OWNER
                              </span>
                            ) : family.role === "OWNER" ? (
                              <button
                                type="button"
                                onClick={() => setRemovingMember(member.memberId)}
                                disabled={removeMember.isPending}
                                className="flex items-center gap-1 border border-outline-variant px-2 py-1 font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <X className="w-3 h-3" />
                                REMOVE
                              </button>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-1 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider shrink-0">
                                MEMBER
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-outline-variant">
                      {family.role === "OWNER" ? (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(true)}
                          disabled={deleteFamily.isPending}
                          className="flex items-center justify-center gap-2 border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          DELETE_FAMILY
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmLeave(true)}
                          disabled={leaveFamily.isPending}
                          className="flex items-center justify-center gap-2 border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <LogOut className="w-4 h-4" />
                          LEAVE_FAMILY
                        </button>
                      )}
                    </div>
                  </>
                )}
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

      {/* Create Family Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCreateForm(false)} />
          <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">CREATE_FAMILY</h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                disabled={createFamily.isPending}
                className="text-outline-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {createFamily.error && (
              <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider mb-6">
                * {createFamily.error.message}
              </p>
            )}
            <form onSubmit={createFamilyForm.handleSubmit(handleCreateFamily)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="create-family-name" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  FAMILY_NAME
                </label>
                <input
                  id="create-family-name"
                  type="text"
                  {...createFamilyForm.register("name")}
                  placeholder="e.g. Smith Family"
                  required
                  disabled={createFamily.isPending}
                  className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="create-family-title" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  YOUR_TITLE
                </label>
                <select
                  id="create-family-title"
                  {...createFamilyForm.register("title")}
                  required
                  disabled={createFamily.isPending}
                  className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-40"
                >
                  <option value="FATHER">FATHER</option>
                  <option value="MOTHER">MOTHER</option>
                  <option value="CHILD">CHILD</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={createFamily.isPending}
                  className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={createFamily.isPending}
                  className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {createFamily.isPending ? "CREATING..." : "CREATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Family Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowJoinForm(false)} />
          <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">JOIN_FAMILY</h3>
              <button
                type="button"
                onClick={() => setShowJoinForm(false)}
                disabled={joinFamily.isPending}
                className="text-outline-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {joinFamily.error && (
              <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider mb-6">
                * {joinFamily.error.message}
              </p>
            )}
            <form onSubmit={joinFamilyForm.handleSubmit(handleJoinFamily)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="join-invite-code" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  INVITE_CODE
                </label>
                <input
                  id="join-invite-code"
                  type="text"
                  {...joinFamilyForm.register("inviteCode")}
                  placeholder="e.g. ABCD1234EF"
                  maxLength={10}
                  required
                  disabled={joinFamily.isPending}
                  className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="join-family-title" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  YOUR_TITLE
                </label>
                <select
                  id="join-family-title"
                  {...joinFamilyForm.register("title")}
                  required
                  disabled={joinFamily.isPending}
                  className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-40"
                >
                  <option value="FATHER">FATHER</option>
                  <option value="MOTHER">MOTHER</option>
                  <option value="CHILD">CHILD</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  disabled={joinFamily.isPending}
                  className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={joinFamily.isPending}
                  className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {joinFamily.isPending ? "JOINING..." : "JOIN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Family Modal */}
      {confirmDelete && (
        <ConfirmDialog
          title="DELETE_FAMILY?"
          message="THIS_WILL_REMOVE_ALL_MEMBERS_AND_DELETE_THE_FAMILY_PERMANENTLY"
          confirmLabel="DELETE"
          cancelLabel="CANCEL"
          isPending={deleteFamily.isPending}
          errorMessage={deleteFamily.error?.message}
          onConfirm={handleDeleteFamily}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {/* Leave Family Modal */}
      {confirmLeave && (
        <ConfirmDialog
          title="LEAVE_FAMILY?"
          message="YOU_WILL_NO_LONGER_BE_PART_OF_THIS_FAMILY"
          confirmLabel="LEAVE"
          cancelLabel="CANCEL"
          pendingLabel="LEAVING..."
          isPending={leaveFamily.isPending}
          errorMessage={leaveFamily.error?.message}
          onConfirm={handleLeaveFamily}
          onCancel={() => setConfirmLeave(false)}
        />
      )}

      {/* Remove Member Modal */}
      {removingMember && (
        <ConfirmDialog
          title="REMOVE_MEMBER?"
          message="THIS_MEMBER_WILL_BE_REMOVED_FROM_THE_FAMILY"
          confirmLabel="REMOVE"
          cancelLabel="CANCEL"
          pendingLabel="REMOVING..."
          isPending={removeMember.isPending}
          errorMessage={removeMember.error?.message}
          onConfirm={() => handleRemoveMember(removingMember)}
          onCancel={() => setRemovingMember(null)}
        />
      )}
    </div>
  );
}
