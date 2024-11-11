#!/bin/bash

forge build > /dev/null

RPC_URL=https://sepolia-rpc.scroll.io
PRIVATE_KEY=
ETHERSCAN_API_KEY=

EC=`forge create contracts/EC.sol:EC --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
VAULT=`forge create contracts/Vault.sol:Vault --private-key $PRIVATE_KEY --rpc-url $RPC_URL --json | jq .deployedTo | tr -d '"'` > /dev/null
SOLVER=`forge create contracts/Solver.sol:Solver --private-key $PRIVATE_KEY --rpc-url $RPC_URL --constructor-args $EC --json | jq .deployedTo | tr -d '"'` > /dev/null

cast send $EC --private-key $PRIVATE_KEY --rpc-url $RPC_URL "approve(address, uint256)" $VAULT `cast to-wei 100_000_000` > /dev/null
cast send $VAULT --private-key $PRIVATE_KEY --rpc-url $RPC_URL "deposit(address, uint256)" $EC `cast to-wei 100_000_000` > /dev/null

echo "NEXT_PUBLIC_VAULT_CONTRACT="$VAULT
echo "NEXT_PUBLIC_EC_CONTRACT="$EC
echo "NEXT_PUBLIC_SOLVER_CONTRACT="$SOLVER

sleep 60

forge verify-contract $VAULT contracts/Vault.sol:Vault --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null
forge verify-contract $EC contracts/EC.sol:EC --compiler-version 0.8.27 --verifier-url https://api-sepolia.scrollscan.com/api --etherscan-api-key $ETHERSCAN_API_KEY > /dev/null