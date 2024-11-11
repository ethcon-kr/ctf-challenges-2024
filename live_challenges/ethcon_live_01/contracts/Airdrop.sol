// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {EC} from "./EC.sol";

contract Airdrop {
    error AlreadyClaimed();

    mapping(address => bool) public claimed;
    address public ec;

    constructor(address ec_) {
        ec = ec_;
    }

    function claim() external {
        require(!claimed[msg.sender], AlreadyClaimed());
        claimed[msg.sender] = true;
        EC(ec).mint(msg.sender, 5 ether);
    }
}
