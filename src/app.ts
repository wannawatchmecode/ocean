import express, { Request, Response } from "express";
import { winston } from "./logger";
import DailyRotateFile from "winston-daily-rotate-file";

/*const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  defaultMeta: { service: "ocean" },
  transports: [
    new winston.transports.Console({}),
    new DailyRotateFile({ filename: "ocear-application-log" }),
  ],
});
*/
export function runApp() {
  winston.info("Hello via Bun!");

  const PORT = parseInt(process.env.PORT ?? "5476");

  const app = express();

  app.set("view-engine", "ejs");

  const indexProps = {
    ioServer: {
      host: "http://localhost:6476",
      urlPath: "/socket.io/socket.io.js",
    },
  };

  app.get("/", (req: Request, res: Response) => {
    res.render("index.ejs", { props: indexProps });
  });

  app.listen(PORT, () => {
    winston.info(`Listening on port ${PORT}`);
  });
}
