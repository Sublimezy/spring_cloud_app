import request from '@/utils/request';

export function queryShopList(params) {
	return request({
		url: '/data/shop/queryShopList',
		method: 'get',
		params: {
			typeId: params.type,
			pageNum: params.pageNum,
			pageSize: params.pageSize,
			x: params.x,
			y: params.y,
			distance: params.distance
		}
	});
}

export function queryShopDetaile(params) {
	return request({
		url: `/data/shop/${params}`,
		method: 'get',
	});
}


export function getShopEvent(params) {
	return request({
		url: `/data/shopEvent/list`,
		method: 'get',
		params: {
			shopId: params.shopId,
			pageNum: params.pageNum,
			pageSize: params.pageSize
		}
	});
}