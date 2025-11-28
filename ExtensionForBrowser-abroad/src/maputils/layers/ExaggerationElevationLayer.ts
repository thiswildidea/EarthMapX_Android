import BaseElevationLayer from "@arcgis/core/layers/BaseElevationLayer";
import ExaggerationElevationParams from './ExaggerationElevationParams'
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
export default class ExaggerationElevationLayer extends BaseElevationLayer {

    private url:any
    public exaggeration:any
    private ElevationLayer: any = null;
 constructor(ExaggerationElevationOption:ExaggerationElevationParams) 
  {
     super()
     this.url = ExaggerationElevationOption.url 
     this.id = ExaggerationElevationOption.id
     this.exaggeration = ExaggerationElevationOption.exaggeration
  }
    public override load(): Promise<any> {
        this.ElevationLayer = new ElevationLayer({
            url: this.url,
            id: this.id
        });
        this.addResolvingPromise(this.ElevationLayer.load());
        return this.ElevationLayer.load();
    }

    public override fetchTile(level: number, row: number, col: number, options?: any): Promise<any> {
        return this.ElevationLayer.fetchTile(level, row, col, options).then(
            (data: any) => {
                var exaggeration = this.exaggeration;
                for (var i = 0; i < data.values.length; i++) {
                    data.values[i] = data.values[i] * exaggeration;
                }
                return data;
            }
        )
    }
}