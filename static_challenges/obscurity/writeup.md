# Beginner: 7. Security by obscurity



**Mission**

Is "security by obscurity" really a safe method for protecting smart contracts? - [contract](https://sepolia.scrollscan.com/address/0x4522614BF47123BD731e4249f659A102308ab590)

```solidity
pragma solidity =0.8.27;

contract Obscurity {
    mapping(address user => bool hasFlag) public flag;

    function buyFlag(bytes calldata password) external payable {
        require(..., "Invalid Password");
        flag[msg.sender] = true;
    }
}
```

출제의도: 컨트랙트의 바이트코드를 디컴파일해서 분석하기

풀이:

deploy된 컨트랙트의 바이트코드를 디컴파일해서 문제를 해결해야 한다. 

https://sepolia.scrollscan.com/address/0x4522614BF47123BD731e4249f659A102308ab590#code

여기서 컨트랙트의 바이트코드를 확인할 수 있다.

이 바이트코드를 디컴파일하는 툴로 dedaub을 사용하자.

https://app.dedaub.com/decompile

dedaub에 해당 바이트 코드를 넣어보자.

아래는 buyFlag함수의 deploy한 결과이다.

```solidity
function 0x31644d1b(uint256 varg0) public payable { 
    require(msg.data.length - 4 >= 32);
    require(varg0 <= uint64.max);
    require(msg.data.length > 4 + varg0 + 31);
    require(varg0.length <= uint64.max);
    require(4 + varg0 + varg0.length + 32 <= msg.data.length);
    v0 = uint8(msg.sender);
    require(varg0.length == 30, Error('Invalid Password'));
    require(0 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[varg0.data] >> 248 ^ v0) == 84, Error('Invalid Password'));
    require(1 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[1 + varg0.data] >> 248 ^ v0) == 82, Error('Invalid Password'));
    require(2 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[2 + varg0.data] >> 248 ^ v0) == 65, Error('Invalid Password'));
    require(3 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[3 + varg0.data] >> 248 ^ v0) == 78, Error('Invalid Password'));
    require(4 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[4 + varg0.data] >> 248 ^ v0) == 83, Error('Invalid Password'));
    require(5 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[5 + varg0.data] >> 248 ^ v0) == 80, Error('Invalid Password'));
    require(6 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[6 + varg0.data] >> 248 ^ v0) == 65, Error('Invalid Password'));
    require(7 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[7 + varg0.data] >> 248 ^ v0) == 82, Error('Invalid Password'));
    require(8 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[8 + varg0.data] >> 248 ^ v0) == 69, Error('Invalid Password'));
    require(9 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[9 + varg0.data] >> 248 ^ v0) == 78, Error('Invalid Password'));
    require(10 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[10 + varg0.data] >> 248 ^ v0) == 67, Error('Invalid Password'));
    require(11 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[11 + varg0.data] >> 248 ^ v0) == 89, Error('Invalid Password'));
    require(12 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[12 + varg0.data] >> 248 ^ v0) == 95, Error('Invalid Password'));
    require(13 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[13 + varg0.data] >> 248 ^ v0) == 80, Error('Invalid Password'));
    require(14 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[14 + varg0.data] >> 248 ^ v0) == 82, Error('Invalid Password'));
    require(15 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[15 + varg0.data] >> 248 ^ v0) == 69, Error('Invalid Password'));
    require(16 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[16 + varg0.data] >> 248 ^ v0) == 86, Error('Invalid Password'));
    require(17 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[17 + varg0.data] >> 248 ^ v0) == 69, Error('Invalid Password'));
    require(18 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[18 + varg0.data] >> 248 ^ v0) == 78, Error('Invalid Password'));
    require(19 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[19 + varg0.data] >> 248 ^ v0) == 84, Error('Invalid Password'));
    require(20 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[20 + varg0.data] >> 248 ^ v0) == 83, Error('Invalid Password'));
    require(21 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[21 + varg0.data] >> 248 ^ v0) == 95, Error('Invalid Password'));
    require(22 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[22 + varg0.data] >> 248 ^ v0) == 69, Error('Invalid Password'));
    require(23 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[23 + varg0.data] >> 248 ^ v0) == 88, Error('Invalid Password'));
    require(24 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[24 + varg0.data] >> 248 ^ v0) == 80, Error('Invalid Password'));
    require(25 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[25 + varg0.data] >> 248 ^ v0) == 76, Error('Invalid Password'));
    require(26 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[26 + varg0.data] >> 248 ^ v0) == 79, Error('Invalid Password'));
    require(27 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[27 + varg0.data] >> 248 ^ v0) == 73, Error('Invalid Password'));
    require(28 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[28 + varg0.data] >> 248 ^ v0) == 84, Error('Invalid Password'));
    require(29 < varg0.length, Panic(50)); // access an out-of-bounds or negative index of bytesN array or slice
    require(uint8(msg.data[29 + varg0.data] >> 248 ^ v0) == 83, Error('Invalid Password'));
    _flag[msg.sender] = 1;
}
```

0x31644d1b가 buyFlag의 시그니처인 것은 아래와 같이 간단하게 확인할 수 있다.

```solidity
cast calldata "buyFlag(bytes)" 0x01
```

result:

```solidity
0x31644d1b000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000000000000000000000000
```

buyFlag는 결국, msg.sender에서 하위 1바이트를 추출해 해당 값을 parameter, 즉 password를 비트 시프트 한 1바이트 값과 xor한 후, 특정 1바이트 값과 같은지 하나씩 비교한다. 

A xor B = C일 때,

A xor C = B를 통해, 우리는 password를 구할 수 있다.

아래는 password를 구하기 위한 테스트 코드이다. 해당 코드를 리믹스에서 간단하게 실행해보자.

```solidity
contract Test{
    function getPassword() public returns(uint256){

        uint8 v0 = uint8(uint160(address(0x4C5F15604c4B63EcBe4DFfA125879e0CC278711b))); // YOUR_WALLET_ADDRESS
        uint8[30] memory data = [ 0x54, 0x52, 0x41, 0x4E, 0x53, 0x50, 0x41, 0x52, 0x45, 0x4E,
                        0x43, 0x59, 0x5F, 0x50, 0x52, 0x45, 0x56, 0x45, 0x4E, 0x54,
                        0x53, 0x5F, 0x45, 0x58, 0x50, 0x4C, 0x4F, 0x49, 0x54, 0x53
                    ];
        uint256 answer;

        for(uint256 i; i<data.length; i++){
            answer += uint256((v0 ^ data[i])) << ((29 - i) * 8); 
        }

        return answer;
    }
}
```

result:

```solidity
	"0": "uint256: 547215550692551084772472973522597254917169370397322181010320083656003400"
```

해당 값의 hex값은 아래와 같다.

```solidity
0x4f495a55484b5a495e555842444b495e4d5e554f48445e434b5754524f48
```

우리는 password로 위의 값을 buyFlag의 파라미터로 넘김으로써 문제를 해결할 수 있다.

command:

```solidity
cast send 0x4522614BF47123BD731e4249f659A102308ab590 "buyFlag(bytes)" 0x4f495a55484b5a495e555842444b495e4d5e554f48445e434b5754524f48 --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

Flag:

```solidity
ethcon2024{To enhance the security of smart contracts, it is recommended to use a "Security by Design" approach rather than "Security by Obscurity."}
```