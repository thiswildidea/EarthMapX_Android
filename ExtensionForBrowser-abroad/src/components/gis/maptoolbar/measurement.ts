import {guid} from '/@/utils'
import GeoSenceConfig from '/@/config/GeoSenceConfig';
import Draw from "@arcgis/core/views/draw/Draw";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import  i18n from '/@/i18n/index';

// 类型别名，用于简化类型断言
type TextSymbolType = { type: "text"; color: string; angle: number; text: string; xoffset: number; yoffset: number; horizontalAlignment: 'right' | 'left' | 'center'; verticalAlignment: 'top' | 'bottom' | 'middle'; font: { size: number; family: string; weight: 'bold' | 'normal' | 'lighter' | 'bolder' } };
type PointSymbolType = { type: "point-3d"; symbolLayers: any[] };
type LineSymbolType = { type: "simple-line"; color: number[]; width: number };
type FillSymbolType = { type: "simple-fill"; color: number[]; style: "none" | "solid" | "backward-diagonal" | "cross" | "diagonal-cross" | "forward-diagonal" | "horizontal" | "vertical"; outline: { color: string; width: number } };

export  function pointMeasurement(drawMeasureGraphiclayerID:any,ViewContainer_type:any, ismeasurementcomplete:(iscomplete:any)=>{}) {
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   let drawMeasureGraphiclayer = geosenceView.map.findLayerById(drawMeasureGraphiclayerID);
	 if (!drawMeasureGraphiclayer) {
      drawMeasureGraphiclayer = new GraphicsLayer({
        id: drawMeasureGraphiclayerID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.measuregraphiclayer'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawMeasureGraphiclayer);
    }
	 if(!GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool){
     GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool=new Draw({view: geosenceView })
	  }else{
      GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.reset();
	 }
    const drawPointID = guid();
    let drawPointTempLayer = geosenceView.map.findLayerById(drawPointID);
    if (drawPointTempLayer== null) {
      drawPointTempLayer = new GraphicsLayer({
        id: drawPointID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.drawPointID'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawPointTempLayer);
    }
	 const action =  GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.create("point", { mode: "click" });
   action.hasZ = false
   geosenceView.focus();
   action.on("vertex-add", (event:any) => { console.log(event); });
   action.on("vertex-remove", (event:any) => { console.log(event); });
   action.on("cursor-update", (event:any) => {
       drawPointTempLayer.removeAll();
         const point = {
             type: "point" as const,
             x: event.vertices[0][0],
             y: event.vertices[0][1],
             spatialReference: geosenceView.spatialReference
         };
         const graphic = new Graphic({
            geometry: point,
            symbol: GeoSenceConfig.marksymbol as PointSymbolType
        });
         drawPointTempLayer.add(graphic);
         const labelsymbol = { ...GeoSenceConfig.textsymbol } as TextSymbolType;
        labelsymbol.horizontalAlignment='right'
        labelsymbol.verticalAlignment='bottom'
        labelsymbol.xoffset=1500
        labelsymbol.yoffset=150
         labelsymbol.text =  parseFloat(event.vertices[0][0]).toFixed(3)+ "," + parseFloat(event.vertices[0][1]).toFixed(3) ;
         const labelgraphic = new Graphic({
             geometry: point,
             symbol: labelsymbol
         });
         drawPointTempLayer.add(labelgraphic);
     }
   );
   action.on("redo", (event:any) => { console.log(event); });
   action.on("undo", (event:any) => { console.log(event); });
   action.on("draw-complete", (event:any) => {
        const point = {
            type: "point" as const,
            x: event.vertices[0][0],
            y: event.vertices[0][1],
            spatialReference: geosenceView.spatialReference
        };
        const graphic = new Graphic({
            geometry: point,
            symbol: GeoSenceConfig.marksymbol as PointSymbolType
        });
        const labelsymbol = { ...GeoSenceConfig.textsymbol } as TextSymbolType;
        labelsymbol.horizontalAlignment='right'
        labelsymbol.verticalAlignment='bottom'
        labelsymbol.xoffset=1500
        labelsymbol.yoffset=150
        labelsymbol.text = + parseFloat(event.vertices[0][0]).toFixed(3)
            + "," + parseFloat(event.vertices[0][1]).toFixed(3) ;
        const labelgraphic = new Graphic({
            geometry: point,
            symbol: labelsymbol
        });
        geosenceView.map.remove(drawPointTempLayer);
        drawMeasureGraphiclayer.add(labelgraphic);
        drawMeasureGraphiclayer.add(graphic);
        ismeasurementcomplete(false)
     }
   );
}
 export  function polylineMeasurement(drawMeasureGraphiclayerID:any,ViewContainer_type:any, ismeasurementcomplete:(iscomplete:any)=>{}) {
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   let drawMeasureGraphiclayer = geosenceView.map.findLayerById(drawMeasureGraphiclayerID);
	 if (!drawMeasureGraphiclayer) {
      drawMeasureGraphiclayer = new GraphicsLayer({
        id: drawMeasureGraphiclayerID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.measuregraphiclayer'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawMeasureGraphiclayer);
    }
	 if(!GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool){
     GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool=new Draw({view: geosenceView })
	  }else{
      GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.reset();
	  }
    const drawPolylineID = guid();
    let drawPolylineTempLayer = geosenceView.map.findLayerById(drawPolylineID);
    if ( drawPolylineTempLayer== null) {
      drawPolylineTempLayer = new GraphicsLayer({
        id: drawPolylineID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.drawPolylineID'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawPolylineTempLayer);
    }
	const action = GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.create("polyline");
    action.hasZ = false
    geosenceView.focus();
	action.on(["vertex-add","vertex-remove","cursor-update","redo","undo"], (event:any) => {
      if (event.vertices.length > 1) {
        const vertices = event.vertices;
        drawPolylineTempLayer.removeAll();
        const graphic = new Graphic({
          geometry: {
            type: "polyline",
            paths: vertices,
            hasZ: false,
            spatialReference: geosenceView.spatialReference
          },
          symbol: GeoSenceConfig.polylinesymbol as LineSymbolType as LineSymbolType
        });
        const getLastSegment = (polyline:any) => {
          const line = polyline.clone();
          const lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
          const existingLineFinalPoint = line.getPoint(0, line.paths[0].length - 1);
          return {
            type: "polyline" as const,
            spatialReference: geosenceView.spatialReference,
            hasZ: false,
            paths: [[
              [existingLineFinalPoint.x, existingLineFinalPoint.y],
              [lastXYPoint.x, lastXYPoint.y]
            ]]
          } as any;
        };

        const isSelfIntersecting = (polylineIn:any) => {
          if (polylineIn.paths[0].length < 3) {
            return false;
          }
          const line = polylineIn.clone();
          const lastSegment = getLastSegment(polylineIn) as any;
          line.removePoint(0, line.paths[0].length - 1);
          return geometryEngine.crosses(lastSegment, line);
        };

        if (isSelfIntersecting(graphic.geometry as unknown as any)) {
          const pyline = new Graphic({
            geometry: getLastSegment(graphic.geometry) as any,
          symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
          });
          if (pyline) {
            drawPolylineTempLayer.addMany([graphic, pyline]);
          }
          if (pyline) {
            event.preventDefault();
          }
        } else {
          drawPolylineTempLayer.add(graphic);
          let labelsymbol = { ...GeoSenceConfig.textsymbol } as TextSymbolType;
          let totallengthlabelsymbol = { ...GeoSenceConfig.textsymbolcopy } as TextSymbolType;
          const paths = (graphic.geometry as any).paths || [];
            if (paths[0] && paths[0].length>1){
              let allpointarray:any[] = []
              paths[0].map((point:any,index:number)=>{
              allpointarray.push(point)
            if(index>0){

              const pointarray=[]
              pointarray.push((graphic.geometry as any).paths[0][index -1])
              pointarray.push((graphic.geometry as any).paths[0][index])

              const radiusgraphic = new Graphic({
                geometry: {
                  type: "polyline",
                  hasZ: false,
                  paths: [pointarray],
                  spatialReference: geosenceView.spatialReference
                },
              });
              const lengthdistance = geometryEngine.geodesicLength(radiusgraphic.geometry, 'meters');
              const labelstring = lengthdistance > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.length') + (lengthdistance / 1000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
                : i18n.global.t('message.gis.maptoolbar.measurement.length') + lengthdistance.toFixed(3)+' ' + i18n.global.t('message.gis.maptoolbar.measurement.meter');

              labelsymbol.text = labelstring;
              const labelgraphic = new Graphic({
                geometry: radiusgraphic.geometry.extent.center,
                symbol: labelsymbol
              });
              drawPolylineTempLayer.add(labelgraphic);
             }
            })
            const totalradiusgraphic = new Graphic({
              geometry: {
                type: "polyline",
                hasZ: false,
                paths: [allpointarray],
                spatialReference: geosenceView.spatialReference
              },
            });
            const totallengthdistance = geometryEngine.geodesicLength(totalradiusgraphic.geometry, 'meters');
            const totallengthlabelstring = totallengthdistance > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.totallength')  + (totallengthdistance / 1000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
              : i18n.global.t('message.gis.maptoolbar.measurement.totallength')+ totallengthdistance.toFixed(3)+' ' +i18n.global.t('message.gis.maptoolbar.measurement.meter');
            
            totallengthlabelsymbol.color = 'yellow';
            totallengthlabelsymbol.text = totallengthlabelstring;

            const pline = totalradiusgraphic.geometry.clone() as any;
            const plastXYPoint = pline.removePoint(0, pline.paths[0].length - 1);
            plastXYPoint.z = 0


            const totallengthlabelgraphic = new Graphic({
              geometry: plastXYPoint,
              symbol: {
                ...totallengthlabelsymbol,
                color: 'yellow',
                text: totallengthlabelstring
              } as TextSymbolType
            });
            drawPolylineTempLayer.add(totallengthlabelgraphic);
          }
        }
      }
    });
    action.on("draw-complete", (event:any) => {
      if (event.vertices.length > 1) {
        const vertices = event.vertices;
        drawPolylineTempLayer.removeAll();
        const graphic = new Graphic({
          geometry: {
            type: "polyline",
            paths: vertices,
            hasZ: false,
            spatialReference: geosenceView.spatialReference
          },
          symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
        });
        const getLastSegment = (polyline:any) => {
          const line = polyline.clone();
          const lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
          const existingLineFinalPoint = line.getPoint(0, line.paths[0].length - 1);
          return {
            type: "polyline" as const,
            spatialReference: geosenceView.spatialReference,
            hasZ: false,
            paths: [[
              [existingLineFinalPoint.x, existingLineFinalPoint.y],
              [lastXYPoint.x, lastXYPoint.y]
            ]]
          };
        };

        const isSelfIntersecting = (polylineIn:any) => {
          if (polylineIn.paths[0].length < 3) {
            return false;
          }
          const line = polylineIn.clone();
          const lastSegment = getLastSegment(polylineIn);
          line.removePoint(0, line.paths[0].length - 1);
          return geometryEngine.crosses(lastSegment as unknown as any, line);
        };
        let polyLine = null;
        if (isSelfIntersecting(graphic.geometry as any)) {
          const pyline = new Graphic({
            geometry: getLastSegment(graphic.geometry) as any,
            symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
          });
          if (pyline) {
            drawMeasureGraphiclayer.addMany([graphic, pyline]);
            polyLine = new Graphic({
              geometry: geometryEngine.union([graphic.geometry, pyline.geometry] as any),
            symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
            });
          }
          if (pyline) {
            event.preventDefault();
          }
        }
		else {
          polyLine = graphic;
          drawMeasureGraphiclayer.add(graphic);
          const labelsymbol = GeoSenceConfig.textsymbol;
          const totallengthlabelsymbol = GeoSenceConfig.textsymbolcopy;
          const paths = (graphic.geometry as any).paths || [];
            if (paths[0] && paths[0].length > 1) {
              let allpointarray:any[] = []
              paths[0].map((point:any, index:number) => {
              allpointarray.push(point)
              if (index > 0) {
                const pointarray = []
                pointarray.push((graphic.geometry as any).paths[0][index - 1])
                pointarray.push((graphic.geometry as any).paths[0][index])
                
                const radiusgraphic = new Graphic({
                  geometry: {
                    type: "polyline" as const,
                    hasZ: false,
                    paths: [pointarray],
                    spatialReference: geosenceView.spatialReference
                  },
                  symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
                });
                const lengthdistance = geometryEngine.geodesicLength(radiusgraphic.geometry, 'meters');
                const labelstring = lengthdistance > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.length')  + (lengthdistance / 1000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
                  : i18n.global.t('message.gis.maptoolbar.measurement.length') + lengthdistance.toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.meter');
                const labelgraphic = new Graphic({
                  geometry: radiusgraphic.geometry.extent.center,
                  symbol: {
                    ...labelsymbol,
                    text: labelstring
                  } as TextSymbolType
                });
                 drawMeasureGraphiclayer.add(labelgraphic);
              }
            })
            const totalradiusgraphic = new Graphic({
              geometry: {
                type: "polyline",
                hasZ: false,
                paths: [allpointarray],
                spatialReference: geosenceView.spatialReference
              },
            });
            const totallengthdistance = geometryEngine.geodesicLength(totalradiusgraphic.geometry, 'meters');
            const totallengthlabelstring = totallengthdistance > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.totallength')  + (totallengthdistance / 1000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
              : i18n.global.t('message.gis.maptoolbar.measurement.totallength') + totallengthdistance.toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.meter');
            totallengthlabelsymbol.text = totallengthlabelstring;
            totallengthlabelsymbol.color = 'yellow';
            const pline = totalradiusgraphic.geometry.clone() as Polygon;
            const plastXYPoint = pline.removePoint(0, pline.rings[0].length - 1);
            plastXYPoint.z = 0
            const totallengthlabelgraphic = new Graphic({
              geometry: plastXYPoint,
              symbol: {
                ...totallengthlabelsymbol,
                text: totallengthlabelstring
              } as TextSymbolType
            });
             geosenceView.map.remove(drawPolylineTempLayer);
            drawMeasureGraphiclayer.add(totallengthlabelgraphic);
             ismeasurementcomplete(false)
          }
        }
      }
    });
}

export  function rectangleMeasurement(drawMeasureGraphiclayerID:any,ViewContainer_type:any, ismeasurementcomplete:(iscomplete:any)=>{}) {
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   let drawMeasureGraphiclayer = geosenceView.map.findLayerById(drawMeasureGraphiclayerID);
	 if (!drawMeasureGraphiclayer) {
      drawMeasureGraphiclayer = new GraphicsLayer({
        id: drawMeasureGraphiclayerID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.measuregraphiclayer'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawMeasureGraphiclayer);
     }
	  if(!GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool){
     GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool=new Draw({view: geosenceView })
       
	}else{
      GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.reset();
	}
    const drawRectangleID = guid();
    let drawRectangleTempLayer = geosenceView.map.findLayerById(drawRectangleID);
    if (drawRectangleTempLayer== null) {
      drawRectangleTempLayer = new GraphicsLayer({
        id: drawRectangleID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.drawRectangleID'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawRectangleTempLayer);
    }
	  const action = GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.create("rectangle", { mode: "click" });
    action.hasZ = false
    geosenceView.focus();
    action.on("vertex-add", (event:any) => {
            if (event.vertices.length === 2) {
                drawRectangleTempLayer.removeAll();
                const xmin = event.vertices[0][0] > event.vertices[1][0] ?
                 event.vertices[1][0] : event.vertices[0][0];
                const ymin = event.vertices[0][1] > event.vertices[1][1] ?
                 event.vertices[1][1] : event.vertices[0][1];
                const xmax = event.vertices[0][0] > event.vertices[1][0] ?
                    event.vertices[0][0] : event.vertices[1][0];
                const ymax = event.vertices[0][1] > event.vertices[1][1] ?
                    event.vertices[0][1] : event.vertices[1][1];
                const ringsss = [[[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax], [xmin, ymin]]];
                const pgon = new Polygon({
                    hasZ: true,
                    hasM: true,
                    rings: ringsss,
                    spatialReference: geosenceView.spatialReference
                });
                const graphic = new Graphic({
                    geometry: pgon,
                    symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
                }); 
                const rlengthGeometry = new Point({
                    x: xmin + (xmax - xmin) / 2,
                    y: ymin ,
                    spatialReference: geosenceView.spatialReference
                });
                const rlengthbegin = new Point({
                    x: xmin,
                    y: ymin,
                    spatialReference: geosenceView.spatialReference
                });
                const rlengthend = new Point({
                    x: xmax,
                    y: xmin,
                    spatialReference: geosenceView.spatialReference
                });
                const length = geometryEngine.distance(rlengthbegin, rlengthend, 'meters');
                const rlengthlabelsymbol = GeoSenceConfig.textsymbol;
                const rlengthlabelstring = length > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.length') + (length / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
                    : i18n.global.t('message.gis.maptoolbar.measurement.length')+ length.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.meter');
                rlengthlabelsymbol.text = rlengthlabelstring;
                const rlengthlabelgraphic = new Graphic({
                    geometry: rlengthGeometry,
                    symbol: {
                      ...rlengthlabelsymbol,
                      text: rlengthlabelstring
                    } as TextSymbolType
                }); 
                const rwidthGeometry = new Point({
                    x: xmax ,
                    y: ymin + (ymax - ymin) / 2,
                    spatialReference: geosenceView.spatialReference
                });
                const rwidthbegin = new Point({
                    x: xmax,
                    y: ymin,
                    spatialReference: geosenceView.spatialReference
                });
                const rwidthend = new Point({
                    x: xmax,
                    y: ymax,
                    spatialReference: geosenceView.spatialReference
                });
                const width = geometryEngine.distance(rwidthbegin, rwidthend, 'meters');
                const rwidthlabelsymbol = GeoSenceConfig.textsymbol;
                const rwidthlabelstring = width > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.width') + (width / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers') 
                    : i18n.global.t('message.gis.maptoolbar.measurement.width')  + width.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.meter');
                rwidthlabelsymbol.text = rwidthlabelstring;
                const rlwidthlabelgraphic = new Graphic({
                    geometry: rwidthGeometry,
                    symbol: {
                      ...rwidthlabelsymbol,
                      text: rwidthlabelstring
                    } as TextSymbolType
                }); 
                const centergeometry = new Point({
                    x: xmin + (xmax - xmin) / 2,
                    y: ymin + (ymax - ymin) / 2,
                    spatialReference: geosenceView.spatialReference
                });
                const arealabelsymbol = GeoSenceConfig.textsymbol;
                const area = length * width;
                const arealabelstring = area > 100000 ? i18n.global.t('message.gis.maptoolbar.measurement.area') + (area / 1000000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers')
                    :   i18n.global.t('message.gis.maptoolbar.measurement.area')  + area.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.squaremeter');
                arealabelsymbol.text = arealabelstring;
                const arealabelgraphic = new Graphic({
                    geometry: centergeometry,
                    symbol: arealabelsymbol as TextSymbolType
                }); 
                drawRectangleTempLayer.add(rlengthlabelgraphic);
                drawRectangleTempLayer.add(rlwidthlabelgraphic);
                drawRectangleTempLayer.add(arealabelgraphic);
                drawRectangleTempLayer.add(graphic);
            }
          }
      );
        action.on("vertex-remove", (event:any) => { console.log(event); });
        action.on("cursor-update", (event:any) => {
             if (event.vertices.length === 2) {
                 drawRectangleTempLayer.removeAll();
                 const xmin = event.vertices[0][0] > event.vertices[1][0] ?
                     event.vertices[1][0] : event.vertices[0][0];
                 const ymin = event.vertices[0][1] > event.vertices[1][1] ?
                     event.vertices[1][1] : event.vertices[0][1];
                 const xmax = event.vertices[0][0] > event.vertices[1][0] ?
                     event.vertices[0][0] : event.vertices[1][0];
                 const ymax = event.vertices[0][1] > event.vertices[1][1] ?
                     event.vertices[0][1] : event.vertices[1][1];
                 const ringsss = [[[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax], [xmin, ymin]]];
                 const pgon = new Polygon({
                     hasZ: true,
                     hasM: true,
                     rings: ringsss,
                     spatialReference: geosenceView.spatialReference
                 });
                 const graphic = new Graphic({
                     geometry: pgon,
                     symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
                 });
                 const rlengthGeometry = new Point({
                     x: xmin + (xmax - xmin) / 2,
                     y: ymin,
                     spatialReference: geosenceView.spatialReference
                 });
                 const rlengthbegin = new Point({
                     x: xmin,
                     y: ymin,
                     spatialReference: geosenceView.spatialReference
                 });
                 const rlengthend = new Point({
                     x: xmax,
                     y: ymin,
                     spatialReference: geosenceView.spatialReference
                 });
                 const length = geometryEngine.distance(rlengthbegin, rlengthend, 'meters');
                 const rlengthlabelsymbol = GeoSenceConfig.textsymbol;
                 const rlengthlabelstring = length > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.length') + (length / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers') 
                     : i18n.global.t('message.gis.maptoolbar.measurement.length') + length.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.meter');
                 rlengthlabelsymbol.text = rlengthlabelstring;
                 const rlengthlabelgraphic = new Graphic({
                     geometry: rlengthGeometry,
                     symbol: {
                       ...rlengthlabelsymbol,
                       text: rlengthlabelstring
                     } as TextSymbolType
                 })
                 const rwidthGeometry = new Point({
                     x: xmax,
                     y: ymin + (ymax - ymin) / 2,
                     spatialReference:  geosenceView.spatialReference
                 });
                 const rwidthbegin = new Point({
                     x: xmax,
                     y: ymin,
                     spatialReference: geosenceView.spatialReference
                 });
                 const rwidthend = new Point({
                     x: xmax,
                     y: ymax,
                     spatialReference: geosenceView.spatialReference
                 });
                 const width = geometryEngine.distance(rwidthbegin, rwidthend, 'meters');
                 const rwidthlabelsymbol = GeoSenceConfig.textsymbol;
                 const rwidthlabelstring = width > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.width')  + (width / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers') 
                     : i18n.global.t('message.gis.maptoolbar.measurement.width')  + width.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.meter') 
                 rwidthlabelsymbol.text = rwidthlabelstring;
                 const rlwidthlabelgraphic = new Graphic({
                     geometry: rwidthGeometry,
                     symbol: {
                       ...rwidthlabelsymbol,
                       text: rwidthlabelstring
                     } as TextSymbolType
                 })
                 const centergeometry = new Point({
                     x: xmin + (xmax - xmin) / 2,
                     y: ymin + (ymax - ymin) / 2,
                     spatialReference: geosenceView.spatialReference
                 });
                 const arealabelsymbol = GeoSenceConfig.textsymbol;
                 const area = length * width;
                 const arealabelstring = area > 100000 ? i18n.global.t('message.gis.maptoolbar.measurement.area')  + (area / 1000000).toFixed(3) +  i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers')
                     : i18n.global.t('message.gis.maptoolbar.measurement.area')  + area.toFixed(3) +i18n.global.t('message.gis.maptoolbar.measurement.squaremeter');
                 arealabelsymbol.text = arealabelstring;
                 const arealabelgraphic = new Graphic({
                     geometry: centergeometry,
                     symbol: {
                       ...arealabelsymbol,
                       text: arealabelstring
                     } as TextSymbolType
                 })
                 drawRectangleTempLayer.add(rlengthlabelgraphic);
                 drawRectangleTempLayer.add(rlwidthlabelgraphic);
                 drawRectangleTempLayer.add(arealabelgraphic);
                 drawRectangleTempLayer.add(graphic);
             }
          }
        );
          action.on("redo", (event:any) => { console.log(event); });
          action.on("undo", (event:any) => { console.log(event); });
          action.on("draw-complete", (event:any) => {
              if (event.vertices.length === 2) {
                  const xmin = event.vertices[0][0] > event.vertices[1][0] ?
                      event.vertices[1][0] : event.vertices[0][0];
                  const ymin = event.vertices[0][1] > event.vertices[1][1] ?
                      event.vertices[1][1] : event.vertices[0][1];
                  const xmax = event.vertices[0][0] > event.vertices[1][0] ?
                      event.vertices[0][0] : event.vertices[1][0];
                  const ymax = event.vertices[0][1] > event.vertices[1][1] ?
                      event.vertices[0][1] : event.vertices[1][1];
                  const ringsss = [[[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax], [xmin, ymin]]];
                  const pgon = new Polygon({
                      hasZ: true,
                      hasM: true,
                      rings: ringsss,
                      spatialReference: geosenceView.spatialReference
                  });
                  const graphic = new Graphic({
                      geometry: pgon,
                      symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
                  });

                  const rlengthGeometry = new Point({
                      x: xmin + (xmax - xmin) / 2,
                      y: ymin,
                      spatialReference: geosenceView.spatialReference
                  });
                  const rlengthbegin = new Point({
                      x: xmin,
                      y: ymin,
                      spatialReference: geosenceView.spatialReference
                  });
                  const rlengthend = new Point({
                      x: xmax,
                      y: ymin,
                      spatialReference: geosenceView.spatialReference
                  });
                  const rlength = geometryEngine.distance(rlengthbegin, rlengthend, 'meters');
                  const rlengthlabelsymbol = GeoSenceConfig.textsymbol;
                                const rlengthlabelstring = rlength > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.length') + (rlength / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers') 
                     : i18n.global.t('message.gis.maptoolbar.measurement.length') + rlength.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.meter');
                  rlengthlabelsymbol.text = rlengthlabelstring;
                  const rlengthlabelgraphic = new Graphic({
                      geometry: rlengthGeometry,
                      symbol: {
                        ...rlengthlabelsymbol,
                        text: rlengthlabelstring
                      } as TextSymbolType
                  });

                  const rwidthGeometry = new Point({
                      x: xmax,
                      y: ymin + (ymax - ymin) / 2,
                      spatialReference: geosenceView.spatialReference
                  });
                  const rwidthbegin = new Point({
                      x: xmax,
                      y: ymin,
                      spatialReference: geosenceView.spatialReference
                  });
                  const rwidthend = new Point({
                      x: xmax,
                      y: ymax,
                      spatialReference: geosenceView.spatialReference
                  });
                  const rwidth = geometryEngine.distance(rwidthbegin, rwidthend, 'meters');
                  const rwidthlabelsymbol = GeoSenceConfig.textsymbol;
                  const rwidthlabelstring = rwidth > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.width')  + (rwidth / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers') 
                     : i18n.global.t('message.gis.maptoolbar.measurement.width')  + rwidth.toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.meter') 
                  rwidthlabelsymbol.text = rwidthlabelstring;
                  const rlwidthlabelgraphic = new Graphic({
                      geometry: rwidthGeometry,
                      symbol: {
                        ...rwidthlabelsymbol,
                        text: rwidthlabelstring
                      } as TextSymbolType
                  });

                  const centergeometry = new Point({
                      x: xmin + (xmax - xmin) / 2,
                      y: ymin + (ymax - ymin) / 2,
                      spatialReference:geosenceView.spatialReference
                  });
                  const arealabelsymbol = GeoSenceConfig.textsymbol;
                  const rarea = rlength * rwidth;
                 const arealabelstring = rarea > 100000 ? i18n.global.t('message.gis.maptoolbar.measurement.area')  + (rarea / 1000000).toFixed(3) +  i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers')
                     : i18n.global.t('message.gis.maptoolbar.measurement.area')  + rarea.toFixed(3) +i18n.global.t('message.gis.maptoolbar.measurement.squaremeter');
                 arealabelsymbol.text = arealabelstring;
                  arealabelsymbol.text = arealabelstring;
                  const arealabelgraphic = new Graphic({
                      geometry: centergeometry,
                      symbol: {
                        ...arealabelsymbol,
                        text: arealabelstring
                      } as TextSymbolType
                  });
                  geosenceView.map.remove(drawRectangleTempLayer);
                  drawMeasureGraphiclayer.add(rlengthlabelgraphic);
                  drawMeasureGraphiclayer.add(rlwidthlabelgraphic);
                  drawMeasureGraphiclayer.add(arealabelgraphic);
                  drawMeasureGraphiclayer.add(graphic);
                   ismeasurementcomplete(false)
              }
          }
        );
}
export  function polygonMeasurement(drawMeasureGraphiclayerID:any,ViewContainer_type:any, ismeasurementcomplete:(iscomplete:any)=>{}) {
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
   let drawMeasureGraphiclayer = geosenceView.map.findLayerById(drawMeasureGraphiclayerID);
	if (!drawMeasureGraphiclayer) {
      drawMeasureGraphiclayer = new GraphicsLayer({
        id: drawMeasureGraphiclayerID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.measuregraphiclayer'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawMeasureGraphiclayer);
     }
	 	if(!GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool){
     GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool=new Draw({view: geosenceView })
       
	}else{
      GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.reset();
	}
    
    const drawPolygonID = guid();
    let drawPolygonTempLayer = geosenceView.map.findLayerById(drawPolygonID);
    if ( drawPolygonTempLayer== null) {
      drawPolygonTempLayer = new GraphicsLayer({
        id: drawPolygonID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.drawPolygonID'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawPolygonTempLayer);
    }
	 const action = GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.create("polygon", { mode: "click" });
   action.hasZ = false
   geosenceView.focus();
    action.on(["vertex-add","vertex-remove","cursor-update","redo","undo"], (event:any) => {
          const vertices = event.vertices;
          drawPolygonTempLayer.removeAll();
          const polygon = {
              type: "polygon" as const, // autocasts as Polygon
              rings: vertices,
              spatialReference: geosenceView.spatialReference
          };
          const graphic = new Graphic({
              geometry: polygon as any,
              symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
          });
          if (event.vertices.length > 3) {
          const area = geometryEngine.geodesicArea(graphic.geometry as Polygon, "square-meters");
          const arealabelsymbol = GeoSenceConfig.textsymbol;

          const labelstring = Math.abs(area) > 100000 ? i18n.global.t('message.gis.maptoolbar.measurement.area') + (Math.abs(area) / 1000000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers')
              : i18n.global.t('message.gis.maptoolbar.measurement.area')  + Math.abs(area).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.squaremeter') ;
          const arealabelgraphic = new Graphic({
              geometry: graphic.geometry.extent.center,
              symbol: {
                ...arealabelsymbol,
                text: labelstring
              } as TextSymbolType
          });
          drawPolygonTempLayer.add(arealabelgraphic);

          }
          drawPolygonTempLayer.add(graphic);
      });
      action.on("draw-complete", (event:any) => {
              const vertices = event.vertices;
              drawPolygonTempLayer.removeAll();

              const polygon = {
                  type: "polygon" as const, // autocasts as Polygon
                  rings: vertices,
                  spatialReference: geosenceView.spatialReference
              };
              const graphic = new Graphic({
                  geometry: polygon as any,
                  symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
              });
              const polygonarea = geometryEngine.geodesicArea(graphic.geometry as Polygon, "square-meters");
              const arealabelsymbol = GeoSenceConfig.textsymbol;
              const labelstring = Math.abs(polygonarea) > 100000 ? i18n.global.t('message.gis.maptoolbar.measurement.area') + (Math.abs(polygonarea) / 1000000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers')
              : i18n.global.t('message.gis.maptoolbar.measurement.area')  + Math.abs(polygonarea).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.squaremeter') ;
              arealabelsymbol.text = labelstring;
              const arealabelgraphic = new Graphic({
                  geometry: graphic.geometry.extent.center,
                  symbol: {
                    ...arealabelsymbol,
                    text: labelstring
                  } as TextSymbolType
              });
              geosenceView.map.remove(drawPolygonTempLayer);
              drawMeasureGraphiclayer.add(arealabelgraphic);
              drawMeasureGraphiclayer.add(graphic);
              ismeasurementcomplete(false)
      });

}
export function  polycircleMeasurement(drawMeasureGraphiclayerID:any,ViewContainer_type:any,ismeasurementcomplete:(iscomplete:any)=>{}){
   const geosenceView =GeoSenceConfig.getGeoSenceView(ViewContainer_type).view
let drawMeasureGraphiclayer = geosenceView.map.findLayerById(drawMeasureGraphiclayerID);
	if (!drawMeasureGraphiclayer) {
      drawMeasureGraphiclayer = new GraphicsLayer({
        id: drawMeasureGraphiclayerID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.measuregraphiclayer'),
        listMode: 'hide'
      });
      geosenceView.map.add(drawMeasureGraphiclayer);
     }
	 if(!GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool){
     GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool=new Draw({view: geosenceView })
       
	}else{
      GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.reset();
	}
   const drawcircleresultlayerID = guid(); 
    let drawCircleTemplayer = geosenceView.map.findLayerById(drawcircleresultlayerID);
    if (drawCircleTemplayer == null) {
       drawCircleTemplayer = new GraphicsLayer({
        id: drawcircleresultlayerID,
        title: i18n.global.t('message.gis.maptoolbar.measurement.drawcirclelayerID'), 
        listMode: 'hide'
      });
      geosenceView.map.add(drawCircleTemplayer);
    }
    const action = GeoSenceConfig.getGeoSenceView(ViewContainer_type).drawMeasureTool.create("circle");
    action.hasZ = false
    geosenceView.focus();

    action.on("vertex-add", (event:any) => {
      if (event.vertices.length === 2) {
        drawCircleTemplayer.removeAll();
        const point1 = new Point({
          x: event.vertices[0][0],
          y: event.vertices[0][1],
          hasZ: false,
          spatialReference: geosenceView.spatialReference
        });
        const point2 = new Point({
          x: event.vertices[1][0],
          y: event.vertices[1][1],
          hasZ: false,
          spatialReference: geosenceView.spatialReference
        });

        const radiusgraphic = new Graphic({
          geometry: {
            type: "polyline",
            hasZ: false,
            paths: [[event.vertices[0], event.vertices[1]]],
            spatialReference: geosenceView.spatialReference
          },
          symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
        });
        const y = point2.y - point1.y
        const x = point2.x - point1.x
        const angleInDegrees1 = (Math.atan2(y, x) * 180) / Math.PI ;
        let angleInDegrees=0
        if (y > 0 && x > 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        } else if (y > 0 && x < 0) {
          angleInDegrees = parseFloat((450 - angleInDegrees1).toFixed(2))
        } else if (y < 0 && x < 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        } else if (y < 0 && x > 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        }

        const distance = geometryEngine.geodesicLength(radiusgraphic.geometry, 'meters');
        const geometry = geometryEngine.geodesicBuffer(point1, distance, 'meters') as Polygon;
        const area = geometryEngine.geodesicArea(geometry, 'square-meters');
        const circlegraphic = new Graphic({
          geometry: geometry,
          symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
        });
        const radiusdistancelabelstring = distance > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.radius')  + (distance / 1000).toFixed(3) +' '+ 
        i18n.global.t('message.gis.maptoolbar.measurement.kilometers'): "半径:" + distance.toFixed(3) +' '+i18n.global.t('message.gis.maptoolbar.measurement.meter');
        const radiusdistancelabelsymbol = {
          ...GeoSenceConfig.textsymbol,
          text: radiusdistancelabelstring
        } as TextSymbolType;
        const radiusdistancelabelgraphic = new Graphic({
          geometry: point2,
          symbol: radiusdistancelabelsymbol
        });
        const arealabelstring = area > 1000000 ?i18n.global.t('message.gis.maptoolbar.measurement.area') + (area / 1000000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers')
          : i18n.global.t('message.gis.maptoolbar.measurement.area') + area.toFixed(3)+' ' + i18n.global.t('message.gis.maptoolbar.measurement.squaremeter');
        const arealabelsymbol = {
          ...GeoSenceConfig.textsymbol,
          text: arealabelstring
        } as TextSymbolType;
        const arealabelgraphic = new Graphic({
          geometry: point1,
          symbol: arealabelsymbol
        });

        const radiuslabelstring = angleInDegrees + i18n.global.t('message.gis.maptoolbar.measurement.degree');
        const radiuslabelsymbol = {
          ...GeoSenceConfig.textsymbol,
          text: radiuslabelstring
        } as TextSymbolType;
        const radiuslabelgraphic = new Graphic({
          geometry: radiusgraphic.geometry.extent.center,
          symbol: radiuslabelsymbol
        });

        drawCircleTemplayer.add(circlegraphic);
        drawCircleTemplayer.add(radiusgraphic);
        drawCircleTemplayer.add(radiusdistancelabelgraphic);
        drawCircleTemplayer.add(arealabelgraphic);
        drawCircleTemplayer.add(radiuslabelgraphic);
      }
    }
    );
    action.on("vertex-remove", (event:any) => { console.log(event); });
    action.on("cursor-update", (event:any) => {
      if (event.vertices.length === 2) {
        drawCircleTemplayer.removeAll();
        const point1 = new Point({
          x: event.vertices[0][0],
          y: event.vertices[0][1],
          hasZ: false,
          spatialReference: geosenceView.spatialReference
        });
        const point2 = new Point({
          x: event.vertices[1][0],
          y: event.vertices[1][1],
          hasZ: false,
          spatialReference: geosenceView.spatialReference
        });
        const radiusgraphic = new Graphic({
          geometry: {
            type: "polyline",
            hasZ: false,
            paths: [[event.vertices[0], event.vertices[1]]],
            spatialReference: geosenceView.spatialReference
          },
          symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
        });

        const distance = geometryEngine.geodesicLength(radiusgraphic.geometry, 'meters');
        const geometry = geometryEngine.geodesicBuffer(point1, distance, 'meters') as Polygon;
        const area = geometryEngine.geodesicArea(geometry, 'square-meters');
        const circlegraphic = new Graphic({
          geometry: geometry,
          symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
        });

        const y = point2.y - point1.y
        const x = point2.x - point1.x
        const angleInDegrees1 = (Math.atan2(y, x) * 180) / Math.PI;
        let angleInDegrees = 0
        if (y > 0 && x > 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        } else if (y > 0 && x < 0) {
          angleInDegrees = parseFloat((450 - angleInDegrees1).toFixed(2))
        } else if (y < 0 && x < 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        } else if (y < 0 && x > 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        }

        const radiusdistancelabelstring = distance > 1000 ? i18n.global.t('message.gis.maptoolbar.measurement.radius') + (distance / 1000).toFixed(3) + i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
          : i18n.global.t('message.gis.maptoolbar.measurement.radius') + distance.toFixed(3) +i18n.global.t('message.gis.maptoolbar.measurement.meter') ;
        const radiusdistancelabelsymbol = {
          ...GeoSenceConfig.textsymbol,
          text: radiusdistancelabelstring
        } as TextSymbolType;
        const radiusdistancelabelgraphic = new Graphic({
          geometry: point2,
          symbol: radiusdistancelabelsymbol
        });
        const arealabelstring = area > 1000000 ? i18n.global.t('message.gis.maptoolbar.measurement.area') + (area / 1000000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
          :i18n.global.t('message.gis.maptoolbar.measurement.area')+ area.toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.meter');
        const arealabelsymbol = {
          ...GeoSenceConfig.textsymbol,
          text: arealabelstring
        } as TextSymbolType;
        const arealabelgraphic = new Graphic({
          geometry: point1,
          symbol: arealabelsymbol
        });

        const radiuslabelstring = angleInDegrees + i18n.global.t('message.gis.maptoolbar.measurement.degree');
        const radiuslabelsymbol = {
          ...GeoSenceConfig.textsymbol,
          text: radiuslabelstring
        } as TextSymbolType;
        const radiuslabelgraphic = new Graphic({
          geometry: radiusgraphic.geometry.extent.center,
          symbol: radiuslabelsymbol
        });

        
        drawCircleTemplayer.add(circlegraphic);
        drawCircleTemplayer.add(radiusgraphic);
        drawCircleTemplayer.add(radiusdistancelabelgraphic);
        drawCircleTemplayer.add(arealabelgraphic);
        drawCircleTemplayer.add(radiuslabelgraphic);
      }
    }
    );
    action.on("redo", (event:any) => { console.log(event); });
    action.on("undo", (event:any) => { console.log(event); });
    action.on("draw-complete", (event:any) => {
      if (event.vertices.length === 2) {
        const point1 = new Point({
          x: event.vertices[0][0],
          y: event.vertices[0][1],
          hasZ: false,
          spatialReference: geosenceView.spatialReference
        });
        const point2 = new Point({
          x: event.vertices[1][0],
          y: event.vertices[1][1],
          hasZ: false,
          spatialReference: geosenceView.spatialReference
        });

        const radiusgraphic = new Graphic({
          geometry: {
            type: "polyline",
            hasZ: false,
            paths: [[event.vertices[0], event.vertices[1]]],
            spatialReference:geosenceView.spatialReference
          },
          symbol: GeoSenceConfig.polylinesymbol as LineSymbolType
        });

        const distance = geometryEngine.geodesicLength(radiusgraphic.geometry, 'meters');
        const geometry = geometryEngine.geodesicBuffer(point1, distance, 'meters') as Polygon;
        const area = geometryEngine.geodesicArea(geometry, 'square-meters');
        const circlegraphic = new Graphic({
          geometry: geometry,
          symbol: GeoSenceConfig.polygonsymbol as FillSymbolType
        });

        const y = point2.y - point1.y
        const x = point2.x - point1.x
        const angleInDegrees1 = (Math.atan2(y, x) * 180) / Math.PI;
        let angleInDegrees = 0
        if (y > 0 && x > 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        } else if (y > 0 && x < 0) {
          angleInDegrees = parseFloat((450 - angleInDegrees1).toFixed(2))
        } else if (y < 0 && x < 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        } else if (y < 0 && x > 0) {
          angleInDegrees = parseFloat((90 - angleInDegrees1).toFixed(2))
        }

        const radiusdistancelabelsymbol = { ...GeoSenceConfig.textsymbol } as TextSymbolType;
        const radiusdistancelabelstring = distance > 1852 ? i18n.global.t('message.gis.maptoolbar.measurement.radius') + (distance / 1000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.kilometers')
          :  i18n.global.t('message.gis.maptoolbar.measurement.radius') + distance.toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.meter');
        radiusdistancelabelsymbol.text = radiusdistancelabelstring;
        const radiusdistancelabelgraphic = new Graphic({
          geometry: point2,
          symbol: radiusdistancelabelsymbol
        });
        const arealabelsymbol = { ...GeoSenceConfig.textsymbol } as TextSymbolType;
        const arealabelstring = area > 1000000 ? i18n.global.t('message.gis.maptoolbar.measurement.area')  + (area / 1000000).toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.squarekilometers') 
          : i18n.global.t('message.gis.maptoolbar.measurement.area')+ area.toFixed(3) +' '+ i18n.global.t('message.gis.maptoolbar.measurement.squaremeter');
        arealabelsymbol.text = arealabelstring;
        const arealabelgraphic = new Graphic({
          geometry: point1,
          symbol: arealabelsymbol as TextSymbolType
        });

        const radiuslabelsymbol = { ...GeoSenceConfig.textsymbol } as TextSymbolType;
        const radiuslabelstring = angleInDegrees +i18n.global.t('message.gis.maptoolbar.measurement.degree');
        radiuslabelsymbol.text = radiuslabelstring;
        const radiuslabelgraphic = new Graphic({
          geometry: radiusgraphic.geometry.extent.center,
          symbol: radiuslabelsymbol
        });

        geosenceView.map.remove(drawCircleTemplayer);
        drawMeasureGraphiclayer.add(circlegraphic);
        drawMeasureGraphiclayer.add(radiusgraphic);
        drawMeasureGraphiclayer.add(radiusdistancelabelgraphic);
        drawMeasureGraphiclayer.add(arealabelgraphic);
        drawMeasureGraphiclayer.add(radiuslabelgraphic);
        ismeasurementcomplete(false)
      }
    }
    )

}