const nock = require('nock');
const test = require('ava').test;
const faker = require('faker');

const {API} = require('../');
const APIError = require('../src/api/error');

test.beforeEach(() => {
	nock.disableNetConnect();
});

test.afterEach(() => {
	nock.enableNetConnect();
});

const NockScope = require('../src/api/endpoint');

test('wrong api reponse handling', async t => {
	nock(NockScope)
		.post('/auth/login/')
		.once()
		.reply(500);

	await t.throws(API.login('test', 'me'), APIError);
});

test('wrong api reponse data handling', async t => {
	const responseData = {
		some: 'data'
	};

	nock(NockScope)
		.post('/auth/login/')
		.once()
		.reply(500, responseData);

	const error = await t.throws(API.login('test', 'me'), APIError);

	t.is(error.message, JSON.stringify(responseData));
});

test('wrong api reponse with details handling with non-field-errors', async t => {
	const errorDetails = 'some error details';

	nock(NockScope)
		.post('/auth/login/')
		.once()
		.reply(400, {
			non_field_errors: 'kek',
			detail: errorDetails
		});

	const error = await t.throws(API.login('test', 'me'), APIError);

	t.is(error.message, errorDetails);
});

test('successful api login returns session id', async t => {
	const sessionId = faker.random.uuid();

	nock(NockScope)
		.post('/auth/login/')
		.once()
		.reply(200, { key: 'хз зачем они его вообще возвращают' }, {
			'Set-Cookie': `sessionid=${sessionId}; Path=/`
		});

	t.is(await API.login('test', 'me'), sessionId);
});

test('sessionId is readable property', t => {
	const sessionId = faker.random.uuid();

	const api = new API(sessionId);

	t.is(api.sessionId, sessionId);

	t.throws(() => api.sessionId = 'kek', TypeError, 'sessionId property should be read-only');
});

test('wrong api login response throws an error', async t => {
	nock(NockScope)
		.post('/auth/login/')
		.once()
		.reply(200, { key: 'хз зачем они его вообще возвращают' });

	await t.throws(API.login('test', 'me'), Error, 'should throw an error on no session id found');
});

test('net call error should throw an error', async t => {
	nock(NockScope)
		.post('/auth/login/')
		.once()
		.replyWithError('something wrong happened');

	await t.throws(API.login('test', 'me'), Error, 'should throw an error network call error');
});

test('api constructor without session id throws an error', t => {
	t.throws(() => new API(), Error, 'should throw an error on sessionless constructor call');
});

test('simple user info call should reply with data', async t => {
	const sessionId = faker.random.uuid();
	const data = { id: 5, some: 'data' };

	nock(NockScope, {
		reqheaders: {
			'cookie': `sessionid=${sessionId}`
		}})
		.get('/auth/user/')
		.once()
		.reply(200, data);

	const api = new API(sessionId);

	t.deepEqual(await api.user(), data);
});
