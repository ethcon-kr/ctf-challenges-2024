// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract Vanity {
    mapping(address user => bool hasFlag) public flag;

    function buyFlag(address user) external {
        require(uint160(tx.origin) & 0xffffff == 0xffffff, "invalid sender");
        flag[user] = true;
    }
}
