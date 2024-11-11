#!/bin/bash

# anvil --fork-url https://sepolia-rpc.scroll.io --fork-block-number 6957010 --chain-id 31337 --auto-impersonate

source frontend/.env.production

PRIVATE_KEY=

MSG=`cast calldata "bridge(address to, address token, uint256 amount)" 0xCB506Ff02Ff3DAb9AD204079FaFD5eC650E65b3c $NEXT_PUBLIC_L2_BTC_CONTRACT 100000000000000000000000000`

cast send 0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d \
--unlocked --from 0x61d8d3E7F7c656493d1d76aAA1a836CEdfCBc27b \
--private-key $PRIVATE_KEY \
"relayMessage(address _from,address _to,uint256 _value,uint256 _nonce,bytes _message)" \
0xCB506Ff02Ff3DAb9AD204079FaFD5eC650E65b3c \
$NEXT_PUBLIC_L2_RECEIVER_CONTRACT \
0 \
1058501 \
$MSG

cast send $NEXT_PUBLIC_SOLVER_CONTRACT --private-key $PRIVATE_KEY "solve()"
