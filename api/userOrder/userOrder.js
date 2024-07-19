import request from '@/utils/request';

export function addOrder(addOrder) {
	return request({
		'url': '/order/order',
		'method': 'post',
		'data': addOrder
	})
}

export function listOrder(params) {
	return request({
		'url': '/order/order/list',
		'method': 'get',
		params: {
			userId: params.userId,
			pageNum: params.pageNum,
			pageSize: params.pageSize,
			status: params.status,
		}
	})
}