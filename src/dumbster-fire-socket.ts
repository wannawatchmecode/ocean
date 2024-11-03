import { Server, Socket } from "socket.io";
import { v4 } from 'uuid';
import { createServer } from 'http';
import winston from 'winston';

const PORT = 7476;
const HEALTH_ROOM = 'healthRoom';
const DEFAULT_TIMEOUT = 5000;
const HEALTH_EVENT = 'healthEvent';
const DUMPSTER_FIRE_AUTH_TOKEN = '1234-4321-9876-678'; // TODO: NEED To make not hard coded
const DUMPSTER_FIRE_INTERNAL_ROOM = 'dumpsterFireInternalRoom';


const corsSettings = {
	origin: 'http://localhost:5476',
	methods: ['GET', 'POST']
};


interface IRunDumpsterFireSocketProps {
	healthSocketIO: Server
};

export async function runDumpsterFireSocket(props: IRunDumpsterFireSocketProps) {
	const { healthSocketIO } = props;

	const server = createServer();
	const io = new Server(server, {
		cors: corsSettings,
	});


	io.on('connection', (socket: Socket) => {
		socket.data.clientId = v4();
	});

	io.of('/dumpsterfire/admin').on('connection', (socket: Socket) => {
		const { handshake } = socket;
		winston.info(`Socket trying to connect for /dumpsterfire/admin namespace`);
		if (handshake.auth.token??'' === DUMPSTER_FIRE_AUTH_TOKEN) {
			winston.info(`Valid auth token for connecting to /dumpsterfire/admin namespace...
						 connecting socket to ${DUMPSTER_FIRE_INTERNAL_ROOM} room`);
			winston.info('Dumpster fire connection being setup');
			socket.join(DUMPSTER_FIRE_INTERNAL_ROOM);
			winston.info('Joined dumpster fire internal room');
		} else {
			winston.warn(`Invalid auth token provided for connecting to /dumpsterfire/admin namespace
					 Rejecting request...`
		);
	}

		socket.on(HEALTH_EVENT, (data, callback) => {
			sendHealthEvent(data, healthSocketIO);
			if (callback) {
				callback("Ack");
			}
		});
		//console.log(JSON.stringify(socket.handshake));
	
	});

/*io.of('/dumpsterfire/admin').on(HEALTH_EVENT, (data) => {
	winston.info("Received health event for /dumpsterfire/admin");
	sendHealthEvent(data, healthSocketIO);
});*/


	io.listen(PORT);

	while(false) {
		sendHealthEvent({hello: 'world'}, io);
		await sleep(2000);
	}
}

function sendHealthEvent(healthEvent: any, io: any) {
	winston.info('Sending health event');
	io.to(HEALTH_ROOM).timeout(DEFAULT_TIMEOUT).emit(HEALTH_EVENT, healthEvent);
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
