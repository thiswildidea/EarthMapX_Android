<template>
  <div class="language-switcher">
    <el-dropdown @command="handleLanguageChange" trigger="click">
      <el-button type="primary" :icon="Operation" circle />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh-cn" :disabled="currentLocale === 'zh-cn'">
            <span>{{ $t('message.app.chinese') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="en" :disabled="currentLocale === 'en'">
            <span>{{ $t('message.app.english') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '/@/stores/modules/app'
import type { Language } from '/@/stores/modules/app/helper'
import { Operation } from '@element-plus/icons-vue'
const { locale } = useI18n()
const appStore = useAppStore()

const currentLocale = computed(() => locale.value)
const handleLanguageChange = (lang: string) => {
  locale.value = lang
  appStore.setLanguage(lang as Language)
}

// Load saved locale on mount
onMounted(() => {
  locale.value = appStore.state.language
})
</script>

<style scoped>
.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}
</style>

