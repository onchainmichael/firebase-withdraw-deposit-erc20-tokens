export default class Config {
    public static web3HttpProviderUrl = "http node connection";
    public static web3SocketsProviderUrl = "wss node connection";

    public static smartContractAddress = "";

    public static account = {
        address: "",
        privateKey: ""
    }

    public static abi = require("./abi").abi;
}