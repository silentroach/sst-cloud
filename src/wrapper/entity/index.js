const APIProp = Symbol('api');

class Entity {
	constructor(api, data) {
		this[APIProp] = api;

		if (undefined !== data) {
			for (const [originalName, name = originalName, normalize = data => data] of this.constructor.mapping()) {
				if (undefined !== data[originalName]) {
					Object.defineProperty(this, name, {
						value: normalize(data[originalName]),
						enumerable: true
					});
				}
			}
		}
	}

	get api() {
		return this[APIProp];
	}

	static mapping() {
		return [];
	}
}

module.exports = Entity;