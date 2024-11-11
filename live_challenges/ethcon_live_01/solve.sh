#!/bin/bash

source frontend/.env.production

PRIVATE_KEY=

cast send $NEXT_PUBLIC_AIRDROP_CONTRACT --private-key $PRIVATE_KEY "claim()"
cast send $NEXT_PUBLIC_STAKER_CONTRACT --private-key $PRIVATE_KEY "stake(uint256, uint256)" `cast to-wei 5` 65529
cast send $NEXT_PUBLIC_STAKER_CONTRACT --private-key $PRIVATE_KEY "withdraw()"
cast send $NEXT_PUBLIC_SOLVER_CONTRACT --private-key $PRIVATE_KEY "solve()"