export type SettingsValue =
  | string
  | number
  | boolean
  | null
  | SettingsValue[]
  | { [key: string]: SettingsValue };

export interface SettingsFormModel {
  settingKey: string;
  settingValue: SettingsValue;
  recordStatusId: number;
}

export interface SettingsModel extends SettingsFormModel {
  id: number;
}
