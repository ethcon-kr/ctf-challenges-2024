# Beginner: 4. My Contract



**Mission**

Deploying a smart contract and interacting with other smart contracts is as essential in the blockchain era as knowing how to use a smartphone in the modern world - [contract](https://sepolia.scrollscan.com/address/0x24367e5995739E789b09bEfD1270B47799AB3C4F)

```solidity
pragma solidity =0.8.27;

contract MyContract {
    uint256 public key;
    mapping(address user => bool hasFlag) public flag;

    constructor() {
        key = uint256(keccak256(abi.encode(block.timestamp % 1000000)));
    }

    modifier onlyContract() {
        require(
            tx.origin != msg.sender && isContract(msg.sender),
            "Only contract can call this function"
        );
        _;
    }

    function isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function buyFlag(address user, uint256 key_) external onlyContract {
        require(uint256(keccak256(abi.encode(key_))) == key, "Incorrect key");
        key = uint256(keccak256(abi.encode(block.timestamp % 1000000)));
        flag[user] = true;
    }
}
```

출제의도 : 컨트랙트를 직접 구현하고 다른 컨트랙트와 상호작용 하기.

풀이 :

컨트랙트를 직접 작성해 다른 컨트랙트와 상호작용하여 문제를 해결해야 한다.

우리는 우선 문제 컨트랙트의 key값을 알아내야 한다.

command:

```solidity
cast call 0x24367e5995739E789b09bEfD1270B47799AB3C4F "key()(uint256)" --rpc-url $SCROLL_RPC_URL
```

result:

```solidity
44675865329883571576693625683415420046190457818397713618602282954394360647435
```

우리는 1000000보다 작은 숫자 중에서 keccak256 hash한 결과가 위 결과와 같은 값이 나오는 uint값을 찾아야 한다.

example BruteFroce Code

```python
from web3 import Web3
from eth_abi import encode

# Web3 인스턴스 생성
w3 = Web3()

# 찾고자 하는 해시 값
target = 44675865329883571576693625683415420046190457818397713618602282954394360647435
# 0부터 1000000까지 모든 수에 대해 검사
for i in range(1000000):
    # 수를 abi.encode 하여 바이트 배열로 변환
    encoded = encode(['uint256'], [i])
    
    # keccak256 해시 계산
    hashed = w3.keccak(encoded).hex()
    # 목표 해시 값과 비교
    if int(hashed, 16) == target:
        print(f"일치하는 수: {i}")
        break
else:
    print("일치하는 수를 찾지 못했습니다.")

```

result:

```solidity
일치하는 수: 503804
```

이제 해당 값을 문제 컨트랙트의 파라미터로 넘기는 컨트랙트를 작성해보자.

아래와 같이 forge directory 생성

```solidity
forge mycontract
```

그러면 여러 디렉토리가 생기는데, 그 중 src 디렉토리 안에 정답 컨트랙트 코드를 작성해야 한다.

src/solve.sol :

```solidity
pragma solidity ^0.8.26;

interface IMyContract{
	function buyFlag(address,uint256) external;
}

contract Solve{
	function exploit(address _target, uint256 _answer) public{
		IMyContract target = IMyContract(_target);
		target.buyFlag(tx.origin, _answer);
	}
}
```

그러면 아래와 같이 해당 컨트랙트를 deploy할 수 있다.

```solidity
forge create Solve --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

result:

```solidity
No files changed, compilation skipped
Deployer: 0x4C5F15604c4B63EcBe4DFfA125879e0CC278711b
Deployed to: 0xFa4325735093C6c52B54046B905Cca58F1438d15
Transaction hash: 0x1946c29e64cf3061e31e38adf405da50b4692b55ec56355737f2643ef93dbcda
```

Deployed to가 우리가 Deploy한 Solve 컨트랙트의 주소이다. 

그러면 Solve 컨트랙트의 exploit함수를 실행시키자.

아래와 같이 트랜잭션을 보내 해결할 수 있다.

```solidity
cast send 0xFa4325735093C6c52B54046B905Cca58F1438d15 "exploit(address,uint256)" 0x24367e5995739E789b09bEfD1270B47799AB3C4F 503804 --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

Deploy된 Solve 컨트랙트 주소의 exploit함수를 호출하는데, 이 때, exploit의 첫번째 파라미터는 대상, 즉 챌린지 컨트랙트의 주소이고, 그 뒤 uint 256 _answer는 우리가 위에서 브루트포스로 찾은 값이다.

Flag:

```solidity
ethcon2024{Users who interact directly with the blockchain have much greater opportunities than those who only use dApps through the web.}
```