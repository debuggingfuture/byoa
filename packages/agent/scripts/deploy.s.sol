import { Contract } from "../src/Contract.sol";
import { AgentTemplate } from "../src/AgentTemplate.sol";
import "forge-std/Script.sol";

// import { console2 } from "forge-std/src/console2.sol";

contract Deploy is Script {

    function setUp() public {}

    function deploySimple() public  returns (Contract agent) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);

        agent  = new Contract();


    }

    function deployAgent() public  returns (Contract agent) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);

//         // https://docs.galadriel.com/oracle-address
//         address initialOracleAddress = 0x68EC9556830AD097D661Df2557FBCeC166a0A075;


//         string memory basePrompt = 
// "you are an agent\n"
// "say Hi.\n";

//        agent  = new Contract();


    }

    function deployCFAgent() public  returns (AgentTemplate agent) {
        // https://docs.chain.link/chainlink-functions/tutorials/api-query-parameters

        // //  sepolia
        // address routerAddress = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

        // optimism sepolia
        address routerAddress = 0xC17094E3A1348E5C7544D4fF8A36c28f2C6AAE28;


        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);

        agent  = new AgentTemplate(routerAddress, "up");


        // agent.registerFunction("sayHi", "function sayHi() public pure returns (string memory) { return 'Hi!'; }");

        // address routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
        // address linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
        // string memory donId = "fun-ethereum-sepolia-1";
        // string memory explorerUrl = "https://sepolia.etherscan.io";

        // uint64 subscriptionId = 3460;;
    }

    function run() public {
        // deploySimple();
        deployCFAgent();
    }
}