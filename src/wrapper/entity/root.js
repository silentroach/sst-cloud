const Entity = require('./');
const House = require('./house');
const News = require('./news');

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

	/**
	 * Получить список новостей
	 * @returns {Array.<News>}
	 */
	async news() {
		const news = await this.api.news();

		return news.map(newsInfo => new News(this.api, newsInfo))
	}

	/**
	 * Получить новость по ее идентификатору
	 * @param {Number} newsId Идентификатор новости
	 * @returns {News}
	 */
	async newsById(newsId) {
		return new News(this.api, await this.api.newsById(newsId));
	}
}

module.exports = Root;