<template>
	<view class="contain">
		<view class="search-top">
			<u-search :actionStyle="searchTextStyle" :input-style="inputStyle" style="font-size: 10rpx;"
				searchIconSize="12" color="#c8c9cc" value="请输入商家名" borderColor="#FE3013" bgColor="#fff"
				inputAlign="left" height="25"></u-search>
		</view>
		<u-toast ref="uToast"></u-toast>
		<view class="contain-activity">

			<view class="hot-activity">
				<u-scroll-list @right="right" @left="left">
					<view class="scroll-list" style="flex-direction: row;">
						<view class="scroll-list__goods-item" v-for="(item, index) in list" :key="index"
							:class="[(index === 9) && 'scroll-list__goods-item--no-margin-right']">
							<image class="scroll-list__goods-item__image" :src="item.thumb"></image>
							<text class="scroll-list__goods-item__text">￥{{ item.price }}</text>
						</view>
						<view class="scroll-list__show-more">
							<text class="scroll-list__show-more__text">查看更多</text>
							<u-icon name="arrow-leftward" color="#f56c6c" size="12"></u-icon>
						</view>
					</view>
				</u-scroll-list>
			</view>

			<view class="shoplist">


				<view @click="shopDetaile(item.id)" v-for="(item,index) in shopAreaList" :key="index"
					class="shoplist-item">

					<image class="shoplist-item-image" :src="item.images">
					</image>

					<view class="shoplist-item-info">
						<view class="main-content-item-text">
							<text class="shoplist-item-info-name">{{item.name}}</text>
						</view>
						<view class="shoplist-item-info-rate">
							<view style="display: flex;align-items: center;">
								<u-rate readonly size="10px" :count="item.count" v-model="item.rate"></u-rate>
								<text style="color: red;">{{item.score}}</text>
							</view>

							<text>{{item.comments}}条</text>
						</view>
						<view class="shoplist-item-info-area">
							<text>{{item.area}}</text>
							<text>{{Math.ceil(item.geo)}}m</text>
						</view>
						<text class="shoplist-item-info-amount">￥{{item.avgPrice}}/人</text>
						<view class="shoplist-item-info-address">
							<u-icon name="map-fill" size="10px"></u-icon>
							<text>{{item.address}}</text>
						</view>

					</view>

				</view>


			</view>

			<u-loadmore isDotloadingIcon="spinner" dashed :status="loadMoreStatus" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" />
		</view>



	</view>
</template>

<script>
	import store from "@/store"
	import {
		queryShopList
	} from '@/api/shop/shop'
	export default {
		data() {
			return {
				total: null,
				searchParams: {
					type: null,
					pageNum: 1,
					pageSize: 3,
					x: store.getters.lng,
					y: store.getters.lat,
					distance: 5000
				},
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
					message: "暂无店铺",
				},
				defaultLoadingToast: {
					type: 'default',
					message: "正在加载中~",
				},
				shopAreaList: [],

				inputStyle: {
					fontSize: '12px', //修改搜索框里面的文字大小
				},
				searchTextStyle: {
					fontSize: '12px', //修改搜索框里面的文字大小
				},
				list: [{
					price: '230.5',
					thumb: 'https://cdn.uviewui.com/uview/goods/1.jpg'
				}, {
					price: '74.1',
					thumb: 'https://cdn.uviewui.com/uview/goods/2.jpg'
				}, {
					price: '8457',
					thumb: 'https://cdn.uviewui.com/uview/goods/6.jpg'
				}, {
					price: '1442',
					thumb: 'https://cdn.uviewui.com/uview/goods/5.jpg'
				}, {
					price: '541',
					thumb: 'https://cdn.uviewui.com/uview/goods/2.jpg'
				}, {
					price: '234',
					thumb: 'https://cdn.uviewui.com/uview/goods/3.jpg'
				}, {
					price: '562',
					thumb: 'https://cdn.uviewui.com/uview/goods/4.jpg'
				}, {
					price: '251.5',
					thumb: 'https://cdn.uviewui.com/uview/goods/1.jpg'
				}],

			};
		},
		methods: {
			shopDetaile(shopId) {
				console.log(shopId)
				this.$tab.navigateTo(`/pages/shop/shopDetail/shopDetail?shopId=${shopId}`);

			},
			left() {
				console.log('left');
			},
			right() {
				console.log('right');
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
			},
			getList() {
				console.log("查询参数")
				console.log(this.searchParams)

				queryShopList(this.searchParams).then(res => {
					console.log(res.total)
					if (res.total !== 0) {

						this.total = res.total
						this.shopAreaList = [...this.shopAreaList, ...res.rows]
					} else {

						this.showToast(this.defaultNomareOnloadToast)

						this.loadMoreStatus = "nomore"
					}
				})

			},
			getLocation() {
				uni.getLocation({
					type: 'wgs84', // 这里可以设置坐标系类型，wgs84、gcj02
					success: (res) => {
						this.location = {
							latitude: res.latitude,
							longitude: res.longitude
						};
						console.log('获取成功:', res);
					},
					fail: (err) => {
						console.error('获取失败:', err);
					}
				});
			}
		},
		onPullDownRefresh() {

		},
		async onReachBottom() {
			if (this.total > this.searchParams.pageNum * this.searchParams.pageSize) {

				this.showToast(this.defaultLoadingToast)
				this.loadMoreStatus = "loading"

				this.searchParams.pageNum++;
				await this.getList();
				this.loadMoreStatus = "loadmore";
			} else {
				this.showToast(this.defaultNomareToast)
				this.loadMoreStatus = "nomore"
			}


		},
		onLoad(options) {
			this.getLocation()

			this.searchParams.type = options.type;

			console.log("this.type:" + this.type)
			this.getList()
		},


	};
</script>

<style lang="scss">
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
		justify-content: space-between;
		color: #7F7F7F;
		font-size: 9px;
	}

	.shoplist-item-info-rate {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.shoplist-item-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.shoplist-item-image {
		width: 79.5px;
		height: 79.5px;
		border-radius: 6px;
		margin-right: 10px;
	}

	.shoplist {
		display: flex;
		flex-direction: column;
	}

	.shoplist-item {
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 10px;
		background-color: #fff;
		margin-top: 6px;
		display: flex;
		border-radius: 6px;

	}



	.contain {}

	.contain-activity {
		margin-top: 43px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 5px;
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
</style>