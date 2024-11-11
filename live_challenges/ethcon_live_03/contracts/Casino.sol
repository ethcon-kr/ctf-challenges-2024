// SPDX-License-Identifier: MIT
pragma solidity =0.8.27;

contract Casino {
    error Ended();
    error OnlyEOA();
    error AlreadyPlayed();

    uint256 public jackpot = 100_000_000;
    address public jackpotWinner;

    mapping(address => uint256) public wins;
    mapping(address => uint256) public rounds;
    mapping(address => mapping(uint256 => bool)) public results;
    mapping(address => mapping(uint256 => bool)) public alreadyPlayed;

    function play(bool isEven) external {
        require(alreadyPlayed[msg.sender][block.number] == false, AlreadyPlayed());
        require(jackpotWinner == address(0), Ended());
        require(msg.sender == tx.origin, OnlyEOA());

        uint256 random = uint256(keccak256(abi.encode(block.number, msg.sender))) % 2;
        if (random == 0) {
            results[msg.sender][rounds[msg.sender]++] = true; // even
        } else {
            results[msg.sender][rounds[msg.sender]++] = false; // odd
        }

        if (isEven && random == 0) {
            ++wins[msg.sender];
        } else if (!isEven && random == 1) {
            ++wins[msg.sender];
        } else {
            wins[msg.sender] = 0;
        }

        if (wins[msg.sender] == 10) {
            jackpotWinner = msg.sender;
        }

        alreadyPlayed[msg.sender][block.number] = true;
    }
}