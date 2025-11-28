<template>
  <div>
	<div class="esri-widget esri-maptoolbar">
	  <div class="esri-maptoolbar-control">
		<el-tooltip content="Donations to support" placement="top" close-delay="10">
         <div class="esri-maptoolbar-control-button" @click="showDonateDialog">
            <span class="esri-icon-donate"></span>
		 </div>
		</el-tooltip>
	  </div>
	</div>
	
	<!-- 支付宝捐赠对话框 -->
	<el-dialog
      v-model="dialogVisible"
      title="Support development"
      width="350px"
      center
      @closed="handleDialogClosed"
    >
      <div class="donate-content">
        <p class="donate-text">If you find this extension helpful, please scan the QR code below to make a donation</p>
        
        <!-- 支付方式切换 -->
        <div class="payment-switcher">
          <div 
            class="payment-option" 
            :class="{ active: paymentMethod === 'paypal' }"
            @click="switchPaymentMethod('paypal')"
          >
            <span class="payment-icon esri-icon-paypal"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
            <span class="payment-name">PayPal</span>
          </div>
          <div 
            class="payment-option" 
            :class="{ active: paymentMethod === 'alipay' }"
            @click="switchPaymentMethod('alipay')"
          >
            <span class="payment-icon esri-icon-alipay"></span>
            <span class="payment-name">Alipay</span>
          </div>
          <div 
            class="payment-option" 
            :class="{ active: paymentMethod === 'wechat' }"
            @click="switchPaymentMethod('wechat')"
          >
            <span class="payment-icon esri-icon-webchat"></span>
            <span class="payment-name">WeChat Pay</span>
          </div>
        </div>
        
        <div class="qrcode-container">
          <el-image
            :src="currentQRCode"
            :alt="getQRCodeAltText()"
            class="qrcode-image"
            fit="contain"
            @click="showQrCodePreview"
            @error="handleImageError"
            @load="handleImageLoad"
            v-loading="imageLoading"
            loading-text="Loading..."
          >
            <template #error>
              <div class="image-slot">
                <i class="el-icon-picture-outline"></i>
                <p>QR code loading failed</p>
              </div>
            </template>
          </el-image>
          <p class="qrcode-hint">Click on the QR code to enlarge and view</p>
        <p class="payment-tip">{{ getPaymentTipText() }}</p>
        </div>
        <p class="donate-thank">Thank you for your support!</p>
      </div>
    </el-dialog>
    
    <!-- 二维码预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      :title="getPreviewTitle()"
      width="350px"
      center
    >
      <div class="preview-container">
        <img :src="currentQRCode" :alt="getQRCodeAltText()" class="preview-qrcode" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

/**
 * 支付宝捐赠组件
 * 提供用户通过支付宝扫码进行捐赠的功能
 */
export default {
	name: 'DonateComponent', // 更清晰的组件名称
	setup() {
		// 状态管理
		const dialogVisible = ref(false); // 捐赠对话框可见性
		const previewVisible = ref(false); // 二维码预览对话框可见性
		const imageLoading = ref(false); // 图片加载状态
		/**
		 * 支付方式状态
		 * 'alipay' - 支付宝支付
		 * 'wechat' - 微信支付
		 * 'paypal' - PayPal支付
		 */
		const paymentMethod = ref<'alipay' | 'wechat' | 'paypal'>('paypal'); // 默认使用支付宝支付
		
		/**
		 * 支付宝二维码图片URL
		 * 注意：实际使用时请替换为真实的支付宝二维码图片路径
		 * 可以放在public/icons目录下，或使用网络图片地址
		 */
		const alipayQRCode = ref('./icons/pay/alipay-qrcode.png'); 
		
		/**
		 * 微信支付二维码图片URL
		 * 注意：实际使用时请替换为真实的微信支付二维码图片路径
		 * 可以放在public/icons目录下，或使用网络图片地址
		 */
		const wechatQRCode = ref('./icons/pay/wechat-qrcode.png');
		
		/**
		 * PayPal二维码图片URL
		 * 注意：实际使用时请替换为真实的PayPal二维码图片路径
		 * 可以放在public/icons目录下，或使用网络图片地址
		 */
		const paypalQRCode = ref('./icons/pay/paypal-qrcode.png');
		
		/**
		 * 获取当前选中的支付方式二维码
		 */
		const currentQRCode = computed(() => {
			if (paymentMethod.value === 'alipay') return alipayQRCode.value;
			if (paymentMethod.value === 'wechat') return wechatQRCode.value;
			if (paymentMethod.value === 'paypal') return paypalQRCode.value;
			return alipayQRCode.value; // 默认返回支付宝二维码
		});
		
		/**
		 * 切换支付方式
		 * @param method 支付方式 'alipay'、'wechat' 或 'paypal'
		 */
		const switchPaymentMethod = (method: 'alipay' | 'wechat' | 'paypal') => {
			if (method === 'alipay' || method === 'wechat' || method === 'paypal') {
				paymentMethod.value = method;
				// 切换支付方式时重新加载图片
				imageLoading.value = true;
				// 添加时间戳防止缓存影响
				const timestamp = new Date().getTime();
				if (method === 'alipay') {
					alipayQRCode.value = `./icons/pay/alipay-qrcode.png?t=${timestamp}`;
				} else if (method === 'wechat') {
					wechatQRCode.value = `./icons/pay/wechat-qrcode.png?t=${timestamp}`;
				} else if (method === 'paypal') {
					paypalQRCode.value = `./icons/pay/paypal-qrcode.png?t=${timestamp}`;
				}
			}
		}; 
		
		/**
		 * 显示捐赠对话框
		 * 打开捐赠对话框并设置图片加载状态
		 * 通过重置图片源确保每次打开对话框都能触发加载事件
		 */
		const showDonateDialog = () => {
			dialogVisible.value = true;
			imageLoading.value = true;
			// 重置当前选中的支付方式图片源，添加时间戳防止浏览器缓存影响
			const timestamp = new Date().getTime();
			if (paymentMethod.value === 'alipay') {
				alipayQRCode.value = `./icons/pay/alipay-qrcode.png?t=${timestamp}`;
			} else if (paymentMethod.value === 'wechat') {
				wechatQRCode.value = `./icons/pay/wechat-qrcode.png?t=${timestamp}`;
			} else if (paymentMethod.value === 'paypal') {
				paypalQRCode.value = `./icons/pay/paypal-qrcode.png?t=${timestamp}`;
			}
		};
		
		/**
		 * 显示二维码预览
		 * 打开大图预览对话框并根据当前支付方式显示相应提示
		 */
		const showQrCodePreview = () => {
			previewVisible.value = true;
			let message = '';
			switch (paymentMethod.value) {
				case 'alipay':
					message = 'Please scan the Alipay QR code';
					break;
				case 'wechat':
					message = 'Please scan the WeChat QR code';
					break;
				case 'paypal':
					message = 'Please scan the PayPal QR code';
					break;
				default:
					message = 'Please scan the QR code';
			}
			ElMessage.info(message);
		};
		
		/**
		 * 处理图片加载错误
		 * 显示错误消息并更新加载状态
		 */
		const handleImageError = () => {
			imageLoading.value = false;
			ElMessage.error('QR code image loading failed, please check the image path');
		};
		
		/**
		 * 处理图片加载成功
		 * 更新加载状态为完成
		 */
		const handleImageLoad = () => {
			imageLoading.value = false;
		};
		
		/**
		 * 处理对话框关闭事件
		 * 重置图片加载状态，防止二次打开时进度条一直显示
		 */
		const handleDialogClosed = () => {
			imageLoading.value = false;
		};
		
		/**
		 * 获取二维码的alt文本
		 * @returns 根据当前支付方式返回对应的alt文本
		 */
		const getQRCodeAltText = () => {
			switch (paymentMethod.value) {
				case 'alipay':
					return 'Alipay QR code';
				case 'wechat':
					return 'WeChat Pay QR code';
				case 'paypal':
					return 'PayPal QR code';
				default:
					return 'Payment QR code';
			}
		};
		
		/**
		 * 获取支付提示文本
		 * @returns 根据当前支付方式返回对应的提示文本
		 */
		const getPaymentTipText = () => {
			switch (paymentMethod.value) {
				case 'alipay':
					return 'Please scan the Alipay QR code';
				case 'wechat':
					return 'Please scan the WeChat QR code';
				case 'paypal':
					return 'Please scan the PayPal QR code';
				default:
					return 'Please scan the QR code';
			}
		};
		
		/**
		 * 获取预览对话框的标题
		 * @returns 根据当前支付方式返回对应的对话框标题
		 */
		const getPreviewTitle = () => {
			switch (paymentMethod.value) {
				case 'alipay':
					return 'Alipay QR code';
				case 'wechat':
					return 'WeChat Pay QR code';
				case 'paypal':
					return 'PayPal QR code';
				default:
					return 'Payment QR code';
			}
		};
		
		// 暴露组件属性和方法
		return {
			dialogVisible,
			previewVisible,
			imageLoading,
			paymentMethod,
			currentQRCode,
			paypalQRCode,
			switchPaymentMethod,
			showDonateDialog,
			showQrCodePreview,
			handleImageError,
			handleImageLoad,
			handleDialogClosed,
			getQRCodeAltText,
			getPaymentTipText,
			getPreviewTitle,
		};
	 },
};
</script>

<style scoped>
.donate-content {
  text-align: center;
  padding: 10px 0;
}

.donate-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.5;
}

.qrcode-container {
  margin: 20px 0;
  position: relative;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  cursor: pointer;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.qrcode-image:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.qrcode-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}

.donate-thank {
  font-size: 14px;
  color: #67c23a;
  margin-top: 20px;
  font-weight: 500;
}

/* 图片错误占位样式 */
/* 支付方式切换组件样式 */
.payment-switcher {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}

.payment-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.payment-option:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-option.active {
  border-color: #409eff;
  background-color: #ecf5ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.payment-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.payment-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.payment-option.active .payment-name {
  color: #409eff;
}

/* 支付提示文本样式 */
.payment-tip {
  font-size: 13px;
  color: #67c23a;
  margin-top: 8px;
  font-weight: 500;
}

/* 图片错误占位样式 */
.image-slot {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.image-slot i {
  font-size: 32px;
  color: #909399;
  margin-bottom: 10px;
}

.image-slot p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

/* 预览对话框样式 */
.preview-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.preview-qrcode {
  width: 300px;
  height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .qrcode-image {
    width: 180px;
    height: 180px;
  }
  
  .image-slot {
    width: 180px;
    height: 180px;
  }
  
  .preview-qrcode {
    width: 250px;
    height: 250px;
  }
  
  .payment-switcher {
    gap: 15px;
  }
  
  .payment-option {
    padding: 8px 15px;
  }
  
  .payment-icon {
    font-size: 20px;
  }
  
  .payment-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .qrcode-image {
    width: 150px;
    height: 150px;
  }
  
  .image-slot {
    width: 150px;
    height: 150px;
  }
  
  .preview-qrcode {
    width: 200px;
    height: 200px;
  }
  
  .donate-text {
    font-size: 13px;
  }
  
  .payment-switcher {
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }
  
  .payment-option {
    width: 120px;
    padding: 8px 10px;
  }
  
  .payment-tip {
    font-size: 12px;
  }
}
</style>
