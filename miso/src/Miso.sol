// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Miso {
    mapping(address => bool) public flag;
    mapping(address user => uint256 balance) public balances;

    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
    }

    function transfer(address recipient, uint256 amount) external {
        require(balances[msg.sender] >= amount, "insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
    }

    function buyToken() external payable {
        require(msg.value == 1 ether, "invalid value");
        balances[msg.sender] += msg.value * 100;
    }

    function batch(
        bytes[] calldata calls
    ) external payable returns (bytes[] memory results) {
        results = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory result) = address(this).delegatecall(
                calls[i]
            );
            require(success, "delegatecall failed");
            results[i] = result;
        }
    }

    function buyFlag() external payable {
        require(balances[msg.sender] >= 1e5 ether, "insufficient balance");
        flag[msg.sender] = true;
        balances[msg.sender] = 0;
    }
}
