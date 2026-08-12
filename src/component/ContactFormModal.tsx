"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type {
  ApiContact,
  CreateContactRequest,
  UpdateContactRequest,
} from "@/hooks/types";

type ContactFormModalProps = {
  // Ada `contact` = mode edit (UpdateContactRequest), tanpa `contact` = mode
  // create (CreateContactRequest).
  contact?: ApiContact;
  isPending?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (payload: CreateContactRequest | UpdateContactRequest) => void;
};

export default function ContactFormModal({
  contact,
  isPending = false,
  errorMessage,
  onClose,
  onSubmit,
}: ContactFormModalProps) {
  const isEdit = Boolean(contact);
  const [name, setName] = useState(contact?.name ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [notes, setNotes] = useState(contact?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: CreateContactRequest = {
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            {isEdit ? "* EDIT_CONTACT" : "* NEW_CONTACT"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-outline-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider mb-6">
            * {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              NAME
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Budi Santoso"
              required
              maxLength={100}
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-phone"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                PHONE
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0812-3456-7890"
                maxLength={30}
                disabled={isPending}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                EMAIL
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. budi@mail.com"
                maxLength={255}
                disabled={isPending}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-notes"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              NOTES
            </label>
            <textarea
              id="contact-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Teman satu kantor"
              rows={3}
              maxLength={500}
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-40"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "SAVING..." : isEdit ? "UPDATE_CONTACT" : "CREATE_CONTACT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

