const Entity = require('./');
const Network = require('./network');
const Device = require('./device');

/**
 * Дом
 *
 * @property {Number} id Идентификатор
 * @property {String} name Название
 * @property {String} timezone Временная зона
 * @property {Date} created Дата создания
 * @property {Date} updated Дата изменения
 */
class House extends Entity {
	static mapping() {
		return [
			['id'],
			['timezone'],
			['created_at', 'created', raw => new Date(raw)],
			['updated_at', 'updated', raw => new Date(raw)],
			['name']
		];
	}

	/**
	 * Получить список сетей
	 * @returns {Array.<Network>}
	 */
	async networks() {
		const networks = await this.api.networks(this.id);

		return networks.map(networkInfo => new Network(this.api, networkInfo));
	}

	/**
	 * Получить список устройств
	 * @returns {Array.<Device>}
	 */
	async devices() {
		const devices = await this.api.devices(this.id);

		return devices.map(deviceInfo => new Device(this.api, deviceInfo));
	}
}

module.exports = House;