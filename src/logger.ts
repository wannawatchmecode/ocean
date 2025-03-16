import winstonOrig from "winston";

import DailyRotateFile from "winston-daily-rotate-file";

const logger = winstonOrig.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  defaultMeta: { service: "ocean" },
  transports: [
    new winstonOrig.transports.Console({
      format: winstonOrig.format.simple(),
    }),
    new DailyRotateFile({ filename: "./logs/ocean-application.log" }),
  ],
});

export const winston = logger;
