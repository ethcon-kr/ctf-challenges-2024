// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Airdrop {
    address private _owner;
    uint256 totalDrop;

    mapping(address user => bool isDone) public done;
    mapping(address user => uint256 balance) public balances;
    mapping(address user => uint256 claimed) public claimed;
    mapping(address user => bool hasFlag) public flag;

    constructor() {
        _owner = msg.sender;
    }

    function airdrop() external {
        require(done[msg.sender] == false, "already received the airdrop.");
        balances[msg.sender] += 1 wei;
        done[msg.sender] = true;
        totalDrop++;
    }

    function claim() external {
        require(balances[msg.sender] > 0, "no balance to claim");
        claimed[msg.sender] += 1 wei;
        payable(msg.sender).call{value: balances[msg.sender]}("");
        balances[msg.sender] = 0;
    }

    function buyFlag(address buyer) external payable {
        require(flag[buyer] == false, "already bought flag");
        require(claimed[msg.sender] == 10 wei, "not enought to buy flag");
        claimed[msg.sender] = 0;
        flag[buyer] = true;
    }

    function closeGame() external {
        require(msg.sender == _owner, "only owner can close the game");
        selfdestruct(payable(_owner));
    }

    fallback() external payable {}
}
