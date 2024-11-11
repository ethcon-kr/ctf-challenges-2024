#!/bin/bash

RPC_URL=https://sepolia-rpc.scroll.io
PRIVATE_KEY=
ETHERSCAN_API_KEY=

forge build > /dev/null

CASINO=`forge create contracts/Casino.sol:Casino --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
SOLVER=`forge create contracts/Solver.sol:Solver --private-key $PRIVATE_KEY --rpc-url $RPC_URL --constructor-args $CASINO --json | jq .deployedTo | tr -d '"'` > /dev/null
echo "NEXT_PUBLIC_CASINO_CONTRACT="$CASINO
echo "NEXT_PUBLIC_SOLVER_CONTRACT="$SOLVER

sleep 60

forge verify-contract $CASINO contracts/Casino.sol:Casino --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null