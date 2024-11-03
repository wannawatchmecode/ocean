import { runApp } from './app';
import { runHealthSocket } from './health-socket';
import { runDumpsterFireSocket } from './dumbster-fire-socket';


async function run() {

	runApp();

	const healthSocketIO = await runHealthSocket();

	runDumpsterFireSocket({healthSocketIO});
}

run();
