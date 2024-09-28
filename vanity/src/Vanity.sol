// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract Vanity {
    mapping(address user => bool hasFlag) public flag;

    function buyFlag() external {
        require(uint160(msg.sender) & 0xffffff == 0xffffff, "invalid sender");
        flag[msg.sender] = true;
    }
}
