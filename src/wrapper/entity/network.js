const Entity = require('./');

/**
 * Сеть
 *
 * @property {Number} id
 * @property {Number} houseId
 * @property {Array.<Number>} deviceIds
 * @property {String} name
 * @property {Date} created
 * @property {Date} updated
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