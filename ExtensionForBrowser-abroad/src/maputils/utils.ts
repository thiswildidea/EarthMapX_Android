import TileLayer from "@arcgis/core/layers/TileLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Extent from "@arcgis/core/geometry/Extent";
 export async function init3DBaseMaplayers(layers:any) {
   
    const m_spatialReference = new SpatialReference({ wkid: 3857})
    const m_fullExtent = new Extent({
      'xmax': 625946.5013014245,
      'xmin': -664070.9840648889,
      'ymax': 455380.3977668153,
      'ymin': -480512.48574337584,
      'spatialReference': m_spatialReference
    })
    return layers.map((item:any) => {
      switch (item.mapType) {
       
        case 'TileLayer':
          return new TileLayer({
            url: item.url,
            id: item.layerEName,
            visible: item.visible,
            opacity: item.opacity,
            listMode: item.listMode,
            title: item.layerCName,
            // fullExtent: m_fullExtent,
            maxScale: item.maxScale,
          });
          case 'VectorTileLayer':
          return new VectorTileLayer({
            url: item.url,
            id: item.layerEName,
            visible: item.visible,
            opacity: item.opacity,
            listMode: item.listMode,
            title: item.layerCName,
            // fullExtent: m_fullExtent,
            maxScale: item.maxScale,
          });
      }
    });
  }
export async function initalGroupAndlayers(layerGroups:any) {
    return layerGroups.map((itemsgroup:any, key:any, ary:any) =>{
      let grouplayer = new GroupLayer({
        id: itemsgroup.id,
        title: itemsgroup.title,
        visible: itemsgroup.visible,
        listMode: itemsgroup.listMode
      });
      if (itemsgroup.layerGroups != null) {
        const groupslayers = itemsgroup.layerGroups.reverse().map( (items:any, key:any, ary:any)=> {
          let grouplayer2 = new GroupLayer({
            id: items.id,
            title: items.title,
            visible: items.visible,
            listMode: items.listMode
          });
          items.layers.reverse().map(function (layer:any, key:any, art:any) {
            switch (layer.maptype) {
              case "TileLayer":
                grouplayer2.add(new TileLayer({
                   url:layer.url, 
                  id: layer.id,
                  title: layer.title,
                  visible: layer.visible,
                  opacity: layer.opacity
                }));
                break;
              case "MapImageLayer":
                grouplayer2.add(new MapImageLayer({
                  url:layer.url, 
                  id: layer.id,
                  title: layer.title,
                  visible: layer.visible,
                  opacity: layer.opacity
                }))
                break;
              case "FeatureLayer":
                if(layer.renderer){
                  grouplayer2.add(new FeatureLayer({
                    url:layer.url, 
                    id: layer.id,
                    title: layer.title,
                    visible: layer.visible,
                    opacity: layer.opacity,
                    renderer: layer.renderer,
                    popupTemplate: layer.popupTemplate,
                    definitionExpression: layer.definition,
                    popupEnabled: layer.popupEnabled,
                  }));
                }else{
                  grouplayer2.add(new FeatureLayer({
                    url:layer.url, 
                    id: layer.id,
                    title: layer.title,
                    visible: layer.visible,
                    opacity: layer.opacity,
                    // renderer: layer.renderer,
                    popupTemplate: layer.popupTemplate,
                    definitionExpression: layer.definition,
                    popupEnabled: layer.popupEnabled,
                  }));
                }
                break;
              case "SceneLayer":
                grouplayer2.add(new SceneLayer({
                  url:layer.url, 
                  id: layer.id,
                  title: layer.title,
                  visible: layer.visible,
                  opacity: layer.opacity,
                  renderer: layer.renderer,
                  popupTemplate: layer.popupTemplate,
                  elevationInfo: layer.elevationInfo,
                  definitionExpression: layer.layerdefinition,
                  popupEnabled: layer.popupEnabled,
                }));
                break;
            }
          })
          return grouplayer2;
        })
        grouplayer.addMany(groupslayers)
      }
      if (itemsgroup.layers != null) {
        const layers = itemsgroup.layers.reverse().map((layer:any, key:any, ary:any)=>  {
          switch (layer.maptype) {
            case "MapImageLayer":
              return new MapImageLayer({
                 url:layer.url, 
                id: layer.id,
                title: layer.title,
                visible: layer.visible,
                opacity: layer.opacity
              })
            break;
            case "TileLayer":
              return new TileLayer({
                 url:layer.url, 
                id: layer.id,
                title: layer.title,
                visible: layer.visible,
                opacity: layer.opacity
              });
              break;
            case "SceneLayer":
              return new SceneLayer({
                 url:layer.url, 
                id: layer.id,
                title: layer.title,
                visible: layer.visible,
                opacity: layer.opacity,
                renderer: layer.renderer,
                definitionExpression:layer.layerdefinition,
                popupTemplate: layer.popupTemplate,
                elevationInfo: layer.elevationInfo,
                popupEnabled: layer.popupEnabled,
              });
              break;
            case "FeatureLayer":
              const flayer = new FeatureLayer({
                 url:layer.url, 
                id: layer.id,
                title: layer.title,
                visible: layer.visible,
                opacity: layer.opacity,
                definitionExpression: layer.definition,
                popupTemplate: layer.popupTemplate,
                elevationInfo: layer.elevationInfo,
                popupEnabled: layer.popupEnabled
              });
              if (layer.renderer != null && layer.renderer != undefined)
                flayer.renderer = layer.renderer;
               if (layer.labelingInfo != null && layer.labelingInfo != undefined)
                 flayer.labelingInfo = layer.labelingInfo;
              return flayer;
              break;
          }
        })
        grouplayer.addMany(layers);
      }
      return grouplayer
    })
  }