// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Airdrop {
    address private _owner;

    mapping(address user => bool isDone) public done;
    mapping(address user => uint256 balance) public balances;
    mapping(address user => uint256 claimed) public claimed;
    mapping(address user => bool hasFlag) public flag;

    constructor() {
        _owner = msg.sender;
    }

    function airdrop() external {
        require(done[msg.sender] == false, "already airdropped");
        balances[msg.sender] += 1 ether;
        done[msg.sender] = true;
    }

    function claim() external {
        require(balances[msg.sender] > 0, "no balance to claim");

        claimed[msg.sender] += 1;
        payable(msg.sender).call{value: 1 ether}("");
        balances[msg.sender] = 0;
    }

    function buyFlag() external payable {
        require(flag[msg.sender] == false, "already bought flag");
        require(claimed[msg.sender] > 1, "not enought to buy flag");
        require(msg.value == claimed[msg.sender], "not enought KLAY to buy flag");

        flag[msg.sender] = true;
    }

    function closeGame() external {
        require(msg.sender == _owner, "only owner can close the game");
        selfdestruct(payable(_owner));
    }
}
