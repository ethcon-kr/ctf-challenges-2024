// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {EC} from "./EC.sol";

contract Locker {
    error OnlyOwner();
    error InsufficientBalance();
    error InvalidPassword();

    address public immutable owner;
    EC public immutable ec;

    mapping(uint256 lockId => uint256 amount) public lockedOf;
    mapping(uint256 lockId => bytes32 passwd) public passwdOf;
    uint256 public currentLockId;

    constructor(EC ec_) {
        owner = msg.sender;
        ec = ec_;
    }
    
    function lock(uint256 amount, bytes32 passwd) external {
        require(amount > 0, InsufficientBalance());
        lockedOf[currentLockId] = amount;
        passwdOf[currentLockId++] = passwd;
        ec.burnFrom(msg.sender, amount);
    }

    function unlock(uint256 lockId, string memory passwd) external {
        require(lockedOf[lockId] > 0, InsufficientBalance());
        require(passwdOf[lockId] == keccak256(abi.encode(passwd)), InvalidPassword());
        uint256 amount = lockedOf[lockId];
        lockedOf[lockId] = 0;
        ec.mint(msg.sender, amount);
    }
}
