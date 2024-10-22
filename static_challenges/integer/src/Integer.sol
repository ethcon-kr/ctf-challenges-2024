// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

contract Integer {
    mapping(address => uint256) balances;
    mapping(address => bool) private minted;
    mapping(address => bool) public flag;

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function mint() external {
        require(minted[msg.sender] == false, "Already minted");
        balances[msg.sender] += 100;
        minted[msg.sender] = true;
    }

    function transfer(address receiver_, uint256 value_) external {
        require(balances[msg.sender] >= value_, "Insufficient balance");
        balances[msg.sender] -= value_;
        balances[receiver_] += value_;
    }

    function batchTransfer(
        address[] calldata receivers_,
        uint256 value_
    ) external {
        uint256 cnt = receivers_.length;
        uint256 amount = cnt * value_;
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        for (uint i = 0; i < cnt; i++) {
            balances[receivers_[i]] += value_;
        }
    }

    function buyFlag() external payable {
        require(
            balances[msg.sender] >=
                10000000000000000000000000000000000000000000000000000000000 ether,
            "Insufficient balance"
        );
        balances[msg.sender] = 0;
        flag[msg.sender] = true;
    }
}
