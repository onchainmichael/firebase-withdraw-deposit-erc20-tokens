import Config from "../config";

const Contract = require('web3-eth-contract');
const Web3 = require("web3");

Contract.setProvider(Config.web3SocketsProviderUrl);


const _web3Provider = new Web3.providers.HttpProvider(Config.web3HttpProviderUrl);

_web3Provider.createWeb3 = function() {
    this.web3Instance = new Web3(this);
    return this.web3;
}

_web3Provider.createContractInstance = function() {
    if (!this.web3Instance) {
        this.createWeb3();
    }

    return new this.web3Instance.eth.Contract(Config.abi, Config.smartContractAddress);
}

// const _web3WSProvider = new Web3.providers.HttpProvider(Config.web3SocketsProviderUrl);
// _web3WSProvider.createWeb3 = function() {return new Web3(this); }

export const web3Provider = _web3Provider;
// export const web3WSProvider = _web3WSProvider;
