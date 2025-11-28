<template>
	<div class="esri-widget esri-maptoolbar">
	  <div class="esri-maptoolbar-control">
		<el-tooltip :content="state.controlTooltips" placement="top" close-delay="10">
         <div class="esri-maptoolbar-control-button"   @click="openmaptoolbar">
            <span class="esri-icon-toolbar"></span>
		 </div>
		</el-tooltip>
		  <!-- <span>{{$t(maptoolbarUIlang)}}</span> -->
	  </div>
	<transition name="el-zoom-in-center">
	  <div class="esri-maptoolbar-container" v-show='state.isopen'>
         <div class="esri-maptoolbar-container-left">
           
		 </div>
		  <div class="esri-maptoolbar-container-right">
			 <div  class="esri-maptoolbar-toolitem-sepator"></div>
			 <el-tooltip content="home" placement="left">
               <div  class="esri-maptoolbar-toolitem" @click="initmapcamera">
                  <span class="esri-icon-home"></span>
			  </div>
			 </el-tooltip>
			 <div  class="esri-maptoolbar-toolitem-sepator"></div>
			 <div class='esri-maptoolbar-toolitem-zoom-container'>
			  <div class='esri-maptoolbar-toolitem-zoomitems'>
				<el-tooltip content="zoomin" placement="left">
			      <div  class="esri-maptoolbar-toolitem" @mousedown="maptoolbarzoomMoveInaction"  @click="viewzoomin">
                     <span class="esri-icon-zoomIn"></span>
			       </div>
				</el-tooltip>
				  <el-tooltip content="zoomout" placement="left">
			        <div  class="esri-maptoolbar-toolitem" @mousedown="maptoolbarzoomMoveInaction" @click="viewzoomout">
                       <span class="esri-icon-zoomOut"></span>
			         </div>
				  </el-tooltip>
			   </div>
			   	<transition name="el-zoom-in-center">
					<div class="esri-maptoolbar-toolitem-zoomlevel-container" v-show='state.zoombarisopen'>
					    <el-slider  vertical class="esri-maptoolbar-toolitem-zoomlevel" v-model="state.mapzoom"  :min=state.mapminzoom :max=state.mapmaxzoom :step=0.1 @change="changeviewzoom"/>
					 </div>
				</transition>
			 </div>
			 <div  class="esri-maptoolbar-toolitem-sepator" v-show="false"></div>
			<el-tooltip content="fullscreen" placement="left">
			   <div  class="esri-maptoolbar-toolitem" v-show="false">
                <span class="esri-icon-fullscreen"></span>
			  </div>
			</el-tooltip>
             <div  class="esri-maptoolbar-toolitem-sepator"></div>
			 <el-tooltip content="locate" placement="left">
			   <div  class="esri-maptoolbar-toolitem" @click="btnlocate" >
                <span :class="[{'esri-icon-locate':!state.islocate},{'esri-icon-locate':state.islocate},{'active':state.islocate}]"></span>
			   </div>
			</el-tooltip>
			 <!-- <el-tooltip content="Measure" placement="right">
			  <div class='esri-maptoolbar-toolitem-measurement-container'>
			   <div class='esri-maptoolbar-toolitem-measurement'>
			      <div  class="esri-maptoolbar-toolitem"   @click="openMeasurement">
                     <span class="esri-icon-measurement"></span>
			       </div>
			    </div>
			    	<transition name="el-zoom-in-center">
					<div class="esri-maptoolbar-toolitem-measurementitem-container" v-show='state.measurementbarisopen'>
					   <el-tooltip content="Point" placement="top">
					    <div  class="esri-maptoolbar-toolitem sencondardy" @click="measure_point">
                            <span class="esri-icon-measure-point" :class="{active:state.active_measure_point}"></span>
			            </div>
					   </el-tooltip>
					   <div  class="esri-maptoolbar-toolitem-measurement-sepator"></div>
					  <el-tooltip content="Polyline" placement="top">
					     <div  class="esri-maptoolbar-toolitem sencondardy" @click="measure_polyline" >
                            <span class="esri-icon-measure-polyline" :class="{active:state.active_measure_polyline}"></span>
			             </div>
					  </el-tooltip>
					  <el-tooltip content="Rectangle" placement="top">
					     <div  class="esri-maptoolbar-toolitem sencondardy" @click="measure_rectangle" >
                            <span class="esri-icon-measure-rectangle" :class="{active:state.active_measure_rectangle}"></span>
			             </div>
					  </el-tooltip>
					 <div  class="esri-maptoolbar-toolitem-measurement-sepator"></div>
					  <el-tooltip content="Polygon" placement="top">
					     <div  class="esri-maptoolbar-toolitem sencondardy" @click="measure_polygon">
                            <span class="esri-icon-measure-polygon" :class="{active:state.active_measure_polygon}"></span>
			            </div>
					  </el-tooltip>
					  <div  class="esri-maptoolbar-toolitem-measurement-sepator"></div>
					   <el-tooltip content="Circle" placement="top">
					     <div  class="esri-maptoolbar-toolitem sencondardy" @click="measure_circle">
                            <span class="esri-icon-measure-circle" :class="{active:state.active_measure_polycircle}"  ></span>
			             </div>
					   </el-tooltip>
					    <div  class="esri-maptoolbar-toolitem-measurement-sepator"></div>
						<el-tooltip content="Clean" placement="top">
						 <div  class="esri-maptoolbar-toolitem sencondardy"  @click="measure_clean">
                            <span class="esri-icon-measure-clean"></span>
			             </div>
						</el-tooltip>
					 </div>
			 	</transition>
			  </div>
			 </el-tooltip>
			 <div  class="esri-maptoolbar-toolitem-sepator"></div> -->
			 <el-tooltip content="23dswitch" placement="left">
			   <div  class="esri-maptoolbar-toolitem" @click="switch23dmode">
                <span :class="[{'esri-icon-3d':state.is3dmode},{'esri-icon-2d':!state.is3dmode}]"></span>
			   </div>
			</el-tooltip>
			<div  class="esri-maptoolbar-toolitem-sepator"></div>
			 <!-- <el-tooltip :content="$t('message.gis.maptoolbar.splitscreen')" placement="left">
			   <div  class="esri-maptoolbar-toolitem" @click="splitscreen">
                <span class="esri-icon-splitscreen" :class="{active:Issplitscreen}"></span>
			   </div>
			</el-tooltip>
			<div  class="esri-maptoolbar-toolitem-sepator" v-show="Issplitscreen"></div>
			 <el-tooltip :content="$t('message.gis.maptoolbar.screenInteract')" placement="left">
			   <div  class="esri-maptoolbar-toolitem" @click="screenInteract" v-show="Issplitscreen">
                <span class="esri-icon-screeninteract" :class="{active:IsScreenInteract}"></span>
			   </div>
			</el-tooltip> -->
		 </div>
	  </div>
	</transition>
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
import{pointMeasurement,polylineMeasurement,rectangleMeasurement,polygonMeasurement,polycircleMeasurement} from '/@/components/gis/maptoolbar/measurement';
import GeoSenceConfig from '/@/config/GeoSenceConfig';
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Camera from "@arcgis/core/Camera";
import Extent from "@arcgis/core/geometry/Extent";
import { useMapStore } from '/@/stores/modules/map'
import {get_mapconfig} from "/@/api/map/index"
import MaptoolbarState from '/@/components/gis/maptoolbar/MaptoolbarState';
import { createLocateService } from '/@/components/gis/maptoolbar/locateService';
export default {
	name: 'maptoolbar',
	emits: ['switchmapmode'],
	props: {
		ViewContainer_type: {
			type: String,
			default: () => 'MainScreen',
		},
		modelValue: String,
	},
	setup(props, { emit }) {
		const mapStore = useMapStore();
		const state: any = reactive<MaptoolbarState>({
		 is3dmode:mapStore.state.is3dmode,
		 initextent:null,
		 initcamera: null,
		 isopen:true,
		 controlTooltips:'HideToolbar',
		 zoombarisopen:false,
		 islocate:false,
		 mapzoom:0,
		 mapminzoom:0,
		 mapmaxzoom:23,
		 maptoolbarUIlang:'message.gis.maptoolbar.UIName',
	     measurementbarisopen:false,
		 active_measure_point:false,
		 active_measure_polyline:false,
		 active_measure_rectangle:false,
		 active_measure_polygon:false,
		 active_measure_polycircle:false,
		 drawmeasuregraphiclayerID:'drawmeasuregraphiclayer',
		//  Issplitscreen:store.state.GisConfig.GisConfig.Issplitscreen,
		//  IsScreenInteract:store.state.GisConfig.GisConfig.IsScreenInteract
		});
    // const is3dmode = computed(() => {
	// 	state.is3dmode=store.state.GisConfig.GisConfig.is3dmode;
	// });
     onBeforeMount(async()=>{
        let mapconfig:any = await get_mapconfig()
		state.initcamera=mapconfig.initcamera
		state.initextent=mapconfig.initextent
     })
	onMounted(() => {
		
	});
	watch(()=>mapStore.state.is3dmode, (val:any) => {
		 state.is3dmode= val;
	   }
	);

   watch(()=>mapStore.state.GeoSenceViewStatary, (val:any) => {
		if(val){
			const geoview =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type)
			if(geoview)
			  state.mapzoom=geoview.mapzoom
		}
	   }
	);
   watch(
	 ()=>mapStore.state.MainViewloaded, (val:any) => {
		if(val){
		    const geoview =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type)
	        if(geoview){
		        state.mapzoom=geoview.mapzoom
				state.mapminzoom=geoview.mapminzoom
                state.mapmaxzoom=geoview.mapmaxzoom
			}
		  }
	  }
	);
	// 创建定位服务实例
