import IGeoSenceViewOptions  from '/@/maputils/IGeoSenceViewOptions';
export default class GeoSenceViewBase {
   public mapconfig: any;
   public maptoken: string;
   public is3dmode: boolean;
   public view_Conatiner_Common:string;
   public view_Type_Name:any;
   public view:any;
   public drawMeasureTool:any;
   public mapzoom: any;
   public mapminzoom: any;
   public mapmaxzoom: any;
   public activated:any;
   public blurHandler:any;
   public focusHandler:any;
   public stationaryHandle:any;
   public mapStore:any
    // tslint:disable-next-line:no-empty
   constructor(GeoSenceViewOptions: IGeoSenceViewOptions) {
      this.mapconfig = GeoSenceViewOptions.mapconfig
      this.maptoken = GeoSenceViewOptions.maptoken!
      this.is3dmode =GeoSenceViewOptions.is3dmode
      this.view_Conatiner_Common="_ViewDiv_geosence"
      this.mapminzoom=0
      this.mapmaxzoom=23
      this.activated=false
    }
}
