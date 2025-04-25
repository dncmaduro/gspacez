import { ISettings } from '../hooks/interface'

type UpdateSettingsType = 'FEED' | 'DISPLAY_MODE'

export const updateSettingsFields = (
  type: UpdateSettingsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  currentSettings: ISettings
): ISettings => {
  switch (type) {
    case 'FEED':
      return { ...currentSettings, feedSettings: { ...value } }
    case 'DISPLAY_MODE':
      return { ...currentSettings, displayMode: { ...value } }
  }
}
