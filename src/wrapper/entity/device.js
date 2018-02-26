const Entity = require('./');
const Sensor = require('./sensor');

/**
 * Устройство
 *
 * @property {Number} id Идентификатор
 * @property {Number} houseId Идентификатор дома
 * @property {Number} networkId Идентификатор сети
 * @property {Date} created Дата создания
 * @property {Date} updated Дата изменения
 * @property {String} name Название
 * @property {Boolean} active Флаг активности
 * @property {Boolean} connected Флаг соединения с сетью
 * @property {Device.Types} type Тип устройства
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

	/**
	 * Получить список беспроводных сенсоров
	 * @returns {Array.<Sensor>}
	 */
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