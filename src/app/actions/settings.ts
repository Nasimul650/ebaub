'use server';

import { updateAdminSiteSettings, type SettingsActionResult } from './adminSettings';
import { updateUserPreferences as _updateUserPreferences } from './userPreferences';
import { updateSystemConfig as _updateSystemConfig } from './systemConfig';

export type { SettingsActionResult };

export async function updateSiteSettings(
  pageId: string,
  payload: Record<string, any>
): Promise<SettingsActionResult> {
  return updateAdminSiteSettings(pageId, payload);
}

export async function updateUserPreferences(preferences: Record<string, any>) {
  return _updateUserPreferences(preferences);
}

export async function updateSystemConfig(configKey: string, configValue: any) {
  return _updateSystemConfig(configKey, configValue);
}
