import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from "@arcgis/core/geometry/Point";
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import GeoSenceConfig from '/@/config/GeoSenceConfig';

// Locate Service Class
class LocateService {
  private locateLayer: GraphicsLayer | null = null;
  private locateGraphic: Graphic | null = null;
  private watchPositionId: number | null = null;
  private viewContainerType: string;

  constructor(viewContainerType: string) {
    this.viewContainerType = viewContainerType;
  }

  // Start Locate
  startLocate(): void {
    const geosenceView = GeoSenceConfig.getGeoSenceView(this.viewContainerType);
    if(!geosenceView || !geosenceView.view) return;
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error("Browser does not support geolocation functionality");
      return;
    }
    
    // Create locate layer
    if(!this.locateLayer){
      this.locateLayer = new GraphicsLayer({ id: "locateLayer" });
      geosenceView.view.map.add(this.locateLayer);
    }
    
    // Clear old locate marker
    if(this.locateGraphic){
      this.locateLayer.remove(this.locateGraphic);
      this.locateGraphic = null;
    }
    
    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.updateLocateGraphic(position.coords.latitude, position.coords.longitude, geosenceView.view);
      },
      (error) => {
        console.error("Failed to get location:", error);
      },
      {
        enableHighAccuracy: true, // Enable high accuracy
        timeout: 5000, // Timeout 10 seconds
        maximumAge: 0 // No cached position
      }
    );
    
    // Start real-time location updates
    this.watchPositionId = navigator.geolocation.watchPosition(
      (position) => {
        this.updateLocateGraphic(position.coords.latitude, position.coords.longitude, geosenceView.view);
      },
      (error) => {
        console.error("Real-time location update failed:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  // Stop Locate
  stopLocate(): void {
    // Clear real-time location watch
    if(this.watchPositionId !== null){
      navigator.geolocation.clearWatch(this.watchPositionId);
      this.watchPositionId = null;
    }
    
    // Clear locate marker and layer
    if(this.locateGraphic && this.locateLayer){
      this.locateLayer.remove(this.locateGraphic);
      this.locateGraphic = null;
    }
    
    if(this.locateLayer){
      const geosenceView = GeoSenceConfig.getGeoSenceView(this.viewContainerType);
      if(geosenceView && geosenceView.view){
        geosenceView.view.map.remove(this.locateLayer);
      }
      this.locateLayer = null;
    }
  }

  // Update locate marker
  private updateLocateGraphic(latitude: number, longitude: number, view: any): void {
    // Create point geometry
    const point = new Point({
      longitude: longitude,
      latitude: latitude,
      spatialReference: SpatialReference.WGS84
    });
    
    // Create locate marker symbol
    const locateSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2
      },
      size: 12
    };
    
    // Create locate marker
    const graphic = new Graphic({
      geometry: point,
      symbol: locateSymbol as any
    });
    
    // Clear old marker
    if(this.locateGraphic && this.locateLayer){
      this.locateLayer.remove(this.locateGraphic);
    }
    
    // Add new marker
    if(this.locateLayer){
      this.locateLayer.add(graphic);
      this.locateGraphic = graphic;
    }
    
    // Zoom view to locate position
    view.goTo({
      target: point,
      zoom: 15
    });
  }
}

// Export locate service factory function
export const createLocateService = (viewContainerType: string): LocateService => {
  return new LocateService(viewContainerType);
};