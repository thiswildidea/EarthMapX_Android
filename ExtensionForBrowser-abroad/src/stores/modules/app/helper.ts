import { ss } from '/@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Language = 'zh-cn' | 'en' 

export interface AppState {

  language: Language
}

export function defaultSetting(): AppState {
  return { language: 'en' }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
