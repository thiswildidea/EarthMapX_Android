import IGeoSenceViewOptions  from '/@/maputils//IGeoSenceViewOptions';
import GeoSenceViewBase  from '/@/maputils/GeoSenceViewBase';
import GeoSenceConfig from '/@/config/GeoSenceConfig';
import Map from "@arcgis/core/Map";
import Basemap from "@arcgis/core/Basemap";
import * as urlUtils from "@arcgis/core/core/urlUtils";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import SceneView from "@arcgis/core/views/SceneView";
import MapView from "@arcgis/core/views/MapView";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import ExaggerationElevationLayer from '/@/maputils/layers/ExaggerationElevationLayer';
import Extent from "@arcgis/core/geometry/Extent";
import Zoom from "@arcgis/core/widgets/Zoom";
import Compass from "@arcgis/core/widgets/Compass";
import Home from "@arcgis/core/widgets/Home";
import LayerList from "@arcgis/core/widgets/LayerList";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import Expand from "@arcgis/core/widgets/Expand";
import esriConfig from "@arcgis/core/config";
import Camera from "@arcgis/core/Camera";
import TileLayer from "@arcgis/core/layers/TileLayer";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import {init3DBaseMaplayers,initalGroupAndlayers} from '/@/maputils/utils';

import { useMapStore } from '/@/stores/modules/map'
export default class GeoSenceView extends GeoSenceViewBase{
    
    constructor(viewcontainerType: string, options: IGeoSenceViewOptions) {
       super(options)
       this.view_Type_Name=viewcontainerType
       this.mapStore= useMapStore()
    }

    public async initView(){
      // esriConfig.request.interceptors?.push({before:  (params)=> {params.requestOptions.headers = {'Referer':'ywyang',"Authorization": this.maptoken};return params;}})
      if (this.mapconfig.proxyConifg.useProxy) {
           this.mapconfig.proxyConifg.httpsDomains.map(function(item:any, key:any, ary:any) {
              urlUtils.addProxyRule({
                proxyUrl: item.proxyurl,
                urlPrefix: item.domainName
              })
            })
       }
      esriConfig.geometryServiceUrl = this.mapconfig.GISService.geometryService
      esriConfig.assetsPath =GeoSenceConfig.assetsPath;
      // esriConfig.fontsUrl =GeoSenceConfig.fontsUrl;
      if (this.mapconfig.GISService.baseMapServices.isToken) {
         IdentityManager.registerToken({
            server: this.mapconfig.GISService.baseMapServices.serverurl,
            token: this.maptoken,
           ssl :false
         })
       }
        const basemaplayers = await init3DBaseMaplayers(this.mapconfig.GISService.baseMapServices.layers)
        const bmap = new Basemap({
           baseLayers: basemaplayers,
           title: '底图',
           id: 'basemap'
        })
        const map = new Map({
          basemap: bmap,
           ground: {
              surfaceColor: this.mapconfig.surfaceColor
          }
        })
       if(this.is3dmode){
         const exaggerationElevationLayer = new ExaggerationElevationLayer({
                 id:'WorldElevation3D', 
                 exaggeration: 50,
                 url: this.mapconfig.GISService.WorldElevation3D
              })
          map.ground.layers.add(exaggerationElevationLayer)
         const camera = new Camera({
         fov:this.mapconfig.initcamera.fov,
         heading: this.mapconfig.initcamera.heading,
         position: {
           x: this.mapconfig.initcamera.x,
           y: this.mapconfig.initcamera.y,
           z: this.mapconfig.initcamera.z,
           spatialReference: SpatialReference.WebMercator
         },
         tilt: this.mapconfig.initcamera.tilt
       });
        this.view = new SceneView({
            qualityProfile:"high",
            viewingMode:"global",
            spatialReference: SpatialReference.WebMercator,
            container: this.view_Type_Name+this.view_Conatiner_Common,
            map: map,
            // camera:camera,
            constraints:{
               altitude: {
                max:this.mapconfig.initcamera.constraints.altitude.max
             }
            }
       });
     }else{
       const initextent = new Extent({
          xmin: this.mapconfig.initextent.xmin,
          ymin: this.mapconfig.initextent.ymin,
          xmax: this.mapconfig.initextent.xmax,
          ymax: this.mapconfig.initextent.ymax,
          spatialReference: {
            wkid: 102100
          }
        })
         this.view=new MapView({
           spatialReference: SpatialReference.WebMercator,
            container: this.view_Type_Name+this.view_Conatiner_Common,
            // extent:initextent,
            map: map,
            zoom:this.mapconfig.initextent.zoom,
            constraints:{
              minZoom:this.mapconfig.initextent.constraints.minZoom,
              maxZoom:this.mapconfig.initextent.constraints.maxZoom
            }
         })
     }
       this.view.ui.empty('top-left')
       this.view.ui.empty('top-right')
       this.view.ui.empty('bottom-left')
       this.view.ui.empty('bottom-right')
    //   const layerlistWidget = new LayerList({
    //   container: document.createElement('div'),
    //     id: 'maplayerlist',
    //      view: this.view
    //  })
    //   this.view.ui.add(layerlistWidget, 'bottom-left')
       this.view.ui.add(this.view_Type_Name+"_"+'Bmapgallery', 'bottom-right')
       this.view.ui.add(this.view_Type_Name+"_"+'Mapgallery', 'top-left')
       this.view.ui.add(this.view_Type_Name+"_"+'Maptoolbar', 'top-right')
        this.view.ui.add(this.view_Type_Name+"_"+'Donate', 'bottom-left')
       this.view.on('click', (event:any) => {
        // console.log(this.view.extent)
        // console.log(event.mapPoint)
        })

      this.view.when(()=>{
        this.mapzoom=this.view.zoom
        if(this.view_Type_Name==GeoSenceConfig.Main_ViewContainer_Type){
           this.mapStore.setMainViewloaded(true)
          }
      })
     this.blurHandler= reactiveUtils.on(() => this.view,"blur",(event:any) => {
          this.activated=false
      })
      this.focusHandler=reactiveUtils.on(() => this.view,"focus",(event:any) => {
          this.activated=true
      })
      reactiveUtils.when(() => !this.view?.stationary,
          () =>{
            this.mapStore.setGeoSenceViewStatary(true)
          })
       this.addstationaryHandler(()=>{})
    }
    
   public addstationaryHandler(callbackExtent:()=>void){
        this.stationaryHandle = reactiveUtils.watch(() => [this.view.stationary, this.view.zoom],
         ([stationary, zoom]) => {
            if(stationary){
              this.mapzoom=zoom
              this.mapStore.setGeoSenceViewStatary(true)
               callbackExtent()
            //  if(this.view.type==='3d'){
            //   callbackExtent(this.view.camera,this.view.zoom)
            //  }else{
            //   callbackExtent(this.view.extent,this.view.zoom)
            // } 
          }
       })
    }

    public removestationaryHandler(){
      if(this.stationaryHandle)
       this.stationaryHandle.remove()
    }
}