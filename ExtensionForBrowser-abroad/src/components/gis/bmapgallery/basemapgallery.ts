
import GeoSenceConfig from '/@/config/GeoSenceConfig';
import ExaggerationElevationLayer from '/@/maputils/layers/ExaggerationElevationLayer';
 export async function switchbasemap(basemap:any,ViewContainer_type:any) {
   const view =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   const layers=view.map.basemap.baseLayers;
   layers.map((layer:any)=>{
      layer.id===basemap.layerEName?layer.visible=true: layer.visible=false
   })
}
 export async function setbasemaplayeropacity(opacity:any,ViewContainer_type:any) {
    const view =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   const layers=view.map.basemap.baseLayers;
   layers.map((layer:any)=>{
      layer.visible?layer.opacity=opacity:layer.opacity=1
   })
}

 export async function undergroundchange(isunderground:boolean,ViewContainer_type:any) {
   const view =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
    if(isunderground){
         view.map.ground.surfaceColor = null;
         view.map.ground.opacity = 1;
    }else{
        view.map.ground.surfaceColor = "#fff";
        view.map.ground.opacity = 0;
    }
}

export async function elevationchange(isElevation: boolean, ViewContainer_type: any, mapconfig: any, elevationExaggeration: number) {
   const view = GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   if (isElevation) {
      const exaggerationElevationLayer = new ExaggerationElevationLayer({
         id:'WorldElevation3D',
         exaggeration: elevationExaggeration,
         url: mapconfig.GISService.WorldElevation3D
      })
      view.map.ground.layers.add(exaggerationElevationLayer)
   } else {
      view.map.ground.layers.removeAll()
   }
}
export async function changeElevationexaggeration(elevationExaggeration: number, ViewContainer_type: any) {
   const view = GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   const layer =view.map.ground.layers.find((layer:any)=>layer.id==='WorldElevation3D')
   if (layer) {
      layer.exaggeration = elevationExaggeration;
   }
}
