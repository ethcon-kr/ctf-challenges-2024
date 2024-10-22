# Intermediate: 6. mnemonic



J의 mnemonic 단어 두 개가 지워졌다!!!

mnemonic:

```
abandon elephant witness [removed word1]
tool goose ostrich shrimp [removed word2]
lobster train address
```

address:

```
0x610ee4fF7157d2aaa2447B664eda52270b57249D
```

mnemonic의 두 단어를 brute force하여 해당 지갑주소를 만족하는 개인키를 찾고 flag로 제출하면된다. 

brute force code:

```python
import itertools
from eth_account import Account
from mnemonic import Mnemonic

# BIP39 HD Wallet 기능 활성화
Account.enable_unaudited_hdwallet_features()

# BIP39 단어 목록 가져오기
mnemo = Mnemonic("english")
wordlist = mnemo.wordlist

# 주어진 mnemonic (제거된 두 단어 포함)
mnemonic_template = ["abandon", "elephant", "witness", None, "tool", "goose", "ostrich", "shrimp", None, "lobster", "train", "address"]

# 지갑 주소
target_address = "0x610ee4fF7157d2aaa2447B664eda52270b57249D".lower()

# None을 채울 모든 경우의 수 생성
empty_indices = [i for i, word in enumerate(mnemonic_template) if word is None]
possible_combinations = itertools.product(wordlist, repeat=len(empty_indices))

# BIP44 이더리움 경로
bip44_path = "m/44'/60'/0'/0/0"
# Brute-force로 단어 조합 테스트
for combination in possible_combinations:
    # 빈 자리에 단어 삽입
    mnemonic = mnemonic_template[:]
    for i, word in zip(empty_indices, combination):
        mnemonic[i] = word
    
    # mnemonic 문자열로 변환
    mnemonic_str = " ".join(mnemonic)
    
    # mnemonic이 유효한지 확인
    if mnemo.check(mnemonic_str):
        # 유효한 mnemonic이면 계정 생성 시도
        acct = Account.from_mnemonic(mnemonic_str, account_path=bip44_path)
        if acct.address.lower() == target_address:
            print(f"찾은 mnemonic: {mnemonic_str}")
            print(f"지워진 단어: {combination}")
            print(f"개인키: {acct.key.hex()}")
            break

```

result:

```solidity
찾은 mnemonic: abandon elephant witness skull tool goose ostrich shrimp empty lobster train address
지워진 단어: ('skull', 'empty')
개인키: 0x0153538917560a89125ba4f3241129c6b464365660c1b910909cd74b5bb6a394
```

Flag:

```solidity
ethcon2024{0x0153538917560a89125ba4f3241129c6b464365660c1b910909cd74b5bb6a394}
```