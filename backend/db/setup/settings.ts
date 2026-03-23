import { Settings } from '../models/settings.js';

interface RequiredSetting {
  key: string;
  value: unknown;
}

const requiredSettings: RequiredSetting[] = [
  {
    key: 'question_intentions',
    value: [
      { id: 'question', label: 'Question', active: true },
      { id: 'discussion', label: 'Discussion', active: true },
      { id: 'information', label: 'Information', active: true },
    ],
  },
  {
    key: 'maintenance',
    value: { isMaintenanceMode: false },
  },
];

export async function ensurePlatformSettings(): Promise<void> {
  for (const setting of requiredSettings) {
    const existing = await Settings.findOne({ key: setting.key });
    if (!existing) {
      await Settings.create(setting);
      console.log(`[Setup] Created setting: ${setting.key}`);
    }
  }
}
