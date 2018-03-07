const Entity = require('./');

/**
 * Новость
 *
 * @property {Number} id Идентификатор
 * @property {String} title Заголовок
 * @property {String} body Текст
 * @property {Date} created Дата
 */
class News extends Entity {
	static mapping() {
		return [
			['id'],
			['title'],
			['body'],
			['pub_date', 'created', raw => new Date(raw)]
		];
	}
}

module.exports = News;