// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

// TODO token ERC-6511
contract AgentTemplate {
    // Public function to return a greeting message
    function sayHi() public pure returns (string memory) {
        return "Hi!";
    }
}