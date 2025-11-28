import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import esriRequest from "@arcgis/core/request";
import SHCTiledParamsOptions from './SHCTiledParams'
import axios from 'axios'

export default class SHCTiledLayer extends BaseTileLayer {
  private reDrawSize: [number, number] = [512, 512];
  private reDrawOrigin: any = { "x": -66000, "y": 75000 };
  private reDrawlods: any = [
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
    }
  ];
  
  private lodsLevelMapping: any = {
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
  };
  
  private rowColInfos: any = {
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
  };
  
  private defaultSize: [number, number] = [256, 256];
  private size2: [number, number] = [512, 512];
  private defaultOrigin: any = {
    "x": -2.0037508342787E7,
    "y": 2.0037508342787E7,
    "spatialReference": SpatialReference.WebMercator
  };
  
  // 添加自定义属性
  private tileInfoExtended: any = {
    size2: this.size2,
    origin2: { "x": -66000, "y": 75000 },
    lods2: this.reDrawlods,
    lodsLevelMapping: this.lodsLevelMapping
  };
  
  private url: any;
  private token: any;
  
  constructor(SHClayeroption: SHCTiledParamsOptions) {
    super();
    this.id = SHClayeroption.id ? SHClayeroption.id : '';
    this.title = SHClayeroption.title ? SHClayeroption.title : '';
    this.opacity = SHClayeroption.opacity ? SHClayeroption.opacity : 1;
    this.url = SHClayeroption.url;
    this.token = SHClayeroption.token ? SHClayeroption.token : '';
    this.maxScale = 564.248588;
    this.minScale = 577790.554289;
    this.fullExtent = SHClayeroption.fullExtent;
  }
  
  private _getTile(level: number, row: number, col: number, options?: any): any {
    const lt_x = this.tileInfo.origin.x + col * this.tileInfo.lods[level].resolution * this.tileInfo.size[0];
    const lt_y = this.tileInfo.origin.y - (row * this.tileInfo.lods[level].resolution * this.tileInfo.size[1]);
    const rb_x = this.tileInfo.origin.x + (col + 1) * this.tileInfo.lods[level].resolution * this.tileInfo.size[0];
    const rb_y = this.tileInfo.origin.y - ((row + 1) * this.tileInfo.lods[level].resolution * this.tileInfo.size[1]);
    const _level = this.tileInfoExtended.lodsLevelMapping[level.toString()];
    const mapdistance = this.tileInfoExtended.lods2[_level].resolution * this.tileInfoExtended.size2[0];
    const scaleRatio = this.tileInfo.lods[level].scale / this.tileInfoExtended.lods2[_level].scale;
    
    let fromCol = Math.floor((lt_x - this.tileInfoExtended.origin2.x) / mapdistance);
    const fromRow = Math.floor((this.tileInfoExtended.origin2.y - lt_y) / mapdistance);
    const toCol = Math.floor((rb_x - this.tileInfoExtended.origin2.x) / mapdistance);
    const toRow = Math.floor((this.tileInfoExtended.origin2.y - rb_y) / mapdistance);
    
    const cols = (toCol - fromCol + 1);
    const rows = (toRow - fromRow + 1);
    let bigCanvas = document.createElement("canvas");
    let bigContext = bigCanvas.getContext("2d");
    bigCanvas.width = this.tileInfoExtended.size2[0] * cols;
    bigCanvas.height = this.tileInfoExtended.size2[0] * rows;
    const imageSize = this.tileInfoExtended.size2[0];
    
    let fetchTileImageDef = function (url: any, row: number, col: number) {
      return esriRequest(url, {
        responseType: "image"
      }).then(function (response) {
        var tileImage = response.data;
        bigContext?.drawImage(tileImage, col * imageSize, row * imageSize, imageSize, imageSize);
        return 0;
      }, function (error) {
        return 2;
      });
    };
    
    //处理空请求
    let fetchNodeDef = () => {
      return new Promise(() => { }).then(() => { return 1; });
    };
    
    const tileUrls: Array<any> = [];
    const fetchTileImageDefs: Array<any> = [];
    
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
          fetchTileImageDefs.push(fetchNodeDef()); //处理空请求
        }
      }
    }
    
    return axios.all(fetchTileImageDefs).then((results: any) => {
      const smallCanvas = document.createElement("canvas");
      const smallContext = smallCanvas.getContext("2d");
      smallCanvas.width = this.tileInfo.size[0];
      smallCanvas.height = this.tileInfo.size[0];
      
      if (results != 1) {
        const _xRatio = (lt_x - this.tileInfoExtended.origin2.x) / mapdistance - Math.floor((lt_x - this.tileInfoExtended.origin2.x) / mapdistance);
        const _yRatio = (this.tileInfoExtended.origin2.y - lt_y) / mapdistance - Math.floor((this.tileInfoExtended.origin2.y - lt_y) / mapdistance);
        const _x = Math.round(_xRatio * this.tileInfoExtended.size2[0]);
        const _y = Math.round(_yRatio * this.tileInfoExtended.size2[0]);
        const _imageSize = Math.round(this.tileInfo.size[0] * scaleRatio);
        smallContext?.drawImage(bigCanvas, _x, _y, _imageSize, _imageSize, 0, 0, this.tileInfo.size[0], this.tileInfo.size[0]);
      }
      
      return smallCanvas;
    });
  }
  
  private _getNoneTile(level: number, row: number, col: number) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = this.tileInfo.size[0];
    canvas.height = this.tileInfo.size[0];
    ctx!.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx!.fillRect(0, 0, this.tileInfo.size[0], this.tileInfo.size[1]);
    return Promise.resolve(canvas);
  }
  
  public fetchTile(level: number, row: number, col: number, options: any): any {
    let min = parseInt(Object.keys(this.lodsLevelMapping)[0]);
    let max = parseInt(Object.keys(this.lodsLevelMapping)[Object.keys(this.lodsLevelMapping).length - 1]);
    if (level >= min && level <= max) {
      return this._getTile(level, row, col);
    } else {
      return this._getNoneTile(level, row, col);
    }
  }
}
