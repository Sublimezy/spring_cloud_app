<template>
	<view class="content">
		<search></search>
		<u-toast ref="uToast"></u-toast>
		<view>
			<u-swiper :list="list3" indicator indicatorMode="line" circular></u-swiper>
		</view>



		<view>
			<swiper :indicator-dots="true" class="swiper">
				<swiper-item>
					<u-grid align="center" col="4" :border="false">

						<u-grid-item @click="shop(item.id)" v-for="(item, index) in navigationItems" :index="index"
							:key="index">
							<u-icon :name="item.icon" custom-prefix="custom-icon" size="30" color="#888888"></u-icon>
							<text class="grid-text">{{ item.name }}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>

				<swiper-item>
					<u-grid align="center" col="4" :border="false">
						<u-grid-item v-for="(item, index) in navigationItems" :index="index" :key="index">
							<u-icon :name="item.icon" custom-prefix="custom-icon" size="30" color="#888888"></u-icon>
							<text class="grid-text">{{ item.name }}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>

				<swiper-item>

				</swiper-item>
			</swiper>


		</view>

		<view class="main-content">

			<view @click="quickInfo(item)" class="main-content-item" v-for="(item,index) in shopContent " :key="index">
				<image :src="item.shopEvent.eventLogo"></image>

				<view class="main-content-item-text">
					<text class="main-content-item-title">{{item.shopEvent.eventName}}</text>
				</view>
				<view class="main-content-item-ping">
					<text v-if="item.contentType===false">{{item.shopEvent.score}}分</text>
					<text v-else>{{item.shopEvent.score}}%好评</text>
				</view>
				<view v-if="item.contentType===true" class="main-content-item-amount">
					<span class="main-content-item-amount-icon">￥</span>
					<span class="main-content-item-amount-anount">{{item.shopEvent.amount}}</span>
					<span v-if="item.shopEvent.isDiscount===1"
						class="main-content-item-amount-original">￥{{item.shopEvent.originAmount}}</span>
				</view>
			</view>



		</view>




	</view>
</template>

<script>
	// 导入组件的路径需要使用字符串形式，并且需要确保路径的准确性和正确性
	import search from '@/components/search/search.vue'; // 假设组件路径为 src/components/search/search.vue
	import {
		getShopType,
		getShopIndexList
	} from '@/api/home/home'
	import store from "@/store";
	export default {
		components: {
			search // 注册组件，使其在模板中可用
		},
		data() {
			return {
				city: "",
				title: 'map',
				latitude: 39.909, // 默认纬度
				longitude: 116.39742, // 默认经度(北京天安门)
				address_info: "",
				address_info_recomd: "",
				address: "",
				paramss: {
					type: 'default',
					title: '默认主题',
					message: "锦瑟无端五十弦",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/default.png'
				},


				list3: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				navigationItems: [],
				shopContent: []
			};
		},
		onLoad() {
			this.getList()
			this.isGetLocation();
		},
		methods: {
			quickInfo(item) {
				if (item.contentType === true) {
					// 使用 encodeURIComponent 对参数进行编码，以防止特殊字符导致的问题
					let shopEventInfo = encodeURIComponent(JSON.stringify(item.shopEvent));
					this.$tab.navigateTo(
						`shop/tradeOrder/tradeOrder?shopEventInfo=${shopEventInfo}&shopId=${item.shopEvent.shopId}`
					);
				} else {
					this.$tab.navigateTo(`shop/shopDetail/shopDetail?shopId=${item.shopEvent.shopId}`);

				}

			},
			getList() {
				getShopType().then(res => {
					this.navigationItems = res.rows
				})

				getShopIndexList().then(res => {
					this.shopContent = res.rows
				})

			},
			shop(type) {
				console.log(type)
				this.$tab.navigateTo(`/pages/shop/shop?type=${type}`);


			},
			isGetLocation(a = "scope.userLocation") { //检查当前是否已经授权访问scope属性
				var _this = this;
				uni.getSetting({
					success(res) {
						console.log("getSetting")
						console.log(res)
						if (!res.authSetting[a]) {
							//每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
							console.log("当前未授权")
							_this.getAuthorizeInfo()
						} else {
							console.log("当前已授权")
							//方式一
							// _this.getLocationInfo();
							// 方式二
							_this.getLocation();
						}
					}
				});
			},
			getAuthorizeInfo(a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				var _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
						//方式一
						// _this.getLocationInfo();
						// 方式二
						_this.getLocation();
					}
				})
			},

			getLocationInfo() {
				console.log("直接调用即可")
				//直接调用即可
				uni.chooseLocation({
					success: (res) => {
						console.log("chooseLocation")
						console.log(res)
						if (res.errMsg == "chooseLocation:ok") {
							this.address_info = res.name + res.address;
							this.latitude = res.latitude;
							this.longitude = res.longitude;
						}
					}
				})
			},
			//获取当前所在位置的经纬度
			getLocation() {
				console.log("获取当前所在位置的经纬度")
				uni.getLocation({
					type: 'wgs84 ',
					success: (res) => {
						console.log("返回信息")
						console.log(res)
						this.latitude = res.latitude.toString()
						this.longitude = res.longitude.toString()

						console.log("经度" + this.longitude)
						console.log("纬度" + this.latitude)
						store.commit('SET_LNG', this.longitude);
						store.commit('SET_LAT', this.latitude);

						// 获取地理位置详情信息
						this.getLocationDetail()
					},
					fail: (res) => {
						console.log("返回失败信息")
						console.log(res)
					},
					complete: (res) => {
						console.log("返回完成信息")
						console.log(res)
						console.log(res.errMsg)
					}
				});


			},

			//根据经纬度获取详细的地址
			getLocationDetail() {

				let location = this.latitude + ',' + this.longitude;
				console.log("根据经纬度获取详细的地址" + location)
				//调用逆解析接口
				uni.request({
					url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=location', //腾讯官方逆解析接口，可直接复制
					method: "GET",
					data: {
						location: location,
						'key': "SFRBZ-XRJKQ-ADY5B-2RARX-BGXMO-GOBAE", //自己申请的Key
					},
					success: (re) => {
						//成功获取到经纬度
						console.log(re)
						if (re.statusCode == 200) {
							this.address_info_recomd = re.data.result.formatted_addresses.recommend
							this.address_info = re.data.result.address_reference.town.title + re.data.result
								.address_reference.street.title + re.data.result.address_reference.landmark_l2
								.title
							this.address = re.data.result.address
							console.log("当前地理位置:" + this.address)

							store.commit('SET_ADDRESS', this.address);
						} else {
							uni.showToast({
								title: '获取地理位置失败，请重试',
								icon: "none"
							})
						}
					},
					fail: (res) => {
						console.log("失败返回根据经纬度获取详细的地址信息")
						console.log(res)
					},
					complete: (res) => {
						console.log("最终返回根据经纬度获取详细的地址信息")
						console.log(res)
						console.log(res.errMsg)
					}
				});
			}

		},
		onPullDownRefresh() {

		},
		onReachBottom() {
			// this.shopContent = [...this.shopContent, ...this.shopContent]
		},


	}
</script>

<style scoped>
	.main-content-item-amount-original {
		color: #7F7F7F;
		font-size: 8px;
		text-decoration: line-through;
	}

	.main-content-item-text {
		width: 100%;
		/* 视需求设置容器宽度 */
		padding: 6px;
	}

	.main-content-item-ping {
		padding-left: 6px;
		padding-right: 6px;
		color: #7F7F7F;
		font-size: 8px;
	}

	.main-content-item-amount-anount {
		color: red;
		font-size: 16px;
	}

	.main-content-item-amount-icon {
		color: red;
		font-size: 8px;
	}

	.main-content-item-amount {

		padding: 6px;
	}

	.main-content-item-title {
		color: #191919;
		font-size: 11px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5em;
		/* 根据需要设置行高 */
		max-height: 3em;
		/* 行高乘以显示行数 */
		white-space: normal;
	}

	.main-content-item image {
		width: 100%;
		height: 120px;
		border-radius: 6px 6px 0px 0px;

	}

	.main-content-item {
		margin-top: 10px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		width: 45%;
		border-radius: 6px;
	}

	.main-content {
		display: flex;
		flex-wrap: wrap;
		width: 100%;

		justify-content: space-evenly;
		border-radius: 10px;
	}

	.type-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.type-box {
		display: flex;
		flex-direction: column;
		width: 25%;
		height: 60px;
		text-align: center;
		align-items: center;
		justify-content: center;
		margin-top: 5px;


	}

	.type-box image {
		width: 30px;
		height: 30px;
	}

	.type-text {
		display: inline-block;
		font-size: 10px;
		height: 20px;
		text-align: center;
		line-height: 20px;

	}
</style>
<style lang="scss">
	.swiper {
		height: 300rpx;
		margin-top: 12px;
	}
</style>