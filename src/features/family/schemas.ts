import { z } from "zod";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label}_WAJIB_DIISI`);

export const titleSchema = z.enum(["FATHER", "MOTHER", "CHILD"]);
export const roleSchema = z.enum(["OWNER", "MEMBER"]);

export const createFamilySchema = z.object({
  name: requiredString("FAMILY_NAME").max(30, "FAMILY_NAME_TERLALU_PANJANG"),
  title: titleSchema,
});

export const joinFamilySchema = z.object({
  inviteCode: requiredString("INVITE_CODE").max(10, "INVITE_CODE_TIDAK_VALID"),
  title: titleSchema,
});

export type Title = z.infer<typeof titleSchema>;
export type Role = z.infer<typeof roleSchema>;
export type CreateFamilyInput = z.input<typeof createFamilySchema>;
export type CreateFamilyRequest = z.output<typeof createFamilySchema>;
export type JoinFamilyInput = z.input<typeof joinFamilySchema>;
export type JoinFamilyRequest = z.output<typeof joinFamilySchema>;
