// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract wKlay {
    uint256 public decimals = 18;
    string public symbol = "wKlay";
    address private _owner;
    mapping(address user => bool hasFlag) public flag;
    mapping(address user => uint256 balance) private _balances;

    constructor() {
        _owner = msg.sender;
    }

    function wrap() external payable {
        _balances[msg.sender] += msg.value;
    }

    function unwrap(uint256 amount) external {
        require(amount < 0.00000001 ether, "too big to unwrap");
        _balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function balanceOf(address user) external view returns (uint256) {
        return _balances[user];
    }

    function transfer(address recipient, uint256 amount) external {
        require(recipient != address(0), "transfer to zero address");
        uint256 senderBalance = _balances[msg.sender];
        uint256 recipientBalance = _balances[recipient];
        require(senderBalance >= amount, "transfer amount exceeds balance");
        _balances[msg.sender] = senderBalance - amount;
        _balances[recipient] += recipientBalance + amount;
    }

    function buyFlag() external {
        require(flag[msg.sender] == false, "already bought flag");
        require(_balances[msg.sender] >= 10000 ether, "not enough balance");
        _balances[msg.sender] -= 10000 ether;
        flag[msg.sender] = true;
    }

    function closeGame() external {
        require(msg.sender == _owner, "only owner can close the game");
        selfdestruct(payable(_owner));
    }
}
