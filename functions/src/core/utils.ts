import { EventContext, logger, Response } from "firebase-functions";
import { pubsub } from "firebase-functions";
import { Environment } from "./enums";

export function error(response: Response, code: number, message: string) {
    logger.info(`[error:${code}] ${message}`);

    const payload = {
        status: code,
        error: message
    };

    response.status(code).send(payload);
}

export function success(response: Response, code: number = 200, data: Object | null = null) {
    const payload = {
        status: code,
        data: data
    };

    response.status(code).send(payload);
}

export function getEnvironment(): Environment {
    if (process.env.FUNCTIONS_EMULATOR) {
        return Environment.Development;
    } else {
        return Environment.Production;
    }
}
