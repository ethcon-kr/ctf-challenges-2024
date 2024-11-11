import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  encodeAbiParameters,
  getContract,
  parseAbi,
} from "viem"
import { scrollSepolia } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"

const abi = parseAbi([
  "function play(bool)",
  "function rounds(address) returns (uint256)",
  "function results(address,uint256) returns (bool)",
  "function wins(address) returns (uint256)",
  "function jackpotWinner() returns (address)",
])

const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
})

const account = privateKeyToAccount("")

const walletClient = createWalletClient({
  chain: scrollSepolia,
  transport: http(),
  account,
})

const contract = getContract({
  address: "0x07Bf719A0ea9f3C358DaA508e96A2c34140fD199",
  abi: abi,
  client: { public: publicClient, wallet: walletClient },
})

let lastBlockNumber = 0
publicClient.watchBlockNumber({
  onBlockNumber: async (blockNumber) => {
    const hash = keccak256(
      encodeAbiParameters(
        [
          {
            name: "blockNumber",
            type: "uint",
          },
          {
            name: "address",
            type: "address",
          },
        ],
        [Number(blockNumber) + 1, walletClient.account.address]
      )
    )

    if (lastBlockNumber == Number(blockNumber)) return

    lastBlockNumber = Number(blockNumber)

    contract.write
      .play({
        functionName: "play",
        args: [Number(BigInt(hash) % 2n) == 0 ? true : false],
      })
      .then((tx) => {
        console.log(
          `blockNumber: ${Number(blockNumber) + 1}, tx: ${tx}, isEven: ${
            Number(BigInt(hash) % 2n) == 0 ? true : false
          }`
        )
      })
  },
  pollingInterval: 200,
})
