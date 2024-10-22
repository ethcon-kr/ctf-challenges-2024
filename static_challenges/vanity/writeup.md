# Beginner: 8. Vanity Address



**Mission**

There are more wallets and smart contracts with cool addresses on the Ethereum network than you might think -

[contract](https://sepolia.scrollscan.com/address/0x4d4eA8c666b3Fb7300661A442e912d58dFcd59F8)

```solidity
pragma solidity =0.8.27;

contract Vanity {
    mapping(address user => bool hasFlag) public flag;

    function buyFlag(address user) external {
        require(uint160(tx.origin) & 0xffffff == 0xffffff, "invalid sender");
        flag[user] = true;
    }
}
```

출제의도: vanity address를 생성해보기

풀이:

이더리움의 지갑주소는 private key에서 public key를 구하고, 이 public key를 해시한 20바이트 값이 된다. 여기서 우리는 private key의 값을 바꿔가며, 원하는 형식의 주소가 나오도록 시도할 수 있다. 즉 brute force로 어느정도의 형식을 가진 지갑 주소를 생성할 수 있다.

해당 문제는 tx.origin의 주소 마지막 3바이트가 0xffffff이어야 flag를 획득할 수 있는 문제이다. 다양한 툴들이 있는데, foundry에서 cast wallet vanity 명령어로 구할 수 있다. 

command:

```solidity
cast wallet vanity --ends-with 0xffffff
```

result:

```solidity
Successfully found vanity address in 18.109 seconds.
Address: 0x6206D754Ee589306e6408D353E8C75c2A0fFFFff
Private Key: 0x0f4c01b4e3cf02e657954b0fb4e39bc63874a999590a0a75641cef2e0400db8a
```

### 주의!!!

**해당 주소 및 개인키는 절대 사용하지 마십시오!!!.**

우리는 정답을 제출하기 위해, buyFlag를 위에서 구한 vanity address 개인키로 서명하면서, 파라미터로 원래 우리의 지갑주소를 넘기면서 transaction을 보내야 한다. 

이 때, 해당 vanity address에 잔액이 없을 것이므로, 트랜잭션 fee를 위한 소량의 이더를 전송해주어야 한다.

send ether to vanity address:

```solidity
cast send 0x6206D754Ee589306e6408D353E8C75c2A0fFFFff --value 0.00001ether --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

buyFlag:

```solidity
cast send 0x4d4eA8c666b3Fb7300661A442e912d58dFcd59F8 "buyFlag(address)" 0x4C5F15604c4B63EcBe4DFfA125879e0CC278711b  --rpc-url $SCROLL_RPC_URL --private-key $VANITY_ADDRESS_PRIV_KEY
```

buyFlag의 파라미터로 본인의 지갑주소를 넣고, 위에서 구한 vaniti address의 private key로 서명하여 트랜잭션을 보내면 문제를 해결할 수 있다.

Flag:

```solidity
ethcon2024{0x00000000219ab540356cbb839cbe05303d7705fa}
```