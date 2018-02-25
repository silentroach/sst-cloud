const API = require('../api');

const Root = require('./entity/root');

/**
 * @param {String} sessionId
 * @returns {Root}
 */
module.exports = function(sessionId) {
	return new Root(new API(sessionId));
}

/**
 * Авторизация
 * @param {String} email
 * @param {String} password
 * @returns {String} Идентификатор сессии
 */
module.exports.login = async function(email, password) {
	const sessionId = await API.login(email, password);

	return module.exports(sessionId);
};
