import { Server, Socket } from "socket.io";
import { v4 } from 'uuid';
import { createServer } from 'http';
import winston from 'winston';

const PORT = 6476;
const HEALTH_ROOM = 'healthRoom';
const DEFAULT_TIMEOUT = 5000;
const HEALTH_EVENT = 'healthEvent';
const DUMPSTER_FIRE_AUTH_TOKEN = '1234-4321-9876-678'; // TODO: NEED To make not hard coded
const DUMPSTER_FIRE_INTERNAL_ROOM = 'dumpsterFireInternalRoom';


const corsSettings = {
	origin: 'http://localhost:5476',
	methods: ['GET', 'POST']
};


export async function runHealthSocket() {
const server = createServer();
const io = new Server(server, {
	cors: corsSettings,
});


io.on('connection', (socket: Socket) => {
	socket.data.clientId = v4();
	socket.join(HEALTH_ROOM);
});

io.listen(PORT);

	while(false) {
		sendHealthEvent({hello: 'world'}, io);
		await sleep(2000);
	}

	return io;
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
