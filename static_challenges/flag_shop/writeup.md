# Beginner: 2. Flag Shop



**Mission**

mission this time is to purchase a flag from a [contract](https://sepolia.scrollscan.com/address/0x6Ab22DC84952C0AeA6a4084e39CbFf7c694De7ce)!

```solidity
pragma solidity =0.8.27;

contract FlagShop {
    uint256 public password;
    mapping(address user => bool hasFlag) public flag;

    error IncorrectPassword();
    error InsufficientFunds();

    constructor() {
        password = uint256(blockhash(block.number - 1));
    }

    function buyFlag(uint256 password_) external payable {
        require(password == password_, IncorrectPassword());
        require(msg.value == 0.000001 ether, InsufficientFunds());
        password = uint256(blockhash(block.number - 1));
        flag[msg.sender] = true;
    }
}
```

출제의도 : 컨트랙트에서 public 변수의 값을 읽기.

풀이 : FlagShop 컨트랙트에서 buyFlag를 성공적으로 호출해 flag 자료형에서 자신의 주소에 대한 값을 true로 만들어야 한다.

password는 public변수로 uint256자료형이다. 솔리디티에서, public변수는 기본적으로 getter함수를 변수와 똑같은 이름으로 제공한다. 아래처럼 함수를 password변수의 값을 password의 getter를 호출해 확인할 수 있다.

command :

```solidity
cast call 0x6Ab22DC84952C0AeA6a4084e39CbFf7c694De7ce "password()(uint256)" --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY

```

password :

```solidity
27908481033668220964748447181900683822635308741068329424194190351171782477663
```

이제 이 값을 buyFlag함수의 파라미터로 전달해야 한다.

이 때, 또 하나의 조건은 msg.value가 0.1 ether여야 한다. 트랜잭션을 보낼 때, 이더를 같이 보내야 해당 문제를 해결할 수 있다.

command :

```solidity
cast send 0x6Ab22DC84952C0AeA6a4084e39CbFf7c694De7ce "buyFlag(uint256)" 27908481033668220964748447181900683822635308741068329424194190351171782477663  --value 0.000001ether --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

위 명령어로 트랜잭션을 보내면 문제를 해결할 수 있다.

Flag:

```solidity
ethcon2024{Bitcoin is a technological tour de force.}
```