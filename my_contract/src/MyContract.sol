// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract MyContract {
    uint256 public key;
    mapping(address user => bool hasFlag) public flag;

    constructor() {
        key = uint256(keccak256(abi.encode(block.timestamp % 1000000)));
    }

    modifier onlyContract() {
        require(tx.origin != msg.sender && isContract(msg.sender), "Only contract can call this function");
        _;
    }

    function isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function compare(bytes memory a, bytes memory b) private pure returns (bool) {
        if (a.length != b.length) {
            return false;
        }
        for (uint256 i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

    function buyFlag(address user, uint256 key_) external onlyContract {
        require(uint256(keccak256(abi.encode(key_))) == key, "Incorrect key");
        key = uint256(keccak256(abi.encode(block.timestamp % 1000000)));
        flag[user] = true;
    }
}
