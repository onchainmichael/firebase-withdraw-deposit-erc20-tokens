import { EventContext, logger } from "firebase-functions";
import { ConfigurationService, TransactionChecker, UsersService } from "../services";
import { PendingTransactionsService, TransactionsService } from "../services";
import { web3Provider } from "../core/web3";
import Config from "../config";
import { ConfigKeys } from "../core/enums";
import { Transaction } from "../models";
import { Filter } from "../repositories/abstractions";

export default async (context?: EventContext): Promise<boolean> => {
    try {
        const config = new ConfigurationService();
        const userService = new UsersService();
        const transactionService = new TransactionsService();
        const pendingsService = new PendingTransactionsService();

        const web3 = web3Provider.createWeb3();
        const contract = web3Provider.createContractInstance();


        const contractEvents = await contract.getPastEvents("Transfer", {
            fromBlock: await config.get(ConfigKeys.LastBlock),
            toBlock: "latest",
        });

        if (!contractEvents) {
            return true;
        }

        logger.debug(`Contract events [${contractEvents.length}]`, contractEvents);

        for (let event of contractEvents) {
            try {
                const transaction = event.transactionHash;
                if (transaction) {
                    if (transaction.to.toLowerCase() == Config.account.address) {
                        const pendingTransaction = await pendingsService.getByAddressHash(transaction.from.toLowerCase());
                        if (!pendingTransaction) {
                            continue;
                        }

                        if (!await transactionService.getByHash(transaction.transactionHash)) {
                            const amount: number = web3.utils.fromWei(transaction.value, 'ether');
                            const depositTransaction = Transaction.createDeposit(transaction.transactionHash, amount);

                            const user = userService.getByAddressHash(transaction.from.toLowerCase())

                            await transactionService.create(depositTransaction);
                        }
                    }
                }
            } catch (err) {
                logger.error(err);
            }
        }

        // const pendingTransactionService = new PendingTransactionsService();
        // const pendingTransactions = await pendingTransactionService.filterAll();

        // const checker = new TransactionChecker();
        // checker.subscribe('pendingTransactions');
        // for (let pt of pendingTransactions) {
        //     checker.watchTransactions(pt.address);
        // }

        return true;
    } catch (e) {
        logger.error("Transaction monitoring finished with error", e);
        return false;
    }
};
