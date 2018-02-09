const nock = require('nock');
const {test} = require('ava');
const faker = require('faker');

const {API} = require('../');

test.beforeEach(() => {
	nock.disableNetConnect();	
});

test.afterEach(() => {
	nock.enableNetConnect();
});

test('Login should return valid session id', async t => {
	const sessionId = faker.random.uuid();

	nock('https://api.sst-cloud.com')
		.post('/auth/login/')
		.reply(200, { key: 'хз зачем они его вообще возвращают' }, {
			'Set-Cookie': `sessionid=${sessionId}; Path=/`
		});

	t.is(await API.login('test', 'me'), sessionId);	
});

test('Should throw on no sessionid cookie found in login response', async t => {
	const sessionId = faker.random.uuid();

	nock('https://api.sst-cloud.com')
		.post('/auth/login/')
		.reply(200, { key: 'хз зачем они его вообще возвращают' });

	await t.throws(API.login('test', 'me'));
});

test('Should throw on sessionless constructor call', t => {
	t.throws(() => new API());
});