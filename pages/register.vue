<template>
	<view class="normal-login-container">
		<view class="logo-content align-center justify-center flex">
			<image style="width: 100rpx;height: 100rpx;" :src="globalConfig.appInfo.logo" mode="widthFix">
			</image>
			<text class="title">若依移动端注册</text>
		</view>
		<view class="login-form-content">
			<view class="input-item flex align-center">
				<view class="iconfont icon-user icon"></view>
				<input v-model="registerForm.userName" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="registerForm.password" type="password" class="input" placeholder="请输入密码"
					maxlength="20" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="registerForm.confirmPassword" type="password" class="input" placeholder="请输入重复密码"
					maxlength="20" />
			</view>


			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="registerForm.email" class="input" placeholder="请输入邮箱地址" maxlength="20" />
			</view>


			<view class="input-item flex align-center" style="width: 60%;margin: 0px;" v-if="captchaEnabled">
				<view class="iconfont icon-code icon"></view>
				<input v-model="registerForm.emailCode" type="number" class="input" placeholder="请输入邮箱验证码"
					maxlength="4" />
				<view class="login-code">
					<button class="login-button" @click="email">邮箱验证</button>
				</view>
			</view>


			<view class="input-item flex align-center" style="width: 60%;margin: 0px;margin-top: 20px"
				v-if="captchaEnabled">
				<view class="iconfont icon-code icon"></view>
				<input v-model="registerForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
				<view class="login-code">
					<image :src="codeUrl" @click="getCode" class="login-code-img"></image>
				</view>
			</view>
			<view class="action-btn">
				<button @click="handleRegister()" class="register-btn cu-btn block bg-blue lg round">注册</button>
			</view>


		</view>
		<view class="xieyi text-center">
			<text @click="handleUserLogin" class="text-blue">使用已有账号登录</text>
		</view>
	</view>
</template>

<script>
	import {
		getCodeImg,
		register,
		getEmail
	} from '@/api/login'
	import {
		v4 as uuidv4
	} from 'uuid';
	export default {
		data() {
			return {
				uuid: '',
				codeUrl: "",
				captchaEnabled: true,
				globalConfig: getApp().globalData.config,
				registerForm: {
					userName: "",
					password: "",
					confirmPassword: "",
					code: "",
					uuid: "",
					email: "",
					emailCode: "",
					emailType: "REGISTER", //邮箱验证码主题
					source: "app-user",
				}
			}
		},
		created() {
			this.uuid = this.generateUUID();
			this.getCode()
		},
		methods: {

			generateUUID() {
				return uuidv4().replace(/-/g, ''); // 去掉UUID中的连字符
			},
			// 用户登录
			handleUserLogin() {
				this.$tab.navigateTo(`/pages/login`)
			},
			// 获取图形验证码
			getCode() {
				getCodeImg({
					uuid: this.uuid
				}).then(res => {
					this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
					if (this.captchaEnabled) {
						this.codeUrl = 'data:image/gif;base64,' + res.img
						this.registerForm.uuid = res.uuid
					}
				})
			},
			// 注册方法
			async handleRegister() {
				if (this.registerForm.userName === "") {
					this.$modal.msgError("请输入您的账号")
				} else if (this.registerForm.password === "") {
					this.$modal.msgError("请输入您的密码")
				} else if (this.registerForm.confirmPassword === "") {
					this.$modal.msgError("请再次输入您的密码")
				} else if (this.registerForm.password !== this.registerForm.confirmPassword) {
					this.$modal.msgError("两次输入的密码不一致")
				} else if (this.registerForm.code === "" && this.captchaEnabled) {
					this.$modal.msgError("请输入验证码")
				} else {
					this.$modal.loading("注册中，请耐心等待...")
					this.register()
				}
			},
			// 用户注册
			async register() {
				register(this.registerForm).then(res => {
					this.$modal.closeLoading()
					uni.showModal({
						title: "系统提示",
						content: "恭喜你，您的账号 " + this.registerForm.userName + " 注册成功！",
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: `/pages/login`
								});
							}
						}
					})
				}).catch(() => {
					if (this.captchaEnabled) {
						this.getCode()
					}
				})
			},
			// 注册成功后，处理函数
			registerSuccess(result) {
				// 设置用户信息
				this.$store.dispatch('GetInfo').then(res => {
					this.$tab.reLaunch('/pages/index')
				})
			},
			email() {
				getEmail(this.registerForm).then(res => {
					this.$modal.msgSuccess("成功发送，请即时接收");
					const countdownInterval = setInterval(() => {
						this.seconds--;
						this.showEmail = '邮箱' + this.seconds
						if (this.seconds === 0) {
							clearInterval(countdownInterval);
							this.emailLoading = false;
							this.showEmail = '邮箱验证'
						}
					}, 1000);
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.normal-login-container {
		width: 100%;

		.logo-content {
			width: 100%;
			font-size: 21px;
			text-align: center;
			padding-top: 15%;

			image {
				border-radius: 4px;
			}

			.title {
				margin-left: 10px;
			}
		}

		.login-form-content {
			text-align: center;
			margin: 20px auto;
			margin-top: 15%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

			}

			.register-btn {
				margin-top: 40px;
				height: 45px;
			}

			.xieyi {
				color: #333;
				margin-top: 20px;
			}

			.login-code {
				height: 38px;
				float: right;

				.login-code-img {
					height: 38px;
					position: absolute;
					margin-left: 10px;
					width: 200rpx;
				}

				.login-button {
					line-height: 38px;
					height: 38px;
					position: absolute;
					margin-left: 10px;
					width: 200rpx;
					font-size: 12px;
				}

				.login-button::after {
					border: none
				}
			}
		}
	}
</style>