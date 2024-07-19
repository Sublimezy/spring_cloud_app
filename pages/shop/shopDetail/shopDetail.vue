<template>
	<view class="shopDetail">
		<view class="shopDetailTop">
			<view class="shopDetailTopCon">
				<text class="shopDetailTopTitle">{{shopInfo.name}}</text>
				<view class="shopDetailTopRate">
					<u-rate size="10px" :count="5" v-model="shopInfo.score"></u-rate>
					<text>({{shopInfo.comments}}人评价)</text>
					<text>{{shopInfo.avgPrice}}/人</text>
				</view>
				<view class="shopDetailTopRate">
					<text>营业时间</text>
					<text>{{shopInfo.openHours}}</text>
				</view>
				<image class="shopDetailTopImage" :src="shopInfo.images"></image>
			</view>

			<view class="horizontal-line"></view>
			<view class="shopDetailTopAddress">
				<view class="shopDetailTopAddressLeft">
					<u-icon name="map-fill" size="10px"></u-icon>
					<text>{{shopInfo.address}}</text>
				</view>

				<view class="shopDetailTopAddressRight">
					<view style="margin-right: 10px;"><u-icon :name="car" size="16px"></u-icon></view>
					<view><u-icon :name="phone" size="16px"></u-icon></view>
				</view>
			</view>

		</view>

		<u-toast ref="uToast"></u-toast>
		<view class="shopEvent">
			<view style="display: flex;">
				<u-icon :name="tuan" size="16px"></u-icon>
				<text>团购套餐</text>
			</view>

			<view v-for="(item,index) in shopEventList" :key="index" class="shoplist-item">

				<image class="shoplist-item-image" :src="item.eventLogo">
				</image>

				<view class="shoplist-item-info">
					<view>
						<view class="main-content-item-text">
							<text class="shoplist-item-info-name">{{item.eventName}}</text>
						</view>
						<view class="shoplist-item-info-area">
							<text>{{item.startDate}}</text>

							<text>{{item.endDate}}</text>
						</view>
						<view class="shoplist-item-info-area">
							<text>{{item.remark}}</text>
						</view>

					</view>

					<view class="shoplist-item-info-amount-con">
						<text class="shoplist-item-info-amount">￥{{item.amount}}/人</text>
						<view>
							<button @click="tradeOrder(item)" class="distanceButton">抢购</button>
						</view>

					</view>



				</view>

			</view>


		</view>

		<u-loadmore isDotloadingIcon="spinner" dashed :status="loadMoreStatus" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" />

	</view>
</template>

<script>
	import {
		queryShopDetaile,
		getShopEvent
	} from '@/api/shop/shop'
	export default {
		data() {
			return {
				loadMoreStatus: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了',
				defaultNomareToast: {
					type: 'default',
					message: "我也是有底线的~",
				},
				defaultNomareOnloadToast: {
					type: 'default',
					message: "暂无活动",
				},
				defaultLoadingToast: {
					type: 'default',
					message: "正在加载中~",
				},
				value: 3,
				total: null,
				searchParams: {
					shopId: "",
					pageNum: 1,
					pageSize: 4,

				},
				shopInfo: {},
				car: "http://127.0.0.1:9000/shop2/2024/06/15/出租车_20240615083615A002.png",
				phone: "http://127.0.0.1:9000/shop2/2024/06/15/电话_20240615083405A001.png",
				tuan: "http://127.0.0.1:9000/shop2/2024/06/15/团购_20240615100749A003.png",
				shopEventList: []
			}
		},
		methods: {
			tradeOrder(item) {

				// 使用 encodeURIComponent 对参数进行编码，以防止特殊字符导致的问题
				let shopEventInfo = encodeURIComponent(JSON.stringify(item));
				//设置相对路径，不在同一层
				this.$tab.navigateTo(
					`../tradeOrder/tradeOrder?shopEventInfo=${shopEventInfo}&shopId=${this.searchParams.shopId}`);
			},
			getDetaile() {
				queryShopDetaile(this.searchParams.shopId).then(res => {
					this.shopInfo = res.data
				})
			},
			getShopEvent() {
				getShopEvent(this.searchParams).then(res => {
					console.log(res.rows.length)
					console.log(res.rows)

					if (res.rows.length !== 0) {
						this.total = res.total
						this.shopEventList = [...this.shopEventList, ...res.rows]
					} else {

						this.showToast(this.defaultNomareOnloadToast)

						this.loadMoreStatus = "nomore"
					}
				})
			},
			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						params.url && uni.navigateTo({
							url: params.url
						})
					}
				})
			}

		},
		onLoad(options) {
			this.searchParams.shopId = options.shopId;
			this.getDetaile()
			this.getShopEvent()
		},
		onPullDownRefresh() {
			this.showToast(this.defaultLoadingToast)
			this.loadMoreStatus = "loading"
			this.getShopEvent()
		},
		async onReachBottom() {
			if (this.total > this.searchParams.pageNum * this.searchParams.pageSize) {

				this.showToast(this.defaultLoadingToast)
				this.loadMoreStatus = "loading"
				// 延时模拟
				/* 				setTimeout(() => {
									this.searchParams.pageNum++;
									this.getShopEvent();
									this.loadMoreStatus = "loadmore";
								}, 1500); */
				this.searchParams.pageNum++;
				await this.getShopEvent();
				this.loadMoreStatus = "loadmore";
			} else {
				this.showToast(this.defaultNomareToast)
				this.loadMoreStatus = "nomore"
			}


		},


	}
</script>

<style lang="scss">
	.shopDetail {
		padding-bottom: 1px;
	}

	.shoplist-item-info-amount {
		font-weight: bold;
		color: red;
	}

	.shoplist-item-info-address {
		width: 100%;
		display: flex;
	}

	.shoplist-item-info-area {
		width: 100%;
		display: flex;
		color: #7F7F7F;
		font-size: 9px;
	}

	.shoplist-item-info-amount-con {
		width: 100%;
		height: 25px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.shoplist-item-info-rate {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.shoplist-item-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
	}

	.shoplist-item-image {
		width: 79.5px;
		height: 79.5px;
		border-radius: 6px;
		margin-right: 10px;
	}


	.shoplist-item {
		margin-top: 6px;
		display: flex;
		border-radius: 6px;

	}

	.shopEvent {
		padding: 10px;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		margin-top: 10px;
	}

	.contain {}

	.contain-activity {
		margin-top: 43px;
		padding-left: 10px;
		padding-right: 10px;
	}

	.hot-activity {
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		background-color: #fff;
		margin-top: 10px;
		border-radius: 6px;
	}

	.search-top {


		background-color: #fff;

		padding-left: 10px;
		padding-right: 10px;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		padding-bottom: 10px
	}

	.scroll-list {
		@include flex(column);

		&__goods-item {
			margin-right: 20px;

			&__image {
				width: 60px;
				height: 60px;
				border-radius: 4px;
			}

			&__text {
				color: #f56c6c;
				text-align: center;
				font-size: 12px;
				margin-top: 5px;
			}
		}

		&__show-more {
			background-color: #fff0f0;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;

			&__text {
				font-size: 12px;
				width: 12px;
				color: #f56c6c;
				line-height: 16px;
			}
		}
	}

	.shoplist-item-info-name {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5em;
		/* 根据需要设置行高 */
		max-height: 1.5em;
		/* 行高乘以显示行数 */
		white-space: normal;
		color: black;
		font-size: 13px;
	}

	.main-content-item-text {
		width: 100%;
		/* 视需求设置容器宽度 */
		padding: 1px;
	}

	.shopDetailTopCon {
		background-color: #fff;
		padding: 10px;
	}

	.shopDetailTop {
		display: flex;
		flex-direction: column;
	}

	.shopDetailTopTitle {
		margin-top: 10px;
		font-size: 17px;
	}

	.shopDetailTopRate {
		display: flex;
		margin-top: 10px;
		font-size: 10px;
		color: #7F7F7F;
	}


	.shopDetailTopImage {
		margin-top: 10px;
		width: 100%;

	}

	.horizontal-line {
		width: 100%;
		/* 横线的宽度 */
		height: 2rpx;
		/* 横线的高度 */
		background-color: #cccccc;
		/* 横线的颜色 */

	}

	.shopDetailTopAddress {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		background-color: #fff;
		padding: 10px;
	}

	.shopDetailTopAddressLeft {
		display: flex;
	}

	.shopDetailTopAddressRight {
		display: flex;
	}

	.distanceButton {
		height: 25px;
		font-size: 10px;
		line-height: 25px;
		background-color: red;
		color: #fff;
		border: none;
	}
</style>