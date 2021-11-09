import { LoggerErrorOptions, LoggerLogOptions } from "../../types/util/classes/logger";

class Logger {
    // Logging non-error logs
    static log({ location, info }: LoggerLogOptions) {
        console.log(new Date().toISOString());
        console.log(`${location}: ${info}`);
    }

    // Logging errors
    static error({ location, error, info }: LoggerErrorOptions) {
        console.log("---------------------------------------");
        console.log(new Date().toISOString());
        console.log(`Location: ${location}`);
        if (info) {
            console.log(`Info: ${info}`)
        }
        console.log(error);
        console.log("---------------------------------------");
    }
}

export { Logger };