import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_GISCONFIG_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

service.interceptors.request.use(
	(config:any) => {
		return config;
	},
	(error:any) => {
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	(response:any) => {
		const res = response.data;
		if (res.code && res.code !== 200) {
			if (res.code === 401 || res.code === 4001) 
			{
			}else if((res.code === 403)){
				ElMessage.error(res.msg)
			}else if (res.code === 400) {
				ElMessage.error(res.msg)
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error:any) => {
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);
export default service;
