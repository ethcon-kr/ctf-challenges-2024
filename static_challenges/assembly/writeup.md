# Beginner: 5. Assembly



**Mission**

Using Solidity assembly with caution can optimize both the time and space costs consumed by the ethereum virtual machine. However, if used incorrectly, it can lead to significant mistakes, so caution is necessary - [contract](https://sepolia.scrollscan.com/address/0x26f5b6B00557463f4deBe9D16E1D313aFD879C82)

```solidity
pragma solidity =0.8.27;

contract Assembly {
    function flag(address) external view returns (bool) {
        assembly {
            mstore(0, sload(calldataload(4)))
            return(0, 0x20)
        }
    }

    function checker(uint256) external {
        assembly ("memory-safe") {
            if eq(
                mul(mload(0x40), shr(0xe0, calldataload(0))),
                xor(calldataload(4), shr(0xe0, shl(0xe0, caller())))
            ) {
                sstore(caller(), 1)
            }
        }
    }
}
```

출제의도: EVM Assembly 분석

풀이:

cheker함수에서 inline assembly를 확인하고 적절한 파라미터를 넘겨야 한다.

```solidity
function checker(uint256) external {
        assembly ("memory-safe") {
            if eq(mul(mload(0x40), shr(0xe0, calldataload(0))), xor(calldataload(4), shr(0xe0, shl(0xe0, caller())))) {
                sstore(caller(), 1)
            }
        }
    }
```

어셈블리를 하나씩 분석해보자.

먼저 eq연산의 첫번째 파라미터를 보자.

```solidity
mul(mload(0x40), shr(0xe0, calldataload(0))
```

mload(0x40)은 메모리에서 0x40번지에 있는 데이터를 stack으로 가져오는 옵코드이다.

컨트랙트 바이트코드를 확인하면 처음 0x40에 0x80을 넣는 것을 볼 수 있다.

shr은 오른쪽으로 첫번째 파라미터만큼 두번째 파라미터를 shift하는 옵코드이다.

calldataload는 calldata의 데이터를 stack으로 0x20만큼 가져오는데, 0번째 calldata를 가져오면, 함수 시그니쳐를 가져오게 된다.

calldata 확인하기:

```solidity
cast calldata "checker(uint256)" 0x1
```

result:

```solidity
0x94e05b2c0000000000000000000000000000000000000000000000000000000000000001
```

이 calldata(0)을 오른쪽으로 0xe0만큼 shift하면, 함수 시그니쳐 4바이트만 남게된다. 그렇다면 아래와 같이 생각할 수 있다.

```solidity
mul(0x80, 0x94e05b2c) //mul은 곱하기 
```

이제 eq의 두번째 파라미터를 보자.

```solidity
xor(calldataload(4), shr(0xe0, shl(0xe0, caller())))
```

calldataload(4)는 함수시그니쳐 4바이트 뒤의 데이터를 0x20만큼 읽는다. 이는 checker함수의 uint256 파라미터 값이 된다. caller()는 msg.sender를 가져오는 옵코드이며 이를 왼쪽으로 0xe0, 오른쪽으로 0xe0만큼 하게 된다. [https://www.evm.codes/playground](https://www.evm.codes/playground)  해당 링크에서 아래와 같이 확인해 볼 수 있다.

```solidity
PUSH20 [YOUR_ADDRESS]
PUSH1 0xe0
SHL
PUSH1 0xe0
SHR
```

위의 결과 값을 result라고 하자. 위와 같이 해서 나온 결과와 uint256 파라미터 값을 xor한 값과, eq의 첫번째 파라미터가 같으면, sstore로 나의 지갑주소에 대해 true값을 갖게 할 수 있다. eq는 두 파라미터의 값이 같으면 1 그렇지 않으면 0이다. 즉 우리는 다음과 같이 했을 때 나오는 값을 checker의 파라미터로 넘기면 된다.

```solidity
xor(mul(0x80, 0x94e05b2c), shr(0xe0, shl(0xe0, caller())))
```

이는 아래와 같다.

```solidity
xor(mul(0x80, 0x94e05b2c), result)
```

그러면 아래와 같이 해서 나오는 값을 checker에 넘기면 된다.

```
push1 0x80
push4 0x94e05b2c
mul
push4 0xc278711b // result
xor
```

0x4ab255e71b가 최종결과로 나왔다. 이 값을 checker함수의 파라미터로 넘기면 된다.

```solidity
cast send 0x26f5b6B00557463f4deBe9D16E1D313aFD879C82 "checker(uint256)" 0x4ab255e71b --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

Flag:

```solidity
ethcon2024{Assembly gives you more fine-grained control, which is especially useful when you are enhancing the language by writing libraries or optimizing gas usage.}
```