// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract wKlay {
    mapping(address user => bool hasFlag) public flag;
    mapping(address user => uint256 balance) private _balances;

    function wrap() external payable {
        _balances[msg.sender] += msg.value;
    }

    function unwrap(uint256 amount) external {
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
        require(_balances[msg.sender] >= 10000 ether, "not enough balance");
        _balances[msg.sender] -= 10000 ether;
        flag[msg.sender] = true;
    }
}
