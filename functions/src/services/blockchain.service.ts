import { logger } from "firebase-functions";
import Config from "../config";
import { web3Provider } from "../core/web3";

export class SendTransactionResult {
    constructor(
        public readonly transactionHash: string,
        public readonly error: string | null
    ) {}

    static error(error: string) {
        return new SendTransactionResult("", error);
    }

    static success(transactionHash: string) {
        return new SendTransactionResult(transactionHash, null);
    }
}


export class BlockchainService {
    private readonly web3: any;
    private readonly contract: any;

    constructor() {
        this.web3 = web3Provider.createWeb3();
        this.contract = web3Provider.createContractInstance();
    }

    async sendTransaction(replenishAddress: string, amount: number): Promise<SendTransactionResult> {
       try {
        const holderBalance = await this.getMoneyHolderBalance();
        logger.debug("Amount", amount);
        const weiAmount = this.web3.utils.toWei(amount.toString(), "ether");

        // check if requested amount < balance of money holder -> throw error if less
        if(amount > +holderBalance) {
            return SendTransactionResult.error("Not enough money to transfer");
        }

        const contractTransaction = this.initTransfer(replenishAddress, weiAmount);
        const receipt = await this.sendContractTransaction(contractTransaction);
        
        return SendTransactionResult.success(receipt.transactionHash);

       } catch (e) {
           logger.error("Transaction failed", e);
           return SendTransactionResult.error((e as Error).message);
       }
    }

    // get balance from money holder wallet address
    private async getMoneyHolderBalance(): Promise<string> {
        const balance = await this.web3.eth.getBalance(Config.account.address);
        logger.debug("Money holder balance is", balance);
        return balance;
    }

    private initTransfer(toAddress: string, weiAmount: string) {
        return this.contract.methods.transfer(toAddress, weiAmount)
    }

    private async sendContractTransaction(transaction: any) {
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({ from: Config.account.address }),
        };

        const signed = await this.web3.eth.accounts.signTransaction(options, Config.account.privateKey);
        return await this.web3.eth.sendSignedTransaction(signed.rawTransaction);
    }
}