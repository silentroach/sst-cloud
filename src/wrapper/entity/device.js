const Entity = require('./');
const Sensor = require('./sensor');

/**
 * Устройство
 *
 * @property {Number} id
 * @property {Number} houseId
 * @property {Number} networkId
 * @property {Date} created
 * @property {Date} updated
 * @property {String} name
 * @property {Boolean} active
 * @property {Boolean} connected
 * @property {Device.Types} type
 */
class Device extends Entity {
	static mapping() {
		return [
			['id'],
			['house', 'houseId'],
			['active_network', 'networkId'],
			['created_at', 'created', raw => new Date(raw)],
			['updated_at', 'updated', raw => new Date(raw)],
			['name'],
			['is_active', 'active'],
			['is_connected', 'connected'],
			['type', 'type', raw => DeviceMapping[raw]]
		];
	}

	async sensors() {
		const sensors = await this.api.sensors(this.houseId, this.id);

		return sensors.map(sensorInfo => new Sensor(this.api, sensorInfo));
	}
}

Device.Types = {
	Neptun: 'Neptun'
}

const DeviceMapping = {
	2: Device.Types.Neptun
}

module.exports = Device;