const Entity = require('./');
const House = require('./house');

/**
 * Сессия
 */
class Root extends Entity {
	/**
	 * Получить список домов
	 * @returns {Array.<House>}
	 */
	async houses() {
		const houses = await this.api.houses();

		return houses.map(houseInfo => new House(this.api, houseInfo));
	}

	/**
	 * Получить информацию о доме по его идентификатору
	 * @param {Number} houseId Идентификатор дома
	 * @returns {House}
	 */
	async houseById(houseId) {
		return new House(this.api, await this.api.houseById(houseId));
	}
}

module.exports = Root;