import pino, { type LoggerOptions } from "pino";

const isProduction = process.env.NODE_ENV === "production";
const isServer = typeof window === "undefined";

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
};

if (!isProduction && isServer) {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

export const logger = pino(options);

