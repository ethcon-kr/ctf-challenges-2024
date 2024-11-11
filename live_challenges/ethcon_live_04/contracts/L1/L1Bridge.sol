// SPDX-License-Identifier: MIT
pragma solidity =0.8.27;

import {ERC20} from "../ERC20.sol";

interface IL1Messenger {
    function sendMessage(address _to, uint256 _value, bytes memory _message, uint256 _gasLimit, address _refundAddress) external payable;
}

contract L1Bridge {
    error OnlyOwner();
    error PairNotSet();
    address public immutable owner;
    IL1Messenger public constant L1_MESSENGER = IL1Messenger(0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A);
    address public l2Receiver;

    mapping(address => address) public pairs;

    constructor() {
        owner = msg.sender; 
    }

    function setPair(address token, address l2Token) external {
        require(msg.sender == owner, OnlyOwner());
        pairs[token] = l2Token;
    }

    function setL2Receiver(address l2Receiver_) external {
        require(msg.sender == owner, OnlyOwner());
        l2Receiver = l2Receiver_;
    }

    function bridge(address token, uint256 amount, uint256 gasLimit) external payable {
        require(pairs[token] != address(0), PairNotSet());
        ERC20(token).transferFrom(msg.sender, address(this), amount);

        bytes memory message = abi.encodeWithSignature("bridge(address,address,uint256)", msg.sender, pairs[token], amount);
        L1_MESSENGER.sendMessage{value: msg.value}(l2Receiver, 0, message, gasLimit, msg.sender);
    }
}