const Entity = require('./');
const House = require('./house');

class Root extends Entity {
	async houses() {
		const houses = await this.api.houses();

		return houses.map(houseInfo => new House(this.api, houseInfo));
	}

	async houseById(houseId) {
		return new House(this.api, await this.api.houseById(houseId));
	}
}

module.exports = Root;