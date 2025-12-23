import { eq } from "drizzle-orm";
import { userSettings, InsertUserSettings } from "../drizzle/schema";
import { getDb } from "./db";

export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get settings: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const settings = result[0];
    return {
      themePreference: settings.themePreference as "light" | "dark" | "auto" | undefined,
      fontSize: settings.fontSize as "xs" | "sm" | "md" | "lg" | "xl" | undefined,
      lineSpacing: settings.lineSpacing as "compact" | "normal" | "expanded" | undefined,
      readingRemindersEnabled: settings.readingRemindersEnabled === 1 ? true : settings.readingRemindersEnabled === 0 ? false : undefined,
      readingReminderTime: settings.readingReminderTime ?? undefined,
      readingReminderDays: settings.readingReminderDays 
        ? JSON.parse(settings.readingReminderDays) 
        : undefined,
      readingGoalType: settings.readingGoalType as "weekly" | "monthly" | undefined,
      readingGoalTarget: settings.readingGoalTarget ?? undefined,
      nightModeEnabled: settings.nightModeEnabled === 1 ? true : settings.nightModeEnabled === 0 ? false : undefined,
      updatedAt: settings.updatedAt ? settings.updatedAt.getTime() : Date.now(),
    };
  } catch (error) {
    console.error("[Database] Failed to get settings:", error);
    return null;
  }
}

export async function saveUserSettings(userId: number, settings: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save settings: database not available");
    return;
  }

  try {
    const values: InsertUserSettings = {
      userId,
      themePreference: settings.themePreference ?? null,
      fontSize: settings.fontSize ?? null,
      lineSpacing: settings.lineSpacing ?? null,
      readingRemindersEnabled: settings.readingRemindersEnabled === true ? 1 : settings.readingRemindersEnabled === false ? 0 : null,
      readingReminderTime: settings.readingReminderTime ?? null,
      readingReminderDays: settings.readingReminderDays 
        ? JSON.stringify(settings.readingReminderDays) 
        : null,
      readingGoalType: settings.readingGoalType ?? null,
      readingGoalTarget: settings.readingGoalTarget ?? null,
      nightModeEnabled: settings.nightModeEnabled === true ? 1 : settings.nightModeEnabled === false ? 0 : null,
      updatedAt: new Date(),
    };

    await db
      .insert(userSettings)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          themePreference: values.themePreference,
          fontSize: values.fontSize,
          lineSpacing: values.lineSpacing,
          readingRemindersEnabled: values.readingRemindersEnabled,
          readingReminderTime: values.readingReminderTime,
          readingReminderDays: values.readingReminderDays,
          readingGoalType: values.readingGoalType,
          readingGoalTarget: values.readingGoalTarget,
          nightModeEnabled: values.nightModeEnabled,
          updatedAt: values.updatedAt,
        },
      });

    console.log("[Database] Settings saved successfully for user", userId);
  } catch (error) {
    console.error("[Database] Failed to save settings:", error);
    throw error;
  }
}
