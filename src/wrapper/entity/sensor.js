const Entity = require('./');


/**
 * Сенсор
 *
 * @property {String} name
 * @property {Number} signal
 * @property {Number} battery
 * @property {Boolean} attention
 */
class Sensor extends Entity {
	static mapping() {
		return [
			['name'],
			['signal_level', 'signal'],
			['battery'],
			['attention']
		];
	}
}

module.exports = Sensor;