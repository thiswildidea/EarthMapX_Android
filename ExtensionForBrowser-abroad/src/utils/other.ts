import { App } from 'vue';
import * as svg from '@element-plus/icons-vue';
import SvgIcon from '/@/components/svgIcon/index.vue';

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */

export function elSvg(app: App) {
    const icons = svg as any;
    for (const i in icons) {
        app.component(`element${icons[i].name}`, icons[i]);
    }
    app.component('SvgIcon', SvgIcon);
}

export function isMobile() {
    if (
        navigator.userAgent.match(
            /('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
        )
    ) {
        return true;
    } else {
        return false;
    }
}
/**
 * 统一批量导出
 * @method elSvg 导出全局注册 element plus svg 图标
 * @method isMobile 判断是否是移动端
 */
const other = {
    elSvg: (app: App) => {
        elSvg(app);
    },
    isMobile: () => {
        return isMobile();
    },
};

// 统一批量导出
export default other;