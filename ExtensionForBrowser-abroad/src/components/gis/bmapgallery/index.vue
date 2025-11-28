<template>
	<div class="esri-widget esri-bmapgallery">
	<transition name="el-zoom-in-center">
      <div  class="esri-bmapgallery-Menu" v-show='isopen'>
		 <div  v-for="(v, k) in basemapconfig" :key="k">
			<el-tooltip :content="v.layerEName" placement="top" close-delay="10">
               <div class="esri-bmapgallery-Menu-Item" :class="{active:activeindex==k}" :style="`background-image: url(./icons/map/bmapgallery/${v.layerEName}.png)`" @click="basemapswitch(v,k)">
                  <!-- <span>{{$t(v.lang)}}</span> -->
               </div>
			</el-tooltip>
		 </div>
         <div class="esri-bmapgallery-Menu-under" v-show="is3dmode">
			<span>UG</span>
            <el-switch v-model="isunderground"  :active-color="`var(--next-color-orange)`" :inactive-color="`var(--next-color-green)`" @change="undergroundChange"></el-switch>
         </div>
		 <div class="esri-bmapgallery-Menu-divider" v-show="is3dmode"></div>
		 <div class="esri-bmapgallery-Menu-Elevation" v-show="is3dmode">
			<el-tooltip :content="$t('message.gis.bmapgallery.ElevationExaggeration')" placement="top" close-delay="10">
               <el-slider class="esri-bmapgallery-Menu-Elevation-opacity"   v-model="elevationExaggeration"  :min=1 :max=100 :step=2 :disabled="isElevation" />
			</el-tooltip>
			<el-tooltip :content="$t('message.gis.bmapgallery.Elevation')" placement="top" close-delay="10">
               <el-switch v-model="isElevation"  :active-color="`var(--next-color-orange)`" :inactive-color="`var(--next-color-green)`" @change="elevationChange"></el-switch>
			</el-tooltip>
         </div>
	  </div>
	</transition>
	  <div class="esri-bmapgallery-detail">
         <div class="esri-bmapgallery-detail-Item"  :style="`background-image: url(./icons/map/bmapgallery/${selectbasemapEName}.png)`" @click="openbasemapgallery">
		   <el-tooltip content="Opacity" placement="top" close-delay="10">
			 <el-slider class="esri-bmapgallery-detail-Item-opacity"  v-model="basemaplayeropacity"  :min=0 :max=1 :step=0.1 @change="changebasemaplayeropacity"/>
		   </el-tooltip>
         </div>
	  </div>
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive,onBeforeMount,onMounted, nextTick, computed, watch,defineComponent } from 'vue';
import { useMapStore } from '/@/stores/modules/map'
import { get_mapconfig } from '/@/api/map/index';
import { switchbasemap,setbasemaplayeropacity,undergroundchange,elevationchange,changeElevationexaggeration} from '/@/components/gis/bmapgallery/basemapgallery';
export default {
	name: 'bmapgallery',
	emits: ['switchbasemap','setbasemaplayeropacity','undergroundchange'],
	props: {
		ViewContainer_type: {
			type: String,
			default: () => 'MainScreen',
		},
		modelValue: String,
	},
	setup(props, { emit }) {
		const mapStore = useMapStore();
		const state: any = reactive({
		 is3dmode:mapStore.state.is3dmode,
		 activeindex:0,
		 isunderground:true,
		  isElevation:true,
		 isopen:false,
		 selectbasemapEName:"World_Imagery",
		 selectbasemaplang:"message.gis.bmapgallery.World_Imagery",
		 basemapconfig: null,
		  mapconfig: null,
		 basemaplayeropacity:1,
		 elevationExaggeration:50
		});

	  watch(()=>mapStore.state.is3dmode, (val:any) => {
		 state.is3dmode= val;
	   }
	);
	 const basemapswitch = (basemap:any,index:any) => {
		 state.activeindex=index
		 state.selectbasemapEName=basemap.layerEName,
		 state.selectbasemaplang=basemap.lang
		//  emit('switchbasemap', basemap);
		 switchbasemap(basemap,props.ViewContainer_type)
		 openbasemapgallery()
		};
	  const undergroundChange = () => {
		undergroundchange(state.isunderground,props.ViewContainer_type)
        // emit('undergroundchange', state.isunderground);
	   };

	   const elevationChange = () => {
		 elevationchange(state.isElevation,props.ViewContainer_type,state.mapconfig,state.elevationExaggeration)
	   };
       const changeElevationExaggeration = () => {
		 changeElevationexaggeration(state.elevationExaggeration,props.ViewContainer_type)
	   };
      const openbasemapgallery = () => {
          state.isopen=! state.isopen
	   };
	  const changebasemaplayeropacity=()=>{
		  setbasemaplayeropacity(state.basemaplayeropacity,props.ViewContainer_type)
        //  emit('setbasemaplayeropacity', state.basemaplayeropacity);
	  };
     onBeforeMount(async()=>{
        state.mapconfig = await get_mapconfig()
		state.basemapconfig =state.mapconfig.GISService.baseMapServices.layers
     })
	onMounted(() => {
		
	});
	return {
		basemapswitch,
		undergroundChange,
		changeElevationExaggeration,
		elevationChange,
		changebasemaplayeropacity,
		openbasemapgallery,
		...toRefs(state) as unknown as {
        isopen: boolean;
        is3dmode: boolean;
        activeindex: number;
        isunderground: boolean;
        selectbasemapEName: string;
        selectbasemaplang: string;
        basemapconfig: any;
        basemaplayeropacity: number;
    }
	};
	}
};
</script>
