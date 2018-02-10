const nock = require('nock');
const test = require('ava').test;
const faker = require('faker');

const {API} = require('../');

test.beforeEach(() => {
	nock.disableNetConnect();
});

test.afterEach(() => {
	nock.enableNetConnect();
});

const NockScope = 'https://api.sst-cloud.com';

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
