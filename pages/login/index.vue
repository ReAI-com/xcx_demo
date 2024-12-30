<!-- 蓝色简洁登录页面 -->
<template>
	<view class="t-login">
		<!-- 页面装饰图片 -->
		<image class="img-a" src="@/static/login/2.png"></image>
		<image class="img-b" src="@/static/login/3.png"></image>
		<!-- 标题 -->
		<view class="t-b">{{ title }}</view>
		<form class="cl">
			<view class="t-a">
				<image src="@/static/login/sj.png"></image>
				<input type="number" name="phone" placeholder="请输入手机号" maxlength="11" v-model="phone" :disabled="loading" />
			</view>
			<view class="t-a">
				<image src="@/static/login/yz.png"></image>
				<input type="number" name="code" maxlength="6" placeholder="请输入验证码" v-model="yzm" :disabled="loading" />
				<view v-if="showText" class="t-c" @tap="getCode()" :class="{'disabled': !phone || loading}">发送短信</view>
				<view v-else class="t-c disabled">重新发送({{ second }})</view>
			</view>
			<button @tap="login()" :disabled="loading" :class="{'loading': loading}">
				<text v-if="!loading">登 录</text>
				<text v-else>登录中...</text>
			</button>
		</form>
		<view class="t-f"><text>————— 第三方账号登录 —————</text></view>
		<view class="t-e cl jic">
			<view class="t-g" @tap="wxLogin()"><image src="@/static/login/wx.png"></image></view>
			<!-- <view class="t-g" @tap="zfbLogin()"><image src="@/static/login/qq.png"></image></view> -->
		</view>
	</view>
</template>
<script>
import api  from '@/utils/request'
export default {
	data() {
		return {
			title: '欢迎回来！', //填写logo或者app名称，也可以用：欢迎回来，看您需求
			second: 60, //默认60秒
			showText: true, //判断短信是否发送
			phone: '', //手机号码
			yzm: '', //验证码
			loading: false //加载状态
		};
	},
	onLoad() {},
	methods: {
		//当前登录按钮操作
		async login() {
			var that = this;
			if (that.loading) return;
			
			if (!that.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' });
				return;
			}
			if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(that.phone)) {
				uni.showToast({ title: '请输入正确手机号', icon: 'none' });
				return;
			}
			if (!that.yzm) {
				uni.showToast({ title: '请输入验证码', icon: 'none' });
				return;
			}
			
			that.loading = true;
				// 调用后台验证验证码
			try {
				const res = await api.apiPost('/api/auth/verify-sms', {
					phone: that.phone,
					code: that.yzm
				}, 'host1');
				
				if (res.code === 0 && res.data) {
					// 存储token
					api.apiSetToken(res.data.token, res.data.expiresIn);
					uni.showToast({ 
						title: '登录成功！', 
						icon: 'success',
						duration: 2000
					});
					// 登录成功后跳转到首页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 2000);
				} else {
					uni.showToast({ 
						title: res.message || '验证码验证失败', 
						icon: 'none' 
					});
				}
			} catch (err) {
				uni.showToast({ 
					title: '网络错误，请稍后重试', 
					icon: 'none' 
				});
			} finally {
				that.loading = false;
			}
		},
		//获取短信验证码
		getCode() {
			var that = this;
			var interval = setInterval(() => {
				that.showText = false;
				var times = that.second - 1;
				//that.second = times<10?'0'+times:times ;//小于10秒补 0
				that.second = times;
				console.log(times);
			}, 1000);
			setTimeout(() => {
				clearInterval(interval);
				that.second = 60;
				that.showText = true;
			}, 60000);
			// 验证手机号格式
			if (!that.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' });
				return;
			}
			if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(that.phone)) {
				uni.showToast({ title: '请输入正确手机号', icon: 'none' });
				return;
			}
			
			that.loading = true;
			try {
				// 请求后台获取短信验证码
				const res = await api.apiPost('/api/auth/send-sms', {
					phone: that.phone
				}, 'host1');
				
				if (res.code === 0) {
					uni.showToast({ 
						title: '验证码已发送', 
						icon: 'success' 
					});
					that.showText = false;
				} else {
					clearInterval(interval);
					that.second = 60;
					that.showText = true;
					uni.showToast({ 
						title: res.message || '发送失败，请重试', 
						icon: 'none' 
					});
				}
			} catch (err) {
				clearInterval(interval);
				that.second = 60;
				that.showText = true;
				uni.showToast({ 
					title: '网络错误，请稍后重试', 
					icon: 'none' 
				});
			} finally {
				that.loading = false;
			}
		},
		//微信登录
		async wxLogin() {
			if (this.loading) return;
			this.loading = true;
			
			try {
				// 获取当前环境的服务商
				const [error, res] = await uni.getProvider({
					service: 'oauth'
				});
				
				if (error || !res.providers.includes('weixin')) {
					uni.showToast({ 
						title: '当前环境不支持微信登录', 
						icon: 'none' 
					});
					return;
				}
				
				// 调用微信登录
				const [loginErr, loginRes] = await uni.login({
					provider: 'weixin'
				});
				
				if (loginErr) {
					uni.showToast({ 
						title: '微信登录失败，请重试', 
						icon: 'none' 
					});
					return;
				}
				
				// 发送code到后端换取token
				const authRes = await api.apiPost('/api/auth/wx-login', {
					code: loginRes.code
				}, 'host1');
				
				if (authRes.code === 0 && authRes.data) {
					// 存储token
					api.apiSetToken(authRes.data.token, authRes.data.expiresIn);
					uni.showToast({ 
						title: '登录成功！', 
						icon: 'success',
						duration: 2000
					});
					// 登录成功后跳转到首页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 2000);
				} else {
					uni.showToast({ 
						title: authRes.message || '登录失败，请重试', 
						icon: 'none' 
					});
				}
			} catch (err) {
				console.error('微信登录错误:', err);
				uni.showToast({ 
					title: '网络错误，请稍后重试', 
					icon: 'none' 
				});
			} finally {
				this.loading = false;
			}
		},
		//第三方支付宝登录
		zfbLogin() {
			uni.showToast({ title: '支付宝登录', icon: 'none' });
		}
	}
};
</script>
<style>
.img-a {
	position: absolute;
	width: 100%;
	top: -280rpx;
	right: -100rpx;
}
.img-b {
	position: absolute;
	width: 50%;
	bottom: 0;
	left: -50rpx;
	z-index: -1;
}
.t-login {
	width: 600rpx;
	margin: 0 auto;
	font-size: 28rpx;
	color: #000;
	max-height: 100vh;
}

.t-login button {
	font-size: 28rpx;
	background: #5677fc;
	color: #fff;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 50rpx;
	box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
	transition: all 0.3s ease;
}

.t-login button.loading {
	opacity: 0.8;
	background: #7591fd;
}

.t-login button:disabled {
	background: #a7a7a7;
	box-shadow: none;
}

.t-login input {
	padding: 0 20rpx 0 120rpx;
	height: 90rpx;
	line-height: 90rpx;
	margin-bottom: 50rpx;
	background: #f8f7fc;
	border: 1px solid #e9e9e9;
	font-size: 28rpx;
	border-radius: 50rpx;
}

.t-login .t-a {
	position: relative;
}

.t-login .t-a image {
	width: 40rpx;
	height: 40rpx;
	position: absolute;
	left: 40rpx;
	top: 28rpx;
	border-right: 2rpx solid #dedede;
	padding-right: 20rpx;
}

.t-login .t-b {
	text-align: left;
	font-size: 46rpx;
	color: #000;
	padding: 300rpx 0 120rpx 0;
	font-weight: bold;
}

.t-login .t-c {
	position: absolute;
	right: 22rpx;
	top: 22rpx;
	background: #5677fc;
	color: #fff;
	font-size: 24rpx;
	border-radius: 50rpx;
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 25rpx;
	transition: all 0.3s ease;
}


.t-login .t-c.disabled {
	background-color: #A7A7A7;
	cursor: not-allowed;
}

.t-login .t-d {
	text-align: center;
	color: #999;
	margin: 80rpx 0;
}

.t-login .t-e {
	text-align: center;
	width: 250rpx;
	margin: 80rpx auto 0;
}

.t-login .t-g {
	float: left;
	width: 50%;
}

.t-login .t-e image {
	width: 50rpx;
	height: 50rpx;
}

.t-login .t-f {
	text-align: center;
	margin: 200rpx 0 0 0;
	color: #666;
}

.t-login .t-f text {
	margin-left: 20rpx;
	color: #aaaaaa;
	font-size: 27rpx;
}

.t-login .uni-input-placeholder {
	color: #000;
}

.cl {
	zoom: 1;
	
}
.jic{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.cl:after {
	clear: both;
	display: block;
	visibility: hidden;
	height: 0;
	content: '\20';
}
</style>
