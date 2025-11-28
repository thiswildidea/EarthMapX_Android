export  default interface MaptoolbarState {
  is3dmode: boolean;
  initextent: any; 
  initcamera: any;  
  isopen: boolean;
  controlTooltips: any;  
  zoombarisopen: boolean;
  islocate: boolean;
  mapzoom: number;
  mapminzoom: number;
  mapmaxzoom: number;
  maptoolbarUIlang:String,
  measurementbarisopen:boolean,
  active_measure_point:boolean,
  active_measure_polyline:boolean,
  active_measure_rectangle:boolean,
  active_measure_polygon:boolean,
  active_measure_polycircle:boolean,
  drawmeasuregraphiclayerID:String,
}