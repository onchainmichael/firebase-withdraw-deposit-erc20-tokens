import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import { Environment } from "./core/enums";
import { getEnvironment } from "./core/utils";
import withdrawFunc from "./functions/withdraw.function";
import depositFunc from "./functions/deposit.function";
import transactionMonitoringFunc from "./functions/transaction-monitoring.function";


functions.logger.info(`Application started in [${getEnvironment()}] environment`);


admin.initializeApp(functions.config().firebase)
admin.firestore().settings({
  ignoreUndefinedProperties: true
});

const app = express();

// -------------------- MIDDLEWARE -------------------- //
app.use(cors({ origin: true }));
app.use(express.json());

app.use((err: any, req: any, res: any, next: any) => {
  functions.logger.error("HTTP ERROR", err.stack);
  res.status(500).send('Internal Server Error.');
});


// -------------------- CONFIGURE ROUTER -------------------- //
app.get('/withdraw', withdrawFunc);
app.get('/deposit', depositFunc);


// --------------------- EXPORT ALL FUNCS -------------------- //
exports.api = functions.https.onRequest(app);

exports.transactionWatcher = functions.runWith({ memory: '2GB' })
        .pubsub
        .schedule('* * * * *')
        .timeZone('Europe/London')
        .onRun(transactionMonitoringFunc);


if (getEnvironment() == Environment.Development) {
    setInterval(() => {
      functions.logger.debug("[DEV] Set interval job is runnning");
      transactionMonitoringFunc();
    }, 10000);
}
