// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Create2 {
    mapping(address user => bool hasFlag) public flag;

    modifier onlyContract() {
        require(tx.origin != msg.sender && isContract(msg.sender), "only contract can call this function");
        _;
    }

    function isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function buyFlag(address user) external onlyContract {
        require(uint160(msg.sender) & 0xffffff == 0xffffff, "invalid sender");
        flag[user] = true;
    }
}