let locateService = createLocateService(props.ViewContainer_type);

const btnlocate=()=>{
  state.islocate=!state.islocate;
  if(state.islocate){
    locateService.startLocate();
  }else{
    locateService.stopLocate();
  }
};
	 const openmaptoolbar = () => {
          state.isopen=! state.isopen
		  state.controlTooltips=state.isopen? "HideToolbar":"ShowToolBar"
	   };
	const changeviewzoom=()=>{
		const geosenceView =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type).view
		geosenceView.zoom=state.mapzoom
        //  state.zoombarisopen=false
	  };
	const maptoolbarzoomMoveInaction=()=>{
        state.zoombarisopen=true
	};

	const viewzoomin=()=>{
		const geosenceView =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type)
		let step=0
		geosenceView.view.type==='3d'?step=0.1 :step=1
        if((geosenceView.view.zoom+step)<geosenceView.mapmaxzoom)
		geosenceView.view.zoom= geosenceView.view.zoom+step
		state.mapzoom =geosenceView.view.zoom
	};
	const viewzoomout=()=>{
		const geosenceView =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type)
	    let step=0
		geosenceView.view.type==='3d'?step=0.1 :step=1
       if((geosenceView.view.zoom-step)>geosenceView.mapminzoom)
		geosenceView.view.zoom= geosenceView.view.zoom-step
		state.mapzoom =geosenceView.view.zoom
	};
	const initmapcamera=()=>{
	if(state.is3dmode){
	  const camera = new Camera({
      fov: state.initcamera.fov,
      heading: state.initcamera.heading,
      position: {
        x: state.initcamera.x,
        y: state.initcamera.y,
        z: state.initcamera.z,
        spatialReference: SpatialReference.WebMercator
      },
      tilt: state.initcamera.tilt
    });
	  const geosenceView =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type).view
      geosenceView.goTo(camera,state.initcamera.options)
	 }
	else{
	  const initextent = new Extent({
        xmin: state.initextent.xmin,
        ymin: state.initextent.ymin,
        xmax: state.initextent.xmax,
        ymax: state.initextent.ymax,
        spatialReference: {wkid: 102100}
       })
	   const geosenceView =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type).view
       geosenceView.goTo({
             extent: initextent,
             zoom: state.initextent.zoom
		}).then(()=>{
			geosenceView.rotation=0
		})
	  }
	};
	
	const openMeasurement=()=>{
        state.measurementbarisopen=!state.measurementbarisopen
	};
	
	const measure_point=()=>{
	   state.active_measure_point=true
	   state.active_measure_polyline=false
	   state.active_measure_rectangle=false
	   state.active_measure_polygon=false
	   state.active_measure_polycircle=false
       pointMeasurement(state.drawmeasuregraphiclayerID,props.ViewContainer_type,(iscomplete:any)=>{
         state.active_measure_point=iscomplete
         return {};
	   })
	}
	const measure_polyline=()=>{
	   state.active_measure_point=false
	   state.active_measure_polyline=true
	   state.active_measure_rectangle=false
	   state.active_measure_polygon=false
	   state.active_measure_polycircle=false
       polylineMeasurement(state.drawmeasuregraphiclayerID,props.ViewContainer_type,(iscomplete:any)=>{
         state.active_measure_polyline=iscomplete
         return {};
	   })
	}
   const measure_rectangle=()=>{
	   state.active_measure_point=false
	   state.active_measure_polyline=false
	   state.active_measure_rectangle=true
	   state.active_measure_polygon=false
	   state.active_measure_polycircle=false
       rectangleMeasurement(state.drawmeasuregraphiclayerID,props.ViewContainer_type,(iscomplete:any)=>{
         state.active_measure_rectangle=iscomplete
         return {};
	   })
	}
	const measure_polygon=()=>{
	   state.active_measure_point=false
	   state.active_measure_polyline=false
	   state.active_measure_rectangle=false
	   state.active_measure_polygon=true
	   state.active_measure_polycircle=false
       polygonMeasurement(state.drawmeasuregraphiclayerID,props.ViewContainer_type,(iscomplete:any)=>{
         state.active_measure_polygon=iscomplete
         return {};
	   })
	}
	const measure_circle=()=>{
	   state.active_measure_point=false
	   state.active_measure_polyline=false
	   state.active_measure_rectangle=false
	   state.active_measure_polygon=false
	   state.active_measure_polycircle=true
       polycircleMeasurement(state.drawmeasuregraphiclayerID,props.ViewContainer_type,(iscomplete:any)=>{
         state.active_measure_polycircle=iscomplete
         return {};
	   })
	}
	
	const measure_clean=()=>{
    const geosenceView =GeoSenceConfig.getGeoSenceView(props.ViewContainer_type).view
	let drawmeasuregraphiclayer = geosenceView.map.findLayerById(state.drawmeasuregraphiclayerID);
	if (drawmeasuregraphiclayer) {
         geosenceView.map.remove(drawmeasuregraphiclayer);
	   }
	}
   const switch23dmode=()=>{
	  state.is3dmode=!state.is3dmode
	  mapStore.setis3dmodel(state.is3dmode)
	}

// 组件销毁时清理定位资源
onBeforeUnmount(()=>{
  locateService.stopLocate();
});
	return {
		openmaptoolbar,
		changeviewzoom,
		maptoolbarzoomMoveInaction,
        viewzoomin,
		viewzoomout,
		btnlocate,
		initmapcamera,
		openMeasurement,
		measure_point,
		measure_polyline,
		measure_rectangle,
		measure_polygon,
		measure_circle,
		measure_clean,
		switch23dmode,
		state,
		...toRefs(state),
	};
 },
};
</script>
