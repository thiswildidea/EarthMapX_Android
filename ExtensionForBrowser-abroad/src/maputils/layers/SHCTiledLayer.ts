import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import esriRequest from "@arcgis/core/request";
import SHCTiledParamsOptions from './SHCTiledParams'
import axios from 'axios'
export default  class  SHCTiledLayer extends BaseTileLayer{
  private  reDrawSize: [number,number]= [512, 512]
  private  reDrawOrigin: any={ "x": -66000, "y": 75000 }
  private  reDrawlods:any =[{
                "level": 0,
                "resolution": 132.2919312505292,
                "scale": 500000
            }, {
                "level": 1,
                "resolution": 52.91677250021167,
                "scale": 200000
            }, {
                "level": 2,
                "resolution": 26.458386250105836,
                "scale": 100000
            }, {
                "level": 3,
                "resolution": 13.229193125052918,
                "scale": 50000
            }, {
                "level": 4,
                "resolution": 5.291677250021167,
                "scale": 20000
            }, {
                "level": 5,
                "resolution": 2.6458386250105836,
                "scale": 10000
            }, {
                "level": 6,
                "resolution": 1.3229193125052918,
                "scale": 5000
            }, {
                "level": 7,
                "resolution": 0.5291677250021167,
                "scale": 2000
            }, {
                "level": 8,
                "resolution": 0.26458386250105836,
                "scale": 1000
            }, {
                "level": 9,
                "resolution": 0.13229193125052918,
                "scale": 500
            }]
  private  lodsLevelMapping:any={
            "10": 0, //577790   //500000
            "11": 1, //288895   //200000
            "12": 2, //144447 //100000
            "13": 3, //72223  //50000
            "14": 3, //36111  //50000
            "15": 4, //18055  //20000
            "16": 5, //9027   //10000
            "17": 6, //4513   //5000
            "18": 7, //2256   //2000
            "19": 8, //1128   //1000
            "20": 9, //564    //500
    }
  private rowColInfos:any={
            0: {
                startTile: [0, 0],
                endTile: [2, 2]
            },
            1: {
                startTile: [0, 0],
                endTile: [5, 5]
            },
            2: {
                startTile: [0, 0],
                endTile: [11, 10]
            },
            3: {
                startTile: [0, 0],
                endTile: [22, 20]
            },
            4: {
                startTile: [1, 0],
                endTile: [55, 52]
            },
            5: {
                startTile: [2, 0],
                endTile: [111, 104]
            },
            6: {
                startTile: [4, 1],
                endTile: [222, 208]
            },
            7: {
                startTile: [11, 3],
                endTile: [557, 520]
            },
            8: {
                startTile: [22, 7],
                endTile: [1114, 1040]
            },
            9: {
                startTile: [44, 14],
                endTile: [2229, 2081]
            }
        }
   private defaultSize:[number,number]= [256, 256]
    private defaultOrigin:any= {
            "x": -2.0037508342787E7,
            "y": 2.0037508342787E7,
            "spatialReference": SpatialReference.WebMercator
        }
    public tileInfo:any= new TileInfo({
            "dpi": 96,
            "format": "png",
            "spatialReference": SpatialReference.WebMercator,
            "size":  [256, 256], //[256, 256];
            "size2": [512, 512], //[512, 512];
            "origin": {
            "x": -2.0037508342787E7,
            "y": 2.0037508342787E7,
            "spatialReference": SpatialReference.WebMercator
            },
            "origin2": { "x": -66000, "y": 75000 },
            "lods": [
                {
                    "level": 0,
                    "resolution": 156543.033928,
                    "scale": 5.91657527591555E8
                }, {
                    "level": 1,
                    "resolution": 78271.5169639999,
                    "scale": 2.95828763795777E8
                }, {
                    "level": 2,
                    "resolution": 39135.7584820001,
                    "scale": 1.47914381897889E8
                }, {
                    "level": 3,
                    "resolution": 19567.8792409999,
                    "scale": 7.3957190948944E7
                }, {
                    "level": 4,
                    "resolution": 9783.93962049996,
                    "scale": 3.6978595474472E7
                }, {
                    "level": 5,
                    "resolution": 4891.96981024998,
                    "scale": 1.8489297737236E7
                }, {
                    "level": 6,
                    "resolution": 2445.98490512499,
                    "scale": 9244648.868618
                }, {
                    "level": 7,
                    "resolution": 1222.99245256249,
                    "scale": 4622324.434309
                }, {
                    "level": 8,
                    "resolution": 611.49622628138,
                    "scale": 2311162.217155
                }, {
                    "level": 9,
                    "resolution": 305.748113140558,
                    "scale": 1155581.108577
                }, {
                    "level": 10,
                    "resolution": 152.874056570411,
                    "scale": 577790.554289
                }, {
                    "level": 11,
                    "resolution": 76.4370282850732,
                    "scale": 288895.277144
                }, {
                    "level": 12,
                    "resolution": 38.2185141425366,
                    "scale": 144447.638572
                }, {
                    "level": 13,
                    "resolution": 19.1092570712683,
                    "scale": 72223.819286
                }, {
                    "level": 14,
                    "resolution": 9.55462853563415,
                    "scale": 36111.909643
                }, {
                    "level": 15,
                    "resolution": 4.77731426794937,
                    "scale": 18055.954822
                }, {
                    "level": 16,
                    "resolution": 2.38865713397468,
                    "scale": 9027.977411
                }, {
                    "level": 17,
                    "resolution": 1.19432856685505,
                    "scale": 4513.988705
                }, {
                    "level": 18,
                    "resolution": 0.597164283559817,
                    "scale": 2256.994353
                }, {
                    "level": 19,
                    "resolution": 0.298582141647617,
                    "scale": 1128.497176
                }, {
                    "level": 20,
                    "resolution": 0.14929107082380833,
                    "scale": 564.248588
                }, {
                    "level": 21,
                    "resolution": 0.07464553541190416,
                    "scale": 282.124294
                }, {
                    "level": 22,
                    "resolution": 0.03732276770595208,
                    "scale": 141.062147
                }, {
                    "level": 23,
                    "resolution": 0.01866138385297604,
                    "scale": 70.5310735
                }],
            "lods2": [
            {
                "level": 0,
                "resolution": 132.2919312505292,
                "scale": 500000
            }, {
                "level": 1,
                "resolution": 52.91677250021167,
                "scale": 200000
            }, {
                "level": 2,
                "resolution": 26.458386250105836,
                "scale": 100000
            }, {
                "level": 3,
                "resolution": 13.229193125052918,
                "scale": 50000
            }, {
                "level": 4,
                "resolution": 5.291677250021167,
                "scale": 20000
            }, {
                "level": 5,
                "resolution": 2.6458386250105836,
                "scale": 10000
            }, {
                "level": 6,
                "resolution": 1.3229193125052918,
                "scale": 5000
            }, {
                "level": 7,
                "resolution": 0.5291677250021167,
                "scale": 2000
            }, {
                "level": 8,
                "resolution": 0.26458386250105836,
                "scale": 1000
            }, {
                "level": 9,
                "resolution": 0.13229193125052918,
                "scale": 500
            }],
            "lodsLevelMapping": {
            "10": 0, //577790   //500000
            "11": 1, //288895   //200000
            "12": 2, //144447 //100000
            "13": 3, //72223  //50000
            "14": 3, //36111  //50000
            "15": 4, //18055  //20000
            "16": 5, //9027   //10000
            "17": 6, //4513   //5000
            "18": 7, //2256   //2000
            "19": 8, //1128   //1000
            "20": 9, //564    //500
        },
    })
    private url:any
    private token:any
  constructor(SHClayeroption:SHCTiledParamsOptions) 
  {
     super()
     this.id=SHClayeroption.id? SHClayeroption.id:''
     this.title=SHClayeroption.title?SHClayeroption.title:''
     this.opacity=SHClayeroption.opacity? SHClayeroption.opacity:1
     this.url=SHClayeroption.url 
     this.token=SHClayeroption.token?SHClayeroption.token:''
     this.maxScale= 564.248588
     this. minScale= 577790.554289
     this.fullExtent=SHClayeroption.fullExtent
  }
    private _getTile(level:number, row:number, col:number, options?:any):any {
        const lt_x = this.tileInfo.origin.x + col * this.tileInfo.lods[level].resolution * this.tileInfo.size[0];
        const lt_y = this.tileInfo.origin.y - (row * this.tileInfo.lods[level].resolution * this.tileInfo.size[1]);
        const rb_x = this.tileInfo.origin.x + (col + 1) * this.tileInfo.lods[level].resolution * this.tileInfo.size[0];
        const rb_y = this.tileInfo.origin.y - ((row + 1) * this.tileInfo.lods[level].resolution * this.tileInfo.size[1]);
        const _level = this.tileInfo.lodsLevelMapping[level.toString()];
        const mapdistance = this.tileInfo.lods2[_level].resolution * this.tileInfo.size2[0];
        const scaleRatio = this.tileInfo.lods[level].scale / this.tileInfo.lods2[_level].scale;
        let fromCol = Math.floor((lt_x - this.tileInfo.origin2.x) / mapdistance);
        const fromRow = Math.floor((this.tileInfo.origin2.y - lt_y) / mapdistance);
        const toCol = Math.floor((rb_x - this.tileInfo.origin2.x) / mapdistance);
        const toRow = Math.floor((this.tileInfo.origin2.y - rb_y) / mapdistance);

        const cols = (toCol - fromCol + 1);
        const rows = (toRow - fromRow + 1);
        let bigCanvas = document.createElement("canvas");
        let bigContext = bigCanvas.getContext("2d");
        bigCanvas.width = this.tileInfo.size2[0] * cols;
        bigCanvas.height = this.tileInfo.size2[0] * rows;
        const imageSize = this.tileInfo.size2[0];
        let fetchTileImageDef = function (url:any, row:number, col:number) {
            return esriRequest(url, {
                responseType: "image",
                allowImageDataAccess: true
            }).then(function (response) {
                var tileImage = response.data;
                bigContext?.drawImage(tileImage, col * imageSize, row * imageSize, imageSize, imageSize);
                return 0;
            }, function (error) {
                return 2;
            });
        }
        //处理空请求
        let fetchNodeDef =  ()=> {
            return new Promise(() => { }).then(() => { return 1; });
        }

        const tileUrls:Array<any> = [];
        const fetchTileImageDefs:Array<any> = [];
        for (let jRow = fromRow; jRow <= toRow; jRow++) {
            tileUrls[jRow - fromRow] = [];
            for (let iCol = fromCol; iCol <= toCol; iCol++) {
                if (jRow >= this.rowColInfos[_level].startTile[0] && jRow <= this.rowColInfos[_level].endTile[0]
                    && iCol >= this.rowColInfos[_level].startTile[1] && iCol <= this.rowColInfos[_level].endTile[1]) {
                    let _url = this.url + "/tile/" + _level + "/" + jRow + "/" + iCol;
                    if (this.token) {
                        _url += "?token=" + this.token;
                    }
                    tileUrls[jRow - fromRow][iCol - fromCol] = _url
                    fetchTileImageDefs.push(fetchTileImageDef(_url, jRow - fromRow, iCol - fromCol));
                } else {
                    fetchTileImageDefs.push(fetchNodeDef); //处理空请求
                }
            }
        }

        return axios.all(fetchTileImageDefs).then((results:any)=> {
            if (results == 1) {
                const smallContext = smallCanvas.getContext("2d");
                smallCanvas.width = this.tileInfo.size[0];
                smallCanvas.height = this.tileInfo.size[0];
                return smallCanvas;
            }
            const _xRatio = (lt_x - this.tileInfo.origin2.x) / mapdistance - Math.floor((lt_x - this.tileInfo.origin2.x) / mapdistance);
            const _yRatio = (this.tileInfo.origin2.y - lt_y) / mapdistance - Math.floor((this.tileInfo.origin2.y - lt_y) / mapdistance);
            const _x = Math.round(_xRatio * this.tileInfo.size2[0]);
            const _y = Math.round(_yRatio * this.tileInfo.size2[0]);
            const smallCanvas = document.createElement("canvas");
            const smallContext = smallCanvas.getContext("2d");
            smallCanvas.width = this.tileInfo.size[0];
            smallCanvas.height = this.tileInfo.size[0];
            const _imageSize = Math.round(this.tileInfo.size[0] * scaleRatio);
            smallContext?.drawImage(bigCanvas, _x, _y, _imageSize, _imageSize, 0, 0, this.tileInfo.size[0], this.tileInfo.size[0]);
            return smallCanvas;
        });
    }

    private  _getNoneTile(level:number, row:number, col:number){
        var currCanvas = document.createElement("canvas");
        var currCanvas = currCanvas.getContext("2d");
        currCanvas.width = this.tileInfo.size[0];
        currCanvas.height = this.tileInfo.size[0];
        currCanvas.fillStyle = 'rgba(0, 0, 0,0)';
        currCanvas.fillRect(0, 0, this.tileInfo.size[0], this.tileInfo.size[1]);
        return new Promise(() => {
            return currCanvas;
        });
    }
    public fetchTile(level:number, row:number, col:number, options:any):any {
        let min = parseInt(Object.keys(this.lodsLevelMapping)[0]);
        let max = parseInt(Object.keys(this.lodsLevelMapping)[Object.keys(this.lodsLevelMapping).length - 1]);
        if (level >= min && level <= max) {
            return this._getTile(level, row, col);
        } else {
            return this._getNoneTile(level, row, col);
        }
    }
}