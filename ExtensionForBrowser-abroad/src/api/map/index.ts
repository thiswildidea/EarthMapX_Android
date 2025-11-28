import request_gis from '/@/utils/request_gis';


export function get_mapconfig()  {
	return request_gis({
		url: '/config/mapconfig.json',
		method: 'get'
	})
}

