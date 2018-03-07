const chalk = require('chalk');
const prompt = require('prompt');

const {wrapper} = require('../');

console.log(chalk.green('Введите данные для авторизации'));

prompt.start();
prompt.message = undefined;

(async () => {

	const { email, password } = await require('util').promisify(prompt.get)({
		properties: {
			email: {
				required: true
			},
			password: {
				replace: '*',
				hidden: true,
				required: true
			}
		}
	});

	const root = await wrapper.login(
		email, password
	);

	const news = await root.news();
	if (!news.length) {
		console.log('🗞  Нет новостей, зато метод для их получения есть\n');
	} else {
		console.log('🗞  Последняя новость:');

		const last = news.shift();
		console.log(`* ${last.title}`);
		console.log(last.body, '\n');
	}

	for (const house of await root.houses()) {
		console.log(`🏡  ${chalk.yellow.bold(house.name)}`);

		const [devices, networks] = await Promise.all([
			house.devices(),
			house.networks()
		]);

		const networksById = new Map(
			networks.map(network => [network.id, network])
		);

		for (const device of devices) {
			const network = device.networkId && networksById.get(device.networkId);

			console.log(
				[
					'   *',
					device.name,
					network && chalk.grey(`~ ${network.name}`)
				].filter(Boolean).join(' ')
			);

			for (const sensor of await device.sensors()) {
				const row = [
					sensor.attention ? '🚨' : '✅',
					(sensor.attention ? chalk.red.bold : chalk.green)(sensor.name),

					'📶', (sensor.signal < 1 ? chalk.gray :
						sensor.signal < 3 ? chalk.yellow : chalk.green)(`${sensor.signal * 100 / 4}%`),

					'🔋', (0 === sensor.battery ? chalk.red.bold :
						sensor.battery < 2 ? chalk.yellow : chalk.green)(`${sensor.battery * 100 / 4}%`)
				].join('  ');

				console.log(`     ${row}`);
			}
		}
	}

})();
