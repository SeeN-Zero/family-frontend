import { z } from "zod";

export const profileSettingsSchema = z.object({
  username: z.string().trim().min(1, "USERNAME_WAJIB_DIISI").max(100, "USERNAME_TERLALU_PANJANG"),
});

export const appSettingsSchema = z.object({
  cycleStartDay: z.coerce.number().int().min(1, "CYCLE_START_DAY_MIN_1").max(25, "CYCLE_START_DAY_MAX_25"),
});

export type ProfileSettingsInput = z.input<typeof profileSettingsSchema>;
export type ProfileSettingsValues = z.output<typeof profileSettingsSchema>;
export type AppSettingsInput = z.input<typeof appSettingsSchema>;
export type AppSettingsValues = z.output<typeof appSettingsSchema>;
