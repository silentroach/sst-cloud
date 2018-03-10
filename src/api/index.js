const Endpoint = require('./endpoint');

const APIError = require('./error');

const request = require('request').defaults({
	baseUrl: Endpoint,
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

			switch (response.statusCode) {
				case 200:
					resolve(body);
					break;
				default:
					reject(new APIError(
						'object' === typeof body
							&& body.non_field_errors
							&& body.detail
							|| JSON.stringify(body)
							|| 'API error'
					));
					break;
			}
		});
	});
}

async function makeAuthRequest(sessionId, method, url, data) {
	const jar = request.jar();

	const sessionCookie = request.cookie('sessionid=');
	sessionCookie.value = sessionId;

	jar.setCookie(sessionCookie, Endpoint);

	return makeRequest(method, url, data, jar);
}

const SessionIdProp = Symbol('sessionId');

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
			.getCookies(Endpoint)
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
	 * Идентификатор сессии
	 */
	get sessionId() {
		return this[SessionIdProp];
	}

	/**
	 * Получение информации о текущем пользователе
	 * GET /auth/user/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/auth/user_list
	 */
	async user() {
		return makeAuthRequest(this.sessionId, 'GET', '/auth/user/');
	}

	/**
	 * Список домов
	 * GET /houses/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/houses/list
	 */
	async houses() {
		return makeAuthRequest(this.sessionId, 'GET', '/houses/');
	}

	/**
	 * Информация о доме по его идентификатору
	 * GET /houses/{houseId}/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/houses/read
	 *
	 * @param {Number} houseId
	 */
	async houseById(houseId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/`);
	}

	/**
	 * Список сетей в доме
	 * GET /houses/{houseId}/networks/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/networks/networks_list
	 *
	 * @param {Number} houseId
	 */
	async networks(houseId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/networks/`);
	}

	/**
	 * Информация о сети по ее идентификатору
	 * GET /houses/{houseId}/networks/{networkId}/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/networks/networks_read
	 *
	 * @param {Number} houseId
	 * @param {Number} networkId
	 */
	async networkById(houseId, networkId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/networks/${networkId}/`);
	}

	/**
	 * Список устройств в доме
	 * GET /houses/{houseId}/devices/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/devices/devices_list
	 *
	 * @param {Number} houseId
	 */
	async devices(houseId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/devices/`);
	}

	/**
	 * Информация об устройстве по его идентификатору
	 * GET /houses/{houseId}/devices/{id}/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/devices/devices_read
	 *
	 * @param {Number} houseId
	 * @param {Number} deviceId
	 */
	async deviceById(houseId, deviceId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/devices/${deviceId}/`);
	}

	/**
	 * Список беспроводных датчиков, зарегистрированных в устройстве
	 * GET /houses/{houseId}/wireless_sensors/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/devices/devices_wsensors_read
	 *
	 * @param {Number} houseId
	 * @param {Number} deviceId
	 */
	async sensors(houseId, deviceId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/devices/${deviceId}/wireless_sensors/`);
	}

	/**
	 * Информация о счетчиках, зарегистрированных на устройстве
	 * GET /houses/{houseId}/devices/{deviceId}/counters/
	 *
	 * @link https://api.sst-cloud.com/docs/#!/devices/devices_counters_read
	 *
	 * @param {Number} houseId
	 * @param {Number} deviceId
	 */
	async counters(houseId, deviceId) {
		return makeAuthRequest(this.sessionId, 'GET', `/houses/${houseId}/devices/${deviceId}/counters/`);
	}

	/**
	 * Список новостей
	 * GET /news
	 *
	 * @link https://api.sst-cloud.com/docs/#!/news/news
	 */
	async news() {
		return makeAuthRequest(this.sessionId, 'GET', '/news/');
	}

	/**
	 * Новости по идентификатору
	 * GET /news/{newsId}
	 *
	 * @link https://api.sst-cloud.com/docs/#!/news/cur_news
	 *
	 * @param {Number} newsId
	 */
	async newsById(newsId) {
		return makeAuthRequest(this.sessionId, 'GET', `/news/${newsId}`);
	}
}

module.exports = API;