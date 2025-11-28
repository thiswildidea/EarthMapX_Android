<template>
	<div class="esri-widget esri-mapgallery">
	 <el-tooltip content="mapgallery" placement="left" close-delay="10">
	  <div class="esri-mapgallery-detail">
         <div class="esri-mapgallery-detail-Item"  :style="`background-image: url(./icons/map/mapgallery/mapgalleryUI.svg)`" @click="openmapgallery">
           
		 </div>
		  <!-- <span >{{$t(mapgalleryUIlang)}}</span> -->
	  </div>
	 </el-tooltip>
	  <transition name="el-zoom-in-center">
	   <div class="esri-mapgallery-Menu-Container" v-show='state.isopen'>
           <div  class="esri-mapgallery-Menu esri-mapgallery-FMenu" >
			<div class="esri-mapgallery-Menu-Item-container FMenu-Item-container" :class="{active:state.firstactiveindex==k}"  v-for="(v, k) in state.firstmenuconfig"  :key="k" @click="firstmenuclick(v,k)">
             <el-tooltip :content="v.layerEName" placement="top" close-delay="10">
			   <div class="esri-mapgallery-Menu-Item FMenu-Item" :style="`background-image: url(./icons/map/mapgallery/${v.layerEName}.svg)`" >
                    
               </div>
			 </el-tooltip>
			   <!-- <span>{{$t(v.lang)}}</span> -->
			 </div>
	       </div>
		    <transition name="el-zoom-in-center">
		        <div  class="esri-mapgallery-Menu esri-mapgallery-SMenu" v-show='state.sencondmenuisopen'>
				 <div class="esri-mapgallery-Menu-Item-container SMenu-Item-container" :class="{active:state.sencondactiveindex==k}" v-for="(v, k) in state.sencondmenuconfig" :key="k" @click="sencondmenuclick(v,k)">
                   <el-tooltip :content="v.layerEName" placement="top" close-delay="10">
					  <div class="esri-mapgallery-Menu-Item SMenu-Item"  :style="`background-image: url(./icons/map/mapgallery/${v.layerEName}.png)`" >
                      </div>
					</el-tooltip>
				    <!-- <span>{{$t(v.lang)}}</span> -->
				</div>
	           </div>
			</transition>
			<transition name="el-zoom-in-center">
		        <div  class="esri-mapgallery-Menu esri-mapgallery-TMenu" :style="{maxHeight: `calc(100vh - ${state.headerHeight})`}" v-show='state.thirdmenuisopen'>
				<div class="esri-mapgallery-Menu-Item-container TMenu-Item-container" :class="[{active:v.active&&(v.usedin2d||(v.usedin2d===false&&state.is3dmode))},{notclickable:v.usedin2d===false&&!state.is3dmode}]" v-for="(v, k) in state.thirdmenuconfig" :key="k" @click="thridmenuclick(v,k)">
                  <el-tooltip :content="v.layerEName" placement="top" close-delay="10">
				    <div class="esri-mapgallery-Menu-Item TMenu-Item"  :style="`background-image: url(./icons/map/mapgallery/${v.layerEName}.png)`" >
                    </div>
				  </el-tooltip >
				   <!-- <span>{{$t(v.lang)}}</span> -->
				</div>
	           </div>
			</transition>
			<transition name="el-zoom-in-center">
			      <div  class="esri-mapgallery-Layerlist" :style="{maxHeight: `calc(100vh - ${state.headerHeight})`}" v-show='state.layerlistisopen'>
					 <div class="esri-mapgallery-Layerlist-close">
					   <span class="esri-mapgallery-Layerlist-close-name">Layerlist</span>
                        <i   class='esri-icon-close'  @click="closeMapAlllayers"></i>
					 </div>
					 <div class="esri-mapgallery-Layerlist-Item-container" :style="{maxHeight: `calc(100vh - ${state.headerHeight2})`}">
                        <div class="esri-mapgallery-Layerlist-Item"   v-for="(v, k) in state.layerlistconfig" :key="k" >
                          <span class="esri-mapgallery-Layerlist-Item-name">{{v.layerEName}}</span>
					  	  <el-slider class="esri-mapgallery-Layerlist-Item-opacity"  v-model="v.opacity" :min=0 :max=1 :step=0.1 @change="changelayeritemopacity(v)"/>
						  <div class="esri-mapgallery-Layerlist-Item-operation">
                              <i   class='esri-mapgallery-Layerlist-Item-visible' :class="[{'esri-icon-visible':v.visible},{'esri-icon-non-visible':!v.visible}]" @click="onsetlayervisbile(v)"></i>
						      <i   class='esri-icon-trash esri-mapgallery-Layerlist-Item-remove' @click="deletelayeritem(v)"></i>
						  </div>
						 
                       </div>
					 </div>
				  </div>
			</transition>
	   </div>
	  </transition>
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive,onBeforeMount,onMounted, nextTick, computed, watch } from 'vue';
import { useMapStore } from '/@/stores/modules/map'
import { get_mapconfig } from '/@/api/map/index';
import { addlayertoMap,removelayerfromMap,changlayeropacity,closeAllMaplayers,setlayervisbile} from '/@/components/gis/mapgallery/mapgallery';
import MapGalleryState from '/@/components/gis/mapgallery/MapGalleryState';
export default {
	name: 'mapgallery',
	emits: ['addlayertoMap','removelayerfromMap','changlayeropacity','setlayervisbile'],
	props: {
		ViewContainer_type: {
			type: String,
			default: () => 'MainScreen',
		},
		modelValue: String,
	},
	setup(props, { emit }) {
	   const mapStore = useMapStore();
		const state: any = reactive<MapGalleryState>({
		 is3dmode:mapStore.state.is3dmode,
		 headerHeight:'180px',
		 headerHeight2:'200px',
		 firstactiveindex:-1,
		 sencondactiveindex:-1,
		 isopen:false,
		 sencondmenuisopen:false,
		 thirdmenuisopen:false,
		 mapgalleryUIlang:'message.gis.mapgallery.UIName',
		 mapgalleryLayerListlang:'message.gis.mapgallery.LayerlistUIName',
		 layerlistisopen:false,
		 firstmenuconfig: [],
		 sencondmenuconfig: [],
		 thirdmenuconfig:[],
		 layerlistconfig:[]
		});

	  const openmapgallery = () => {
          state.isopen=! state.isopen
	   };
     const initalSencondMenu = (v:any) => {
       state.sencondmenuconfig=v.layerGroups
	 }

	const initalThirdMenu = (v:any) => {
        state.thirdmenuconfig=v.layers
	 }
	 
	 const firstmenuclick = (v:any,k:any) => {
		 state.sencondactiveindex=-1
		  if(state.firstactiveindex===k){
             state.sencondmenuisopen=!state.sencondmenuisopen
			 state.thirdmenuisopen=false
			 state.firstactiveindex=-1
		  } 
		  else{
			state.firstactiveindex=k
			state.sencondmenuisopen=true
			state.thirdmenuisopen=false
			initalSencondMenu(v)
		  }
	   };


	 const sencondmenuclick = (v:any,k:any) => {
		  if(state.sencondactiveindex===k){
             state.thirdmenuisopen=!state.thirdmenuisopen
			 state.sencondactiveindex=-1
		  } 
		  else{
			state.sencondactiveindex=k
			state.thirdmenuisopen=true
			initalThirdMenu(v)
		  }
		  state.thirdmenuconfig.map((item:any)=>{
			 const arrayInlayerlist= state.layerlistconfig.filter((layerlistitem:any)=>layerlistitem.layerEName ===item.layerEName)
              arrayInlayerlist.length?item.active=true:item.active=false
		  })
	   };
	   const thridmenuclick = (layer:any,k:any) => {
        state.thirdmenuconfig.map((item:any)=>{if(item.layerEName ===layer.layerEName)item.active=true})
		const layerarray= state.layerlistconfig.filter((item:any)=>item.layerEName ===layer.layerEName)
		if(!layerarray.length){
		 state.layerlistisopen=true;
		 layer.visible=true
		 state.layerlistconfig.push(layer)
		// emit('addlayertoMap', layer);
		 addlayertoMap(layer,props.ViewContainer_type)
		}
	   }

	 const changelayeritemopacity = (layer:any) => {
		changlayeropacity(layer,props.ViewContainer_type)
	//    emit('changlayeropacity', layer);
	}
	 const deletelayeritem = (layer:any) => {
		state.thirdmenuconfig.map((item:any)=>{if(item.layerEName ===layer.layerEName)item.active=false})
		const layerarray= state.layerlistconfig.filter((item:any)=>item.layerEName !==layer.layerEName)
		state.layerlistconfig=layerarray
		if(!state.layerlistconfig.length){
		  state.layerlistisopen=false;
		}
		//  emit('removelayerfromMap', layer);
        removelayerfromMap(layer,props.ViewContainer_type)
	}
	
	 const onsetlayervisbile = (layer:any) => {
        layer.visible=!layer.visible
		// emit('setlayervisbile', layer);
		setlayervisbile(layer,props.ViewContainer_type)
	 }
    const closeMapAlllayers = (layer:any) => {
	   state.thirdmenuconfig.map((item:any)=>item.active=false)
        closeAllMaplayers(state.layerlistconfig,props.ViewContainer_type)
	//    emit('closeAllMaplayers', state.layerlistconfig);
	   state.layerlistisopen=false;
	   state.layerlistconfig=[]
	}
	watch(()=>mapStore.state.is3dmode, (val:any) => {
		  state.layerlistconfig=[]
		   state.layerlistisopen=false;
		   state.is3dmode= val.is3dmode;
	},{ deep: true })
    onBeforeMount(async()=>{
        let mapconfig:any = await get_mapconfig()
		state.firstmenuconfig=mapconfig.GISService.bussinessLayers
    })
	onMounted(() => {
		
	});
	watch(state.layerlistconfig, (newValue:any, oldValue:any) => {
		//  state.layerlistisopen = newValue.length;
	   }
	);
	return {
		firstmenuclick,
		sencondmenuclick,
		thridmenuclick,
		openmapgallery,
		changelayeritemopacity,
		closeMapAlllayers,
		deletelayeritem,
		onsetlayervisbile,
		state,
		...toRefs(state),
	};
	},
};
</script>
