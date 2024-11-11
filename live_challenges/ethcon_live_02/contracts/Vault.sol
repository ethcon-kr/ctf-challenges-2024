// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract Vault {
    error OnlyAirdrop();
    error InsufficientBalance();
    error OnlyStaker();
    error OnlyOwner();

    address public owner;

    struct History {
        bool isDeposit;
        address account;
        address token;
        uint256 amount;
        uint256 timestamp;
    }
    History[] public histories;

    mapping(address => mapping(address => uint256)) public balanceOf;

    constructor() {
        initialize(msg.sender);
    }

    function getHistory(uint256 start, uint256 count) external view returns (History[] memory) {
        if (start + count > histories.length)
            count = histories.length - start;

        History[] memory history = new History[](count);
        for (uint256 i = start; i < start + count; i++) {
            history[i - start] = histories[i];
        }
        return history;
    }

    function initialize(address owner_) public {
        owner = owner_;
    }

    function deposit(address token, uint256 amount) external {
        balanceOf[token][msg.sender] += amount;
        histories.push(History({
            isDeposit: true,
            account: msg.sender,
            token: token,
            amount: amount,
            timestamp: block.timestamp
        }));
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(address token, uint256 amount) external {
        require(balanceOf[token][msg.sender] >= amount, InsufficientBalance());
        balanceOf[token][msg.sender] -= amount;
        histories.push(History({
            isDeposit: false,
            account: msg.sender,
            token: token,
            amount: amount,
            timestamp: block.timestamp
        }));
        IERC20(token).transfer(msg.sender, amount);
    }

    function emergencyWithdraw(address from, address token, uint256 amount) external {
        require(msg.sender == owner, OnlyOwner());
        balanceOf[token][from] -= amount;
        
        histories.push(History({
            isDeposit: false,
            account: msg.sender,
            token: token,
            amount: amount,
            timestamp: block.timestamp
        }));

        IERC20(token).transfer(msg.sender, amount);
    }
}
