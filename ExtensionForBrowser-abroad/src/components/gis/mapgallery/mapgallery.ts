
import TileLayer from "@arcgis/core/layers/TileLayer";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"
import OpenStreetMapLayer from "@arcgis/core/layers/OpenStreetMapLayer";
import CSVLayer from "@arcgis/core/layers/CSVLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Extent from "@arcgis/core/geometry/Extent";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import GeoSenceConfig from '/@/config/GeoSenceConfig';
import Camera from "@arcgis/core/Camera";
import Legend from "@arcgis/core/widgets/Legend";
import { useMapStore } from '/@/stores/modules/map'
 export async function addlayertoMap(layer:any,ViewContainer_type:any) {
   const mapStore = useMapStore();
   const geosence =GeoSenceConfig.getGeoSenceView(ViewContainer_type)
   const maplayer=geosence.view.map.findLayerById(layer.id) 
   if(maplayer) {
     geosence.view.map.remove(maplayer) 
     return;
   }
   switch (layer.maptype) {
     case "TileLayer": 
       geosence.view.map.add(new TileLayer( {
           url:layer.url,
           id: layer.id,
           title: layer.title,
         }
       ));
       break;
      case "VectorTileLayer": 
       geosence.view.map.add(new VectorTileLayer( {
           url:layer.url,
           id: layer.id,
           title: layer.title,
         }
       ));
     break;
      case "CSVLayer": 
       geosence.view.map.add(new CSVLayer({
           url:layer.url,
           id: layer.id,
           title: layer.title,
           renderer: layer.renderer,
           popupTemplate: layer.template,
           labelingInfo: layer.renderer
         }
       ));
     break;
      case "OpenStreetMapLayer": 
      const osmLayer = new OpenStreetMapLayer({
          id: layer.id,
          title: layer.title,
      });
      geosence.view.map.add(osmLayer);
     break;
     case "MapImageLayer": 
     geosence.view.map.add(new MapImageLayer( {
           url:layer.url,
           id: layer.id,
           title: layer.title,
         }
       ));
        break;
     case "FeatureLayer": 
     if(layer.url){
       const flayer =new FeatureLayer({
           url:layer.url,
           id: layer.id,
           title: layer.title
         })
        geosence.view.map.add(flayer)
      }
     break;
     case "SceneLayer": 
     geosence.view.map.add(new SceneLayer( {
           url:layer.url,
           id: layer.id,
           title: layer.title,
         }
       ));
        break;
      case "GeoJSONLayer": 
        geosence.view.map.add(new GeoJSONLayer( {
            url: layer.url,
            id: layer.id,
            popupTemplate: layer.template,
            labelingInfo: layer.labelingInfo,
            renderer: layer.renderer
         }
       ));
        break;
   }
 }

 export async function removelayerfromMap(layer:any,ViewContainer_type:any) {
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   const maplayer=geosenceView.map.findLayerById(layer.id) 
   if(maplayer) {
     geosenceView.map.remove(maplayer)
   }
    if(layer.ElevationLayer&&layer.elevation_url){
      const  layers=  geosenceView.map.ground.layers.filter((item:any)=>{return item.id === layer.elevation_id})
      geosenceView.map.ground.layers.removeMany(layers)
    }
 }

 export async function changlayeropacity(layer:any,ViewContainer_type:any) {
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   const maplayer=geosenceView.map.findLayerById(layer.id)
    if(maplayer) {
     maplayer.opacity=layer.opacity
   }
 }

 export async function closeAllMaplayers(layers:any,ViewContainer_type:any) {
   const geosence=GeoSenceConfig.getGeoSenceView(ViewContainer_type)
     if( !layers.length) return;
      layers.map((layer:any)=> {
       const maplayer=geosence.view.map.findLayerById(layer.id) 
       if(maplayer) {
         geosence.view.map.remove(maplayer)
       }
       if(layer.ElevationLayer&&layer.elevation_url){
         const  layers=  geosence.view.map.ground.layers.filter((item:any)=>{return item.id === layer.elevation_id})
         geosence.view.map.ground.layers.removeMany(layers)
       }
     }
   )
   if(geosence.legend){
     geosence.view.ui.remove(geosence.legend)
     geosence.legend=null
   }
 }

 export async function setlayervisbile(layer:any,ViewContainer_type:any) {
  const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
    const maplayer=geosenceView.map.findLayerById(layer.id) 
      if(maplayer) {
         maplayer.visible=layer.visible
      }
 }
 