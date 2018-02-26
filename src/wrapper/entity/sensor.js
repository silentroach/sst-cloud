const Entity = require('./');

/**
 * Сенсор
 *
 * @property {String} name Название
 * @property {Number} signal Уровень сигнала
 * @property {Number} battery Уровень заряда батарейки
 * @property {Boolean} attention Индикатор протечки
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