# Beginner: 3. Hidden Flag Shop



**Mission**

It's the same mission as before. However, this time the password is hidden! - [contract](https://sepolia.scrollscan.com/address/0xC41C9C4C94D6605a67a0C39cdadD51BD19200a52)

```solidity
pragma solidity =0.8.27;

contract HiddenFlagShop {
    uint256 private password;
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

출제의도: 컨트랙트에서 private 변수의 값 읽기

풀이:

Flag Shop 문제와 비슷해보이지만, password 변수가 private이다. private변수는 getter를 제공하지 않는다. 다만, private변수는 실제 변수값을 완전히 못읽는 것이 아닌, 스토리지에 남아있어 읽을 수 있다.

password의 스토리지 위치는 0번 index인 slot에 위치할 것이다. 0번 스토리지를 읽어보자.

command :

```solidity
cast storage 0xC41C9C4C94D6605a67a0C39cdadD51BD19200a52 0 --rpc-url $SCROLL_RPC_URL
```

password :

```solidity
0xa65f8d6956ec640f253223aeb4cefaed2d6ba6aef5dea71cab8cf948a03fe4a7
```

이제 flag shop문제와 같이 buyFlag를 성공적으로 호출하면 문제를 해결할 수 있다.

command :

```solidity
cast send 0xC41C9C4C94D6605a67a0C39cdadD51BD19200a52 "buyFlag(uint256)" 0xa65f8d6956ec640f253223aeb4cefaed2d6ba6aef5dea71cab8cf948a03fe4a7  --value 0.000001ether --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY

```

Flag :

```solidity
ethcon2024{In Solidity, private means access-restricted, not hidden; all data is visible on the blockchain.}
```