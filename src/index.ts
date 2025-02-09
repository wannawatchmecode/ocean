import { runApp } from "./app";
import { runHealthSocket } from "./health-socket";
import { runDumpsterFireSocket } from "./dumpster-fire-socket";
import { runExecutorServiceSocket } from "./executor-service-socket";
import { runExecutorSocket } from "./executor-socket";

async function run() {
  runApp();

  const healthSocketIO = await runHealthSocket();

  runDumpsterFireSocket({ healthSocketIO });
  const executorSocket = await runExecutorSocket();
  //  runExecutorServiceSocket({ executorSocketIO: executorSocket });
  runExecutorServiceSocket({ executorSocketIO: executorSocket });
}

run();
