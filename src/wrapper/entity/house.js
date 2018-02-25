const Entity = require('./');
const Network = require('./network');
const Device = require('./device');

/**
 * Дом
 *
 * @property {Number} id
 * @property {String} name
 * @property {String} timezone
 * @property {Date} created
 * @property {Date} updated
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

	async networks() {
		const networks = await this.api.networks(this.id);

		return networks.map(networkInfo => new Network(this.api, networkInfo));
	}

	async devices() {
		const devices = await this.api.devices(this.id);

		return devices.map(deviceInfo => new Device(this.api, deviceInfo));
	}
}

module.exports = House;