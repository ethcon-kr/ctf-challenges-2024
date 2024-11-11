#!/bin/bash

forge build > /dev/null

L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=https://sepolia-rpc.scroll.io

PRIVATE_KEY=
ETHERSCAN_API_KEY1=
ETHERSCAN_API_KEY2=

L2_RECEIVER=`forge create contracts/L2/L2Receiver.sol:L2Receiver --private-key $PRIVATE_KEY --rpc-url $L2_RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
L2_EC=`forge create contracts/L2/L2EC.sol:L2EC --private-key $PRIVATE_KEY --rpc-url $L2_RPC_URL --constructor-args $L2_RECEIVER --json | jq .deployedTo | tr -d '"'` > /dev/null
L2_BTC=`forge create contracts/L2/L2BTC.sol:L2BTC --private-key $PRIVATE_KEY --rpc-url $L2_RPC_URL --constructor-args $L2_RECEIVER --json | jq .deployedTo | tr -d '"'` > /dev/null
SOLVER=`forge create contracts/L2/Solver.sol:Solver --private-key $PRIVATE_KEY --rpc-url $L2_RPC_URL --constructor-args $L2_BTC --json | jq .deployedTo | tr -d '"'` > /dev/null

L1_EC=`forge create contracts/L1/L1EC.sol:L1EC --private-key $PRIVATE_KEY --rpc-url $L1_RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
L1_BRIDGE=`forge create contracts/L1/L1Bridge.sol:L1Bridge --private-key $PRIVATE_KEY --rpc-url $L1_RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null

cast send $L1_BRIDGE --private-key $PRIVATE_KEY --rpc-url $L1_RPC_URL "setL2Receiver(address)" $L2_RECEIVER > /dev/null
cast send $L1_BRIDGE --private-key $PRIVATE_KEY --rpc-url $L1_RPC_URL "setPair(address,address)" $L1_EC $L2_EC > /dev/null

echo "NEXT_PUBLIC_L1_EC_CONTRACT="$L1_EC
echo "NEXT_PUBLIC_L1_BRIDGE_CONTRACT="$L1_BRIDGE
echo "NEXT_PUBLIC_L2_RECEIVER_CONTRACT="$L2_RECEIVER
echo "NEXT_PUBLIC_L2_EC_CONTRACT="$L2_EC
echo "NEXT_PUBLIC_L2_BTC_CONTRACT="$L2_BTC
echo "NEXT_PUBLIC_SOLVER_CONTRACT="$SOLVER

sleep 60

forge verify-contract $L2_RECEIVER contracts/L2/L2Receiver.sol:L2Receiver --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY1 > /dev/null
forge verify-contract $L2_EC contracts/L2/L2EC.sol:L2EC --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY1--constructor-args `cast to-uint256 $L2_RECEIVER` > /dev/null
forge verify-contract $L2_BTC contracts/L2/L2BTC.sol:L2BTC --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY1 --constructor-args `cast to-uint256 $L2_RECEIVER` > /dev/null
forge verify-contract $SOLVER contracts/L2/Solver.sol:Solver --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY1 --constructor-args `cast to-uint256 $L2_BTC` > /dev/null
forge verify-contract $L1_EC contracts/L1/L1EC.sol:L1EC --compiler-version 0.8.27 --verifier-url https://api-sepolia.etherscan.io/api --etherscan-api-key $ETHERSCAN_API_KEY2 > /dev/null
forge verify-contract $L1_BRIDGE contracts/L1/L1Bridge.sol:L1Bridge --compiler-version 0.8.27 --verifier-url https://api-sepolia.etherscan.io/api --etherscan-api-key $ETHERSCAN_API_KEY2 > /dev/null