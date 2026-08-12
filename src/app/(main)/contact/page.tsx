"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Phone,
  Mail,
  StickyNote,
} from "lucide-react";
import ContactFormModal from "@/component/ContactFormModal";
import ConfirmDialog from "@/component/ConfirmDialog";
import { useContacts } from "@/hooks/useContacts";
import {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/hooks/useContactMutations";
import type {
  ApiContact,
  CreateContactRequest,
  UpdateContactRequest,
} from "@/hooks/types";

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ApiContact | null>(null);
  const [deletingContact, setDeletingContact] = useState<ApiContact | null>(
    null
  );

  // TanStack Query: daftar kontak dari GET /api/v1/contacts.
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useContacts();

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const mutationError =
    createContact.error ?? updateContact.error ?? deleteContact.error;

  // Dipakai untuk mode create (tanpa editingContact) maupun edit.
  const handleSubmit = (
    payload: CreateContactRequest | UpdateContactRequest
  ) => {
    if (editingContact) {
      updateContact.mutate(
        {
          contactId: editingContact.contactId,
          payload: payload as UpdateContactRequest,
        },
        { onSuccess: () => setEditingContact(null) }
      );
    } else {
      createContact.mutate(payload as CreateContactRequest);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingContact) return;
    deleteContact.mutate(deletingContact.contactId, {
      onSuccess: () => setDeletingContact(null),
    });
  };

  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              CONTACT_MANAGEMENT
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              NEW_CONTACT
            </button>
          </div>

          {(error || mutationError) && (
            <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider">
              *{" "}
              {error?.message ??
                mutationError?.message ??
                "GAGAL_MEMUAT_KONTAK"}
            </p>
          )}

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b border-dotted border-outline-variant">
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    NAME
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    PHONE
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    EMAIL
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    NOTE
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-primary">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      LOADING_CONTACTS...
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr
                      key={contact.contactId}
                      className="hover:bg-surface-variant transition-colors border-b border-dotted border-outline-variant last:border-b-0"
                    >
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-primary">
                            <User className="w-4 h-4 text-background" />
                          </span>
                          {contact.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-on-surface-variant" />
                          {contact.phone || "-"}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-on-surface-variant" />
                          {contact.email || "-"}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell truncate max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-on-surface-variant shrink-0" />
                          {contact.notes || "-"}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingContact(contact)}
                            disabled={updateContact.isPending}
                            title="EDIT_CONTACT"
                            className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingContact(contact)}
                            disabled={deleteContact.isPending}
                            title="DELETE_CONTACT"
                            className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!isLoading && contacts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      NO_CONTACTS
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ContactFormModal
          isPending={createContact.isPending}
          errorMessage={createContact.error?.message}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {editingContact && (
        <ContactFormModal
          contact={editingContact}
          isPending={updateContact.isPending}
          errorMessage={updateContact.error?.message}
          onClose={() => setEditingContact(null)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingContact && (
        <ConfirmDialog
          title="* DELETE_CONTACT"
          message={`Hapus kontak "${deletingContact.name}"? Tindakan ini permanen.`}
          confirmLabel="DELETE"
          cancelLabel="CANCEL"
          isPending={deleteContact.isPending}
          errorMessage={deleteContact.error?.message}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingContact(null)}
        />
      )}
    </>
  );
}

