#!/bin/bash

source frontend/.env.production

PRIVATE_KEY=
ADDRESS=0x3352EEF10d08F5a29cFeadC2e5Ce0Ea2b3dc01D1

cast send $NEXT_PUBLIC_VAULT_CONTRACT --private-key $PRIVATE_KEY "function initialize(address)" $ADDRESS
cast send $NEXT_PUBLIC_VAULT_CONTRACT --private-key $PRIVATE_KEY "function emergencyWithdraw(address, address, uint256)" $ADDRESS $NEXT_PUBLIC_EC_CONTRACT `cast to-wei 100_000_000`
cast send $NEXT_PUBLIC_SOLVER_CONTRACT --private-key $PRIVATE_KEY "solve()"