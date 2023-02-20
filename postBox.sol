// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract postBox {
    string message;

    function postMsg(string memory text) public {
        message = text;
    }

    function getMsg() public view returns (string memory) {
        return message;
    }
}
