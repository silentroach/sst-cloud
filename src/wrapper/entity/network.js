const Entity = require('./');

/**
 * Сеть
 *
 * @property {Number} id Идентификатор
 * @property {Number} houseId Идентификатор дома
 * @property {Array.<Number>} deviceIds Идентификаторы устройств
 * @property {String} name Название
 * @property {Date} created Дата создания
 * @property {Date} updated Дата изменения
 */
class Network extends Entity {
	static mapping() {
		return [
			['id'],
			['house', 'houseId'],
			['devices', 'deviceIds'],
			['created_at', 'created', raw => new Date(raw)],
			['updated_at', 'updated', raw => new Date(raw)],
			['name']
		];
	}
}

module.exports = Network;