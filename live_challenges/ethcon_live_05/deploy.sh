#!/bin/bash

RPC_URL=https://sepolia-rpc.scroll.io
ADDRESS=0x715Bec120230730386d534F21b70b2D1d8cAb3ec
PRIVATE_KEY=
ETHERSCAN_API_KEY=

forge build > /dev/null

EC=`forge create contracts/EC.sol:EC --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
LOCKER=`forge create contracts/Locker.sol:Locker --private-key $PRIVATE_KEY --rpc-url $RPC_URL --constructor-args $EC --json | jq .deployedTo | tr -d '"'` > /dev/null
SOLVER=`forge create contracts/Solver.sol:Solver --private-key $PRIVATE_KEY --rpc-url $RPC_URL --constructor-args $EC --json | jq .deployedTo | tr -d '"'` > /dev/null

cast send $EC --rpc-url $RPC_URL --private-key $PRIVATE_KEY "init(address)" $LOCKER > /dev/null
cast send $EC --rpc-url $RPC_URL --private-key $PRIVATE_KEY "mint(address,uint256)" $ADDRESS `cast to-wei 100_000_000` > /dev/null

echo "NEXT_PUBLIC_EC_CONTRACT="$EC
echo "NEXT_PUBLIC_LOCKER_CONTRACT="$LOCKER
echo "NEXT_PUBLIC_SOLVER_CONTRACT="$SOLVER

sleep 60

forge verify-contract $EC contracts/EC.sol:EC --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null
forge verify-contract $LOCKER contracts/Locker.sol:Locker --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args `cast to-uint256 $EC` > /dev/null
forge verify-contract $SOLVER contracts/Solver.sol:Solver --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args `cast to-uint256 $EC` > /dev/null
