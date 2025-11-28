# EsriMap Gallery Chrome Extension

基于 ArcGIS JavaScript API 4.32 开发的 Chrome 扩展程序，用于可视化和展示地图数据，包括实时地震数据展示功能。

## 项目简介

EsriMap Gallery 是一个功能丰富的浏览器扩展，利用 ArcGIS JavaScript API 的强大功能，在浏览器中提供交互式地图可视化体验。扩展支持多种地图底图、实时数据加载、多语言界面，并具备响应式设计，适应不同的浏览器环境。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5
- **地图 API**: ArcGIS JavaScript API 4.32
- **状态管理**: Pinia
- **多语言支持**: Vue I18n
- **UI 组件库**: Element Plus
- **网络请求**: Axios
- **样式预处理**: SCSS

## 功能特性

### 地图功能
1. **多源底图支持**: 
   - ArcGIS 矢量底图 (streets-vector)
   - 夜间地球图层 (Earth at Night)
   - 支持自定义图层加载

2. **地图交互控件**:
   - 缩放控制
   - 指南针
   - 主页按钮
   - 图层列表
   - 全屏模式

3. **地震数据可视化**:
   - 实时加载 USGS 全球地震数据
   - 根据地震震级进行符号化显示（不同大小和颜色）
   - 支持地震数据属性展示

### 系统功能
1. **多语言支持**: 
   - 中文（简体）
   - 英文

2. **响应式设计**: 适应不同浏览器窗口大小

3. **本地化存储**: 使用 Chrome 存储 API 保存用户偏好设置

4. **性能优化**: 使用异步加载和按需渲染提升性能

## 安装和运行

### 环境要求
- Node.js >= 16.x
- npm >= 7.x
- Chrome 浏览器 >= 90

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

开发服务器启动后，可以通过浏览器访问 `http://localhost:5173` 进行预览。

### 构建生产版本

```bash
npm run build
```

构建完成后，`dist` 目录将包含所有扩展文件。

### 构建并监视变更

```bash
npm run watch
```

## 加载到 Chrome

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择构建后的 `dist` 目录

## 项目结构

```
├── public/                # 公共资源目录（打包时复制到 dist）
│   ├── assets/            # 静态资源
│   ├── config/            # 配置文件
│   └── icons/             # 扩展图标
├── src/                   # 源代码目录
│   ├── api/               # API 接口定义
│   ├── assets/            # 资源文件
│   ├── components/        # Vue 组件
│   │   ├── gis/           # GIS 相关组件
│   │   ├── EarthquakeMap.vue  # 地震地图组件
│   │   └── LanguageSwitcher.vue # 语言切换组件
│   ├── config/            # 配置文件
│   │   └── GeoSenceConfig.ts  # GIS 配置
│   ├── i18n/              # 多语言配置
│   │   ├── lang/          # 语言文件
│   │   └── pages/         # 页面级语言配置
│   ├── maputils/          # 地图工具类
│   │   ├── GeoSenceView.ts    # 地图视图类
│   │   └── GeoSenceViewBase.ts # 地图视图基类
│   ├── stores/            # Pinia 状态管理
│   │   └── modules/       # 模块状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   │   └── gis/           # GIS 页面
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── manifest.json          # Chrome 扩展配置
├── index.html             # HTML 入口文件
├── vite.config.ts         # Vite 配置
└── package.json           # 项目依赖配置
```

## API 说明

### 地震数据 API

项目使用 USGS (美国地质调查局) 提供的实时地震数据 API：

```
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
```

该 API 返回过去 24 小时内全球发生的所有地震事件，包括震级、时间、位置、深度等信息。

### ArcGIS 服务

扩展使用多个 ArcGIS 在线服务：
- 底图服务: `streets-vector`
- 夜间地球图层: `https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Earth_at_Night_WM/MapServer`

## 配置说明

### 环境变量

项目支持以下环境变量（可在 `.env`、`.env.development` 或 `.env.production` 文件中设置）：

- `VITE_APP_API_BASE_URL`: API 基础 URL
- `VITE_APP_MAP_TOKEN`: ArcGIS 地图服务访问令牌（可选）

### 地图配置

地图相关配置位于 `src/config/GeoSenceConfig.ts` 文件中，可自定义：
- 地图资源路径
- 地图符号配置
- 测量工具设置

## 浏览器兼容性

- Chrome 浏览器 >= 90
- Edge 浏览器 >= 90
- 其他基于 Chromium 的浏览器（理论上支持）

## 开发说明

### 添加新的地图图层

1. 在 `src/maputils/utils.ts` 中添加新的图层初始化函数
2. 在 `src/components/EarthquakeMap.vue` 中引入并使用新图层

### 添加新的语言支持

1. 在 `src/i18n/lang/` 目录下创建新的语言文件
2. 在 `src/i18n/index.ts` 中注册新语言

### 自定义地震符号显示

修改 `src/components/EarthquakeMap.vue` 中的 `createSymbol` 函数，调整符号大小和颜色逻辑。

## 许可证

MIT

## 致谢

- [ArcGIS JavaScript API](https://developers.arcgis.com/javascript/latest/)
- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
