<template>
	<view style="width: 100%;height: 65px;border: 1;">
		<view class="search">
			<view class="search-top">
				<text class="area">{{extractCityName(address)}}</text>

				<view class="search-bar">
					<input class="search-bar-input" type="text" placeholder="搜索商品或店铺" />
				</view>

			</view>


		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		name: "search",
		computed: {
			...mapGetters(['img', 'address', 'lng', 'lat'])
		},
		data() {
			return {
				city: ""
			};
		},
		computed: {
			...mapGetters(['address', 'lng', 'lat'])
		},
		methods: {
			extractCityName(location) {
				let city = '';
				// 定义正则表达式来匹配市名
				const cityRegex = /([^省市区]+市)/;

				const match = location.match(cityRegex);
				if (match && match[0]) {
					city = match[0];
				}
				this.city = city;
				console.log("当前城市" + this.city)
				return city;
			}
		},

	}
</script>

<style scoped>
	.search {
		background-color: #FFC300;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 65px;
		z-index: 999;
		/* 确保在最顶层 */
		padding: 30px 20px 0px 20px;
	}

	.search-top {
		display: flex;
		height: 30px;
		align-items: center;
	}

	.area {
		size: 15px;
		margin-right: 20px;
	}

	.search-bar-input {
		display: inline-block;
		height: 30px;
		background-color: #FFF9E6;
		border-radius: 6px;
		width: 150px;
		size: 10px;
		padding-left: 10px;
	}
</style>