#!/bin/bash

RPC_URL=https://sepolia-rpc.scroll.io
PRIVATE_KEY=
ETHERSCAN_API_KEY=

forge build > /dev/null

EC=`forge create contracts/EC.sol:EC --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
STAKER=`forge create contracts/Staker.sol:Staker --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
POINT=`forge create contracts/Point.sol:Point --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json --constructor-args $STAKER | jq .deployedTo | tr -d '"'` > /dev/null
AIRDROP=`forge create contracts/Airdrop.sol:Airdrop --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json --constructor-args $EC | jq .deployedTo | tr -d '"'` > /dev/null
SOLVER=`forge create contracts/Solver.sol:Solver --private-key $PRIVATE_KEY --rpc-url $RPC_URL --constructor-args $POINT --json | jq .deployedTo | tr -d '"'` > /dev/null

echo "NEXT_PUBLIC_EC_CONTRACT="$EC
echo "NEXT_PUBLIC_AIRDROP_CONTRACT="$AIRDROP
echo "NEXT_PUBLIC_POINT_CONTRACT="$POINT
echo "NEXT_PUBLIC_STAKER_CONTRACT="$STAKER
echo "NEXT_PUBLIC_SOLVER_CONTRACT="$SOLVER

cast send $EC --rpc-url $RPC_URL --private-key $PRIVATE_KEY "init(address, address)" $AIRDROP $STAKER > /dev/null
cast send $STAKER --rpc-url $RPC_URL --private-key $PRIVATE_KEY "init(address, address)" $EC $POINT > /dev/null

sleep 60

forge verify-contract $EC contracts/EC.sol:EC --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null
forge verify-contract $AIRDROP contracts/Airdrop.sol:Airdrop --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null
forge verify-contract $POINT contracts/Point.sol:Point --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null
forge verify-contract $STAKER contracts/Staker.sol:Staker --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null