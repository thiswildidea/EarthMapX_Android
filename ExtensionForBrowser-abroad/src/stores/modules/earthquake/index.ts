import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Earthquake {
  id: string
  magnitude: number
  time: number
  longitude: number
  latitude: number
  depth: number
  place: string
}

export const useEarthquakeStore = defineStore('earthquake', () => {
  const earthquakes = ref<Earthquake[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchEarthquakes = async () => {
    loading.value = true
    error.value = null
    
    try {
      // USGS Real-time Earthquake Data API
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      const data = await response.json()
      
      earthquakes.value = data.features.map((feature: any) => ({
        id: feature.id,
        magnitude: feature.properties.mag || 0,
        time: feature.properties.time,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        depth: feature.geometry.coordinates[2] || 0,
        place: feature.properties.place || ''
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch earthquake data'
      console.error('Error fetching earthquakes:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    earthquakes,
    loading,
    error,
    fetchEarthquakes
  }
})


