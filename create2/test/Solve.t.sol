// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";

contract Solve is Test {
    function calc(bytes memory seed, bytes memory code) private view returns (address addr) {
        address self = address(this);
        bytes32 hash = keccak256(code);
        bytes32 salt = keccak256(seed);
        assembly {
            let ptr := mload(0x40)
            mstore(add(ptr, 0x20), salt)
            mstore(add(ptr, 0x40), hash)
            mstore(ptr, self)
            let start := add(ptr, 0x0b)
            mstore8(start, 0xff)
            addr := keccak256(start, 85)
        }
    }

    function test() public view {
        for (uint256 i = vm.envUint("start"); i < vm.envUint("end"); i++) {
            address addr = calc(abi.encode(i), "");
            if (uint160(addr) & 0xffffff == 0xffffff) {
                console.log("found:", i);
                break;
            }
        }
    }
}
