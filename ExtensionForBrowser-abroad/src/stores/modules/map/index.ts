import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MapState } from '/@/stores/modules/map/helper'
import { getLocalMapSetting, setLocalMapSetting } from '/@/stores/modules/map/helper'

export const useMapStore = defineStore('map-store', () => {
  const state = ref<MapState>(getLocalMapSetting())

  const setMainViewloaded = (loaded: boolean) => {
    if (state.value.MainViewloaded !== loaded) {
      state.value.MainViewloaded = loaded
      recordState()
    }
  }

  const setGeoSenceViewStatary = (loaded: boolean) => {
    if (state.value.GeoSenceViewStatary !== loaded) {
      state.value.GeoSenceViewStatary = loaded
      recordState()
    }
  }
  const setis3dmodel = (loaded: boolean) => {
    if (state.value.is3dmode !== loaded) {
      state.value.is3dmode = loaded
      recordState()
    }
  }

  const recordState = () => {
    setLocalMapSetting(state.value)
  }

  return { state, setMainViewloaded,setGeoSenceViewStatary,setis3dmodel, recordState }
})


