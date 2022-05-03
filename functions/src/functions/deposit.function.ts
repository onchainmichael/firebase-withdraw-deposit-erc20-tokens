import { logger } from "firebase-functions";
import { Request, Response } from "express";
import { error, success } from "../core/utils";
import { PendingTransaction } from "../models";
import { UsersService, PendingTransactionsService } from "../services";


/*
 * Deposite on user balance
 */
export default async (request: Request, response: Response) => {
  const userHash: string | any = request.query.hash;
  const userAddress: string | any = request.query.address;

  if (!userHash) {
    error(response, 400, "Valid query parameter 'hash' required.");
  } if (!userAddress) {
    error(response, 400, "Valid query parameter 'address' required.");
  } else {
    const usersService = new UsersService();
    const pendingTransactionsService = new PendingTransactionsService();

    const user = await usersService.getByAddressHash(userHash);

    if (user) {
      const transaction = PendingTransaction.create(user.id, userAddress);

      // TODO: mb check if not exists
      await pendingTransactionsService.create(transaction);
      logger.debug("Created pending transaction ", transaction);

      success(response);
    } else {
      return error(response, 404, "User with given 'hash' not found.");
    }
  }
}