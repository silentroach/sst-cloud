const BaseUrl = 'https://api.sst-cloud.com/';

const request = require('request').defaults({
	baseUrl: BaseUrl,
	json: true
});

async function makeRequest(method, url, data, jar) {
	return new Promise((resolve, reject) => {
		request({
			method, url, jar: jar,
			form: data
		}, (error, response, body) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(body);
		});
	});
}

async function makeAuthRequest(sessionId, method, url, data) {
	const jar = request.jar();

	const sessionCookie = request.cookie('sessionid=');
	sessionCookie.value = sessionId;

	jar.setCookie(sessionCookie, BaseUrl);

	return makeRequest(method, url, data, jar);
}

const SessionIdProp = Symbol();

/**
 * Доступ к SST-Cloud
 * https://api.sst-cloud.com/docs
 */
class API {
	/**
	 * Авторизация
	 * @param {String} email
	 * @param {String} password
	 * @returns {String} Идентификатор сессии
	 */
	static async login(email, password) {
		const jar = request.jar();

		await makeRequest('POST', '/auth/login/', {
			username: email,
			password
		}, jar);

		const sessionCookie = jar
			.getCookies(BaseUrl)
			.find(cookie => 'sessionid' === cookie.key);

		if (undefined === sessionCookie) {
			throw new Error('Can\'t find session id cookie');
		}

		return sessionCookie.value;
	}

	/**
	 * @param {String} sessionId Идентификатор сессии (из ::login)
	 */
	constructor(sessionId) {
		if (undefined === sessionId) {
			throw new TypeError('SessionId argument expected, but not found');
		}

		this[SessionIdProp] = sessionId;
	}

	/**
	 * Информация о пользователе
	 * GET /auth/user/
	 * https://api.sst-cloud.com/docs/#!/auth/user_list
	 */
	async user() {
		return makeAuthRequest(this[SessionIdProp], 'GET', '/auth/user/');
	}

	/**
	 * Список домов
	 * GET /houses/
	 * https://api.sst-cloud.com/docs/#!/houses/list
	 */
	async houses() {
		return makeAuthRequest(this[SessionIdProp], 'GET', '/houses/');
	}

	/**
	 * Информация о доме
	 * GET /houses/{houseId}/
	 * https://api.sst-cloud.com/docs/#!/houses/read
	 *
	 * @param {Number} houseId
	 */
	async houseById(houseId) {
		return makeAuthRequest(this[SessionIdProp], 'GET', `/houses/${houseId}/`);
	}

	/**
	 * Список устройств в доме
	 * GET /houses/{houseId}/devices/
	 * https://api.sst-cloud.com/docs/#!/devices/devices_list
	 *
	 * @param {Number} houseId
	 */
	async devices(houseId) {
		return makeAuthRequest(this[SessionIdProp], 'GET', `/houses/${houseId}/devices/`);
	}

	/**
	 * Информация об устройстве
	 * GET /houses/{houseId}/devices/{id}/
	 * https://api.sst-cloud.com/docs/#!/devices/devices_read
	 *
	 * @param {Number} houseId
	 * @param {Number} deviceId
	 */
	async deviceById(houseId, deviceId) {
		return makeAuthRequest(this[SessionIdProp], 'GET', `/houses/${houseId}/devices/${deviceId}/`);
	}

	/**
	 * Список сетей в доме
	 * GET /houses/{houseId}/networks/
	 * https://api.sst-cloud.com/docs/#!/networks/networks_list
	 *
	 * @param {Number} houseId
	 */
	async networks(houseId) {
		return makeAuthRequest(this[SessionIdProp], 'GET', `/houses/${houseId}/networks/`);
	}

	/**
	 * Информация о сети
	 * GET /houses/{houseId}/networks/{networkId}/
	 * https://api.sst-cloud.com/docs/#!/networks/networks_read
	 *
	 * @param {Number} houseId
	 * @param {Number} networkId
	 */
	async networkById(houseId, networkId) {
		return makeAuthRequest(this[SessionIdProp], 'GET', `/houses/${houseId}/networks/${networkId}/`);
	}
}

module.exports = API;