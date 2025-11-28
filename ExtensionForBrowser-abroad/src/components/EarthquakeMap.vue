<template>
  <div class="earthquake-map-container">
    <LanguageSwitcher />
    <el-button
      type="primary"
      size="mini"
      class="test"
    >
    <SvgIcon name="elementSearch" />
     <span class="esri-icon-home"></span>
     {{ $t('message.app.research') }}
    </el-button>
    <div ref="mapContainer" class="map-view"></div>
    <div v-if="loading" class="loading-overlay">
      <el-loading :text="$t('message.app.loading')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import Point from '@arcgis/core/geometry/Point'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import { useEarthquakeStore, type Earthquake } from '/@/stores'
import LanguageSwitcher from './LanguageSwitcher.vue'
import TileLayer from '@arcgis/core/layers/TileLayer';
const mapContainer = ref<HTMLDivElement>()
let map: Map | null = null
let view: MapView | null = null
let graphicsLayer: GraphicsLayer | null = null

const earthquakeStore = useEarthquakeStore()
const { loading } = earthquakeStore

const initializeMap = async () => {
  esriConfig.assetsPath = getAssetBasePath();
  if (!mapContainer.value) return

  // Create map with basemap
  map = new Map({
    basemap: 'streets-vector'
  })
 const tileLayer = new TileLayer({
      url: 'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Earth_at_Night_WM/MapServer'
    });
    map.add(tileLayer);
  // Create map view
  view = new MapView({
    container: mapContainer.value,
    map: map,
    center: [0, 20], // Center on world
    zoom: 2
  })

  // Create graphics layer for earthquake points
  graphicsLayer = new GraphicsLayer()
  map.add(graphicsLayer)

  // Load earthquake data
  await loadEarthquakeData()
}
// 修复函数定义语法错误：添加 = 并修正返回类型位置
const getAssetBasePath = (): string => {
  // 使用相对路径，避免某些场景下 chrome-extension:// 绝对路径受 WER 影响
  return 'assets';
}
const loadEarthquakeData = async () => {
  await earthquakeStore.fetchEarthquakes()
  
  if (!graphicsLayer || !view) return

  // Clear existing graphics
  graphicsLayer.removeAll()

  // Create graphics for each earthquake
  earthquakeStore.earthquakes.forEach((earthquake: Earthquake) => {
    if (!view || !graphicsLayer) return
    
    const point = new Point({
      longitude: earthquake.longitude,
      latitude: earthquake.latitude,
      spatialReference: view.spatialReference
    })

    // Create symbol based on magnitude
    const symbol = createSymbol(earthquake.magnitude)

    // Create graphic
    const graphic = new Graphic({
      geometry: point,
      symbol: symbol,
      attributes: {
        magnitude: earthquake.magnitude,
        time: earthquake.time,
        place: earthquake.place,
        depth: earthquake.depth
      }
    })

    graphicsLayer.add(graphic)
  })
}

const createSymbol = (magnitude: number): SimpleMarkerSymbol => {
  // Determine size based on magnitude
  let size = 8
  let color = [255, 255, 0, 0.8] // Yellow

  if (magnitude >= 7) {
    size = 30
    color = [255, 0, 0, 0.9] // Red
  } else if (magnitude >= 6) {
    size = 24
    color = [255, 128, 0, 0.9] // Orange
  } else if (magnitude >= 5) {
    size = 20
    color = [255, 192, 0, 0.9] // Orange-Yellow
  } else if (magnitude >= 4) {
    size = 16
    color = [255, 255, 0, 0.9] // Yellow
  } else if (magnitude >= 3) {
    size = 12
    color = [128, 255, 0, 0.9] // Yellow-Green
  } else {
    size = 8
    color = [0, 255, 0, 0.8] // Green
  }

  return new SimpleMarkerSymbol({
    style: 'circle',
    color: color,
    size: size,
    outline: {
      color: [0, 0, 0, 0.8],
      width: 1
    }
  })
}

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (view) {
    view.destroy()
  }
})
</script>

<style scoped>
.earthquake-map-container {
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

