import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
import { createServer } from "http";
import { winston } from "./logger";

const PORT = 6477;
const EXECUTOR_ROOM = "executorRoom";
const DEFAULT_TIMEOUT = 5000;
const EXECUTION_STATUS_EVENT = "executionEventStatusEvent";
const DUMPSTER_FIRE_AUTH_TOKEN = "1234-4321-9876-678"; // TODO: NEED To make not hard coded
const DUMPSTER_FIRE_INTERNAL_ROOM = "executorServiceInternalRoom";
const EVENT_STATUS_CHANGE_EVENT = "eventStatusChangeEvent";

const corsSettings = {
  origin: ["http://localhost:5476", "http://localhost:3001", "*"],
  methods: ["GET", "POST"],
};

export async function runExecutorSocket() {
  const server = createServer();
  const io = new Server(server, {
    cors: corsSettings,
  });

  io.on("connection", (socket: Socket) => {
    socket.data.clientId = v4();
    socket.join(EXECUTOR_ROOM);
    socket.on(EVENT_STATUS_CHANGE_EVENT, (data, callback) => {
      winston.info(
        `${EVENT_STATUS_CHANGE_EVENT} received with request: ${data}`,
      );
      sendExecutionStatusUpdated(data, socket);
      if (callback) {
        callback("Ack");
      }
    });
  });

  io.listen(PORT);

  while (false) {
    //   sendHealthEvent({ hello: "world" }, io);
    await sleep(2000);
  }

  return io;
}

function sendExecutionStatusUpdated(executionStatusEvent: any, io: any) {
  winston.info("Sending executionStatusUpdated event");
  io.to(EXECUTOR_ROOM)
    .timeout(DEFAULT_TIMEOUT)
    .emit(EVENT_STATUS_CHANGE_EVENT, executionStatusEvent);
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
