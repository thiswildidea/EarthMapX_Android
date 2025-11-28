import { ss } from '/@/utils/storage'

const LOCAL_NAME = 'MapSetting'



export interface MapState {
  GeoSenceViewStatary: boolean
  MainViewloaded: boolean
  is3dmode:boolean
}

export function defaultMapSetting(): MapState {
  return { MainViewloaded: false, GeoSenceViewStatary:false,is3dmode:false}
}

export function getLocalMapSetting(): MapState {
  const localSetting: MapState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultMapSetting(), ...localSetting }
}

export function setLocalMapSetting(setting: MapState): void {
  ss.set(LOCAL_NAME, setting)
}
