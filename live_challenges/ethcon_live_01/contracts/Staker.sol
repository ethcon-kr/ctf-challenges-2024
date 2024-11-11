// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {EC} from "./EC.sol";
import {Point} from "./Point.sol";

contract Staker {
    error InvalidLockupPeriod();
    error CannotWithdrawYet();
    error InsufficientBalance();
    error AlreadyStaked();
    error OnlyOwner();
    error NotStaked();
    
    address public immutable owner;
    address public ec;
    address public point;

    mapping(address => uint256) public stakedOf;
    mapping(address => uint256) public rewardOf;
    mapping(address => uint256) public withdrawAt;
    uint256 public constant REWARD_PER_A_DAY = 0.01 ether;
    uint256 public constant MINIMUM_LOCKUP_PERIOD = 7;

    constructor() {
        owner = msg.sender;
    }

    function init(address ec_, address point_) external {
        require(msg.sender == owner, OnlyOwner());
        ec = ec_;
        point = point_;
    }

    function getLockupPeriod(uint256 lockupPeriod) internal pure returns (uint256) {
        if (lockupPeriod == 0) return MINIMUM_LOCKUP_PERIOD;
        uint256 period = uint16(MINIMUM_LOCKUP_PERIOD + lockupPeriod);
        require(period <= 365, InvalidLockupPeriod());
        return period;
    }
    
    function stake(uint256 amount, uint256 lockupPeriod) external {
        require(amount > 0, InsufficientBalance());
        require(stakedOf[msg.sender] == 0, AlreadyStaked());
        stakedOf[msg.sender] = amount;
        rewardOf[msg.sender] = amount * REWARD_PER_A_DAY * (lockupPeriod + 7) / 1e18;
        withdrawAt[msg.sender] = block.timestamp + getLockupPeriod(lockupPeriod) * 86400;
        EC(ec).burnFrom(msg.sender, amount);
    }

    function withdraw() external {
        require(withdrawAt[msg.sender] <= block.timestamp, CannotWithdrawYet());
        require(stakedOf[msg.sender] > 0, NotStaked());
        uint256 reward = rewardOf[msg.sender];
        stakedOf[msg.sender] = 0;
        rewardOf[msg.sender] = 0;
        withdrawAt[msg.sender] = 0;

        Point(point).mint(msg.sender, reward);
    }
}
