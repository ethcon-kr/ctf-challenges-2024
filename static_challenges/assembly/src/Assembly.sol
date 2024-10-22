// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract Assembly {
    function flag(address) external view returns (bool) {
        assembly {
            mstore(0, sload(calldataload(4)))
            return(0, 0x20)
        }
    }

    function checker(uint256) external {
        assembly ("memory-safe") {
            if eq(
                mul(mload(0x40), shr(0xe0, calldataload(0))),
                xor(calldataload(4), shr(0xe0, shl(0xe0, caller())))
            ) {
                sstore(caller(), 1)
            }
        }
    }
}
