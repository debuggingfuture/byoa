import { Contract } from "../src/Contract.sol";
import "forge-std/Script.sol";

import { console2 } from "forge-std/src/console2.sol";

contract Deploy is Script {

    function setUp() public {}

    function deploySimple() public  returns (Contract agent) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);


        string memory basePrompt = 
"you are an agent\n"
"say Hi.\n";

       agent  = new Contract();


    }

    function deployAgent() public  returns (Contract agent) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);

        // https://docs.galadriel.com/oracle-address
        address initialOracleAddress = 0x68EC9556830AD097D661Df2557FBCeC166a0A075;


        string memory basePrompt = 
"you are an agent\n"
"say Hi.\n";

       agent  = new Contract();


    }
}