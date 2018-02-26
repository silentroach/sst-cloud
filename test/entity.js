const nock = require('nock');
const test = require('ava').test;
const faker = require('faker');

const {API} = require('../');
const Entity = require('../src/wrapper/entity');

test.beforeEach(() => {
	nock.disableNetConnect();
});

test.afterEach(() => {
	nock.enableNetConnect();
});

test('api property', t => {
	const sessionId = faker.random.uuid();
	const api = new API(sessionId);

	const k = new Entity(api);

	t.is(k.api, api);

	t.throws(() => k.api = 'kek', TypeError, 'api property should be read-only');
});

test('fields mapping', t => {
	const dataConverter = data => `${data}!`;
	const value = 'test';

	class FakeEntity extends Entity {
		static mapping() {
			return [
				['keep'],
				['someKek', 'name', dataConverter],
				['unknown']
			];
		}
	}

	const sessionId = faker.random.uuid();
	const api = new API(sessionId);

	const k = new FakeEntity(api, {
		keep: value,
		someKek: value
	});

	t.is(k.keep, value);
	t.is(k.name, dataConverter(value));

	t.throws(() => k.name = 'testme',  TypeError, 'new property should be read-only');

	t.deepEqual(Object.keys(k), ['keep', 'name'], 'properties should be enumerable');
});