import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppState, Language } from '/@/stores/modules/app/helper'
import { getLocalSetting, setLocalSetting } from '/@/stores/modules/app/helper'

export const useAppStore = defineStore('app-store', () => {
  const state = ref<AppState>(getLocalSetting())

  const setLanguage = (language: Language) => {
    if (state.value.language !== language) {
      state.value.language = language
      recordState()
    }
  }

  const recordState = () => {
    setLocalSetting(state.value)
  }

  return { state, setLanguage, recordState }
})


