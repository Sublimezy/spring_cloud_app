import request from '@/utils/request'

export function getShopType() {
	return request({
		url: '/data/shopType/list',
		method: 'get'
	})
}

export function getShopIndexList() {
	return request({
		url: '/data/shop/indexList',
		method: 'get'
	})
}