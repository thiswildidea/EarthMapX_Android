<template>
  <div class="map-container">
    <!-- <LanguageSwitcher />
    <el-button
      type="primary"
      size="mini"
      class="test"
    >
    <SvgIcon name="elementSearch" />
     <span class="esri-icon-home"></span>
     {{ $t('message.app.research') }}
    </el-button> -->
    <div id="MainScreen_ViewDiv_geosence" class="map-view"></div>
    <Bmapgallery id="MainScreen_Bmapgallery" ViewContainer_type='MainScreen' v-show="isMainMapUIVisible"></Bmapgallery> 
    <Mapgallery  id="MainScreen_Mapgallery"   ViewContainer_type='MainScreen' v-show="isMainMapUIVisible" ></Mapgallery> 
    <Maptoolbar  id="MainScreen_Maptoolbar"  ViewContainer_type='MainScreen' v-show="isMainMapUIVisible"></Maptoolbar>
    <Donatetoolbar  id="MainScreen_Donate"  ViewContainer_type='MainScreen' v-show="isMainMapUIVisible"></Donatetoolbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,watch,computed} from 'vue'
import Bmapgallery from '/@/components/gis/bmapgallery/index.vue';
import Maptoolbar from '/@/components/gis/maptoolbar/index.vue';
import Donatetoolbar from '/@/components/gis/donate/index.vue';
import {get_mapconfig} from "/@/api/map/index"
import LanguageSwitcher from '/@/components/LanguageSwitcher.vue'
import GeoSenceConfig from '/@/config/GeoSenceConfig';
import GeoSenceView from '/@/maputils/GeoSenceView';
import { useMapStore } from '/@/stores/modules/map'

const mapStore = useMapStore()
let mapconfig:any =null
let MainViewContainer= GeoSenceConfig.Main_ViewContainer_Type
const isMainMapUIVisible= ref<boolean>(false);
const initializeMap = async() => {

  mapStore.setMainViewloaded(false)
  const MainView= new GeoSenceView(MainViewContainer,{
           mapconfig:mapconfig,
           is3dmode:mapStore.state.is3dmode
         }) 
    await MainView.initView()
    GeoSenceConfig.replaceGeoSenceView(MainView)
}
// const isMainMapUIVisible = computed(() => mapStore.state.MainViewloaded)
watch(()=>mapStore.state.MainViewloaded, (val:any) => {
    isMainMapUIVisible.value = val; 
},{ deep: true });
watch(()=>mapStore.state.is3dmode, async(val:any) => {
		 mapStore.setMainViewloaded(false)
     const MainView= new GeoSenceView(MainViewContainer,{
       mapconfig:mapconfig,
       is3dmode:mapStore.state.is3dmode
     }) 
     await MainView.initView()
       GeoSenceConfig.replaceGeoSenceView(MainView)
	   },{deep: true}
);
onMounted(async() => {
  mapconfig = await get_mapconfig()
  initializeMap()
})

onUnmounted(() => {
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.map-view {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}
.test {
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 100;
}
</style>
