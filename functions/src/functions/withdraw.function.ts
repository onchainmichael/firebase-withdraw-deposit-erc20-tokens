import { logger } from "firebase-functions";
import { Request, Response } from "express";
import { error, success } from "../core/utils";
import { ConfigKeys } from "../core/enums";
import { Transaction } from "../models";
import { UsersService, TransactionsService } from "../services";
import { BlockchainService, ConfigurationService } from "../services";


/*
 * Withdraw all user balance
 */
export default async (request: Request, response: Response) => {
  const userAddressHash: string | any = request.query.hash;

  if (!userAddressHash) {
    error(response, 400, "Valid query parameter 'hash' required.");
  } else {
    const usersService = new UsersService();
    const transactionsService = new TransactionsService();

    const user = await usersService.getByAddressHash(userAddressHash);

    if (user) {
      if (user.balance < 0.000001) {
        return error(response, 400, "User balance is empty");
      }

      const blockchainService = new BlockchainService();
      const tokenAmount = await calcTokenAmount(user.balance)
      const result = await blockchainService.sendTransaction(user.id, tokenAmount);

      if (result.error) {
        logger.error("Transaction error", result.error);
        error(response, 400, result.error);
        return;
      }

      const transaction = Transaction.createWithdraw(result.transactionHash, tokenAmount);
      logger.debug("Transaction for user " + userAddressHash, transaction);
      await transactionsService.create(transaction);

      user.balance = 0;
      await usersService.update(user);

      success(response);
    } else {
      return error(response, 404, "User with given 'hash' not found.");
    }
  }
}

async function calcTokenAmount(amount: number): Promise<number> {
  const config = new ConfigurationService();
  const rate = await config.get(ConfigKeys.ConversionRate);
  return amount * rate.value;
}