<template>
    <Map />
</template>

<script setup lang="ts">
import Map from '/@/views/gis/Map.vue'
import { onBeforeMount } from 'vue'
import setIntroduction from '/@/utils/setIconfont';
onBeforeMount(() => {
	setIntroduction.cssCdn();
	setIntroduction.jsCdn();
});
</script>
<style scoped>
</style>


