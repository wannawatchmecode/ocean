import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { v4 } from "uuid";

import winston from "winston";
import bun from "bun";

const PORT = 7477;
const EXECUTOR_ROOM = "executorRoom";
const DEFAULT_TIMEOUT = 5000;
const START_EXECUTE_EVENT = "startExecuteEvent";
const EVENT_STATUS_CHANGE_EVENT = "eventStatusChangeEvent";
const EXECUTOR_AUTH_TOKEN = "1254-4311-4276-3291"; // TODO: NEED To make not hard coded
const EXECUTOR_INTERNAL_ROOM = "executorServiceInternalRoom";

const corsSettings = {
  origin: [
    "http://localhost:5476",
    "http://localhost:5477",
    "http://localhost:3001",
    "http://localhost:3005",
    "http://localhost:7477",
  ],
  methods: ["GET", "POST"],
};

interface IRunExecutorServiceSocketProps {
  executorSocketIO: Server;
}

export async function runExecutorServiceSocket(
  props: IRunExecutorServiceSocketProps,
) {
  const { executorSocketIO } = props;

  // Private backend io
  const server = createServer();
  const io = new Server(server, {
    cors: corsSettings,
  });

  io.on("connection", (socket: Socket) => {
    socket.data.clientId = v4();
  });

  io.of("/executor/admin").on("connection", (socket: Socket) => {
    const { handshake } = socket;
    winston.info(`Socket trying to connect for /executor/admin namespace`);
    if (handshake.auth.token === EXECUTOR_AUTH_TOKEN) {
      winston.info(`Valid auth token for connecting to /dumpsterfire/admin namespace...
						 connecting socket to ${EXECUTOR_INTERNAL_ROOM} room`);
      winston.info("Executor connection being setup");
      socket.join(EXECUTOR_INTERNAL_ROOM);
      winston.info("Joined executor internal room");
    } else {
      winston.warn(`Invalid auth token provided for connecting to /executor/admin namespace
					 Rejecting request...`);
    }

    socket.on(START_EXECUTE_EVENT, (data, callback) => {
      sendStartExecuteEvent(data, executorSocketIO);
      if (callback) {
        callback("Ack");
      }
    });
    socket.on(EVENT_STATUS_CHANGE_EVENT, (data, callback) => {
      const requestId = sendEventStatusChangeEvent(data, executorSocketIO);
      if (callback) {
        callback({ requestId });
      }
    });
    //console.log(JSON.stringify(socket.handshake));
  });

  /*io.of('/dumpsterfire/admin').on(HEALTH_EVENT, (data) => {
	winston.info("Received health event for /dumpsterfire/admin");
	sendHealthEvent(data, healthSocketIO);
});*/

  io.listen(PORT);

  while (false) {
    //    sendHealthEvent({ hello: "world" }, io);
    await sleep(2000);
  }
}

function sendEventStatusChangeEvent(changeEvent: any, io: any) {
  winston.info(`Sending eventStatusChangeEvent ${changeEvent}`);
  io.timeout(DEFAULT_TIMEOUT).emit(EVENT_STATUS_CHANGE_EVENT, changeEvent);
}

function sendStartExecuteEvent(startExecuteEvent: any, io: any) {
  winston.info("Sending start execute event");
  const requestId: string = bun.randomUUIDv7();
  io.to(EXECUTOR_INTERNAL_ROOM)
    .timeout(DEFAULT_TIMEOUT)
    .emit(START_EXECUTE_EVENT, { ...startExecuteEvent, requestId });
  return requestId;
  //  io.to(HEALTH_ROOM).timeout(DEFAULT_TIMEOUT).emit(HEALTH_EVENT, healthEvent);
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
