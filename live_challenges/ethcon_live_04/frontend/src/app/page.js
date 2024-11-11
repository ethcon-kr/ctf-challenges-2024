"use client"

import { scrollSepolia } from "@reown/appkit/networks"
import { L2Keeper, L2Messenger } from "@/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import { encodeFunctionData, formatEther, parseAbi, parseEther } from "viem"
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useEstimateGas,
  useGasPrice,
  useReadContract,
  useWriteContract,
} from "wagmi"
import Link from "next/link"

const SeploliaSvg = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiChip-icon MuiChip-iconMedium MuiChip-iconColorDefault css-1tgacyq-icon e1de0imv0"
    focusable="false"
    aria-hidden="true"
  >
    <g>
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#627EEA"
      ></path>
      <path
        d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z"
        fill="white"
        fillOpacity="0.602"
      ></path>
      <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white"></path>
      <path
        d="M12.3735 16.4759V20.9962L18 13.2119L12.3735 16.4759Z"
        fill="white"
        fillOpacity="0.602"
      ></path>
      <path
        d="M12.3735 20.9962V16.4752L6.75 13.2119L12.3735 20.9962Z"
        fill="white"
      ></path>
      <path
        d="M12.3735 15.4298L17.9963 12.1651L12.3735 9.65405V15.4298Z"
        fill="white"
        fillOpacity="0.2"
      ></path>
      <path
        d="M6.75 12.1651L12.3735 15.4298V9.65405L6.75 12.1651Z"
        fill="white"
        fillOpacity="0.602"
      ></path>
    </g>
  </svg>
)

const ScrollSvg = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiChip-icon MuiChip-iconMedium MuiChip-iconColorDefault css-1tgacyq-icon e1de0imv0"
    focusable="false"
    aria-hidden="true"
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="white"
    ></path>
    <path
      d="M18.1656 14.7728V6.16602C18.1541 5.44585 17.594 4.86621 16.891 4.86621H8.12354C6.23173 4.89549 4.71143 6.48218 4.71143 8.42603C4.71143 9.08179 4.88289 9.64387 5.1458 10.1357C5.3687 10.5455 5.71734 10.932 6.06027 11.2189C6.15743 11.3008 6.11171 11.2657 6.40891 11.4531C6.82042 11.7107 7.28909 11.8395 7.28909 11.8395L7.28337 16.986C7.2948 17.2319 7.31766 17.4661 7.38053 17.6827C7.57486 18.4088 8.06639 18.965 8.73509 19.2343C9.01515 19.3456 9.3295 19.4217 9.66671 19.4275L16.6681 19.4509C18.0627 19.4509 19.1943 18.2917 19.1943 16.8572C19.2001 16.0082 18.7885 15.2471 18.1656 14.7728Z"
      fill="#FFEEDA"
    ></path>
    <path
      d="M18.3371 16.9206C18.3085 17.8398 17.5712 18.5775 16.6682 18.5775L11.8501 18.5599C12.233 18.1033 12.4674 17.5119 12.4674 16.8679C12.4674 15.8549 11.8787 15.1582 11.8787 15.1582H16.6739C17.5941 15.1582 18.3428 15.9252 18.3428 16.8679L18.3371 16.9206Z"
      fill="#EBC28E"
    ></path>
    <path
      d="M6.51799 10.4958C5.96359 9.95711 5.57494 9.26037 5.57494 8.43482V8.347C5.62067 6.93595 6.75232 5.80009 8.12974 5.7591H16.8972C17.1258 5.77081 17.3087 5.93475 17.3087 6.1748V13.7746C17.5088 13.8097 17.6059 13.839 17.8003 13.9092C17.9546 13.9678 18.166 14.0907 18.166 14.0907V6.1748C18.1546 5.45464 17.5945 4.875 16.8915 4.875H8.12403C6.23222 4.90427 4.71191 6.49097 4.71191 8.43482C4.71191 9.56483 5.21487 10.5309 6.0379 11.2101C6.09505 11.2569 6.14649 11.3155 6.29509 11.3155C6.55228 11.3155 6.73518 11.1047 6.72375 10.8763C6.71803 10.6831 6.63802 10.6129 6.51799 10.4958Z"
      fill="#101010"
    ></path>
    <path
      d="M16.6699 14.2733H9.79426C9.33131 14.2791 8.95981 14.6597 8.95981 15.134V16.1469C8.97124 16.6153 9.35989 17.0134 9.82284 17.0134H10.3315V16.1469H9.82284V15.1574C9.82284 15.1574 9.94858 15.1574 10.1029 15.1574C10.9716 15.1574 11.6118 15.9829 11.6118 16.867C11.6118 17.6516 10.9145 18.6528 9.74854 18.5708C8.71404 18.5006 8.15393 17.5579 8.15393 16.867V8.28365C8.15393 7.89722 7.8453 7.58105 7.46808 7.58105H6.78223V8.4593H7.2909V16.8729C7.26232 18.5825 8.47971 19.4432 9.74854 19.4432L16.6756 19.4666C18.0702 19.4666 19.2019 18.3074 19.2019 16.8729C19.2019 15.4384 18.0645 14.2733 16.6699 14.2733ZM18.3388 16.9256C18.3103 17.8448 17.573 18.5825 16.6699 18.5825L11.8518 18.565C12.2348 18.1083 12.4691 17.5169 12.4691 16.8729C12.4691 15.86 11.8804 15.1632 11.8804 15.1632H16.6756C17.5958 15.1632 18.3446 15.9302 18.3446 16.8729L18.3388 16.9256Z"
      fill="#101010"
    ></path>
    <path
      d="M14.8182 8.61848H9.63428V7.74023H14.8182C15.0525 7.74023 15.2468 7.93345 15.2468 8.17936C15.2468 8.41941 15.0582 8.61848 14.8182 8.61848Z"
      fill="#101010"
    ></path>
    <path
      d="M14.8182 12.7503H9.63428V11.8721H14.8182C15.0525 11.8721 15.2468 12.0653 15.2468 12.3112C15.2468 12.5512 15.0582 12.7503 14.8182 12.7503Z"
      fill="#101010"
    ></path>
    <path
      d="M15.7326 10.68H9.63428V9.80176H15.7269C15.9613 9.80176 16.1556 9.99497 16.1556 10.2409C16.1613 10.4809 15.967 10.68 15.7326 10.68Z"
      fill="#101010"
    ></path>
  </svg>
)

const NetworkPanel = ({ name, image, direction }) => (
  <div className="relative flex bg-black px-4 py-2 rounded-lg items-center gap-2 justify-center">
    <p className="absolute top-1 left-2 opacity-40 font-normal text-xs">
      {direction}
    </p>
    <p className="font-semibold">{image}</p>
    <p className="font-semibold">{name}</p>
  </div>
)

export default function Home() {
  const [amount, setAmount] = useState("0")
  const { address } = useAccount()
  const { data: balance, balanceQueryKey } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_L1_EC_CONTRACT,
  })

  const { writeContractAsync } = useWriteContract({
    address: process.env.NEXT_PUBLIC_L1_EC_CONTRACT,
    abi: parseAbi(["function approve(address spender, uint256 amount)"]),
    functionName: "approve",
    args: [process.env.NEXT_PUBLIC_L1_BRIDGE_CONTRACT, parseEther(amount)],
  })

  const { data: allowance, allowanceQueryKery } = useReadContract({
    address: process.env.NEXT_PUBLIC_L1_EC_CONTRACT,
    abi: parseAbi([
      "function allowance(address owner, address spender) returns (uint256)",
    ]),
    functionName: "allowance",
    args: [address, process.env.NEXT_PUBLIC_L1_BRIDGE_CONTRACT],
    enabled: !!address,
  })

  const handleApprove = useCallback(() => {
    if (!address) return

    writeContractAsync({
      address: process.env.NEXT_PUBLIC_L1_EC_CONTRACT,
      abi: parseAbi(["function approve(address spender, uint256 amount)"]),
      functionName: "approve",
      args: [process.env.NEXT_PUBLIC_L1_BRIDGE_CONTRACT, parseEther(amount)],
    })
  }, [writeContractAsync, address, amount])

  // calculate L2 gas limit
  const message = address
    ? encodeFunctionData({
        abi: parseAbi([
          "function bridge(address to, address token, uint256 amount)",
        ]),
        functionName: "bridge",
        args: [
          address,
          process.env.NEXT_PUBLIC_L2_EC_CONTRACT,
          parseEther(amount),
        ],
      })
    : "0x"

  const { data: gasPrice } = useGasPrice({
    chainId: scrollSepolia.chainId,
  })

  const { data: gasLimit } = useEstimateGas({
    account: L2Keeper,
    to: L2Messenger,
    data: encodeFunctionData({
      abi: parseAbi([
        "function relayMessage(address _from,address _to,uint256 _value,uint256 _nonce,bytes _message)",
      ]),
      functionName: "relayMessage",
      args: [
        process.env.NEXT_PUBLIC_L1_BRIDGE_CONTRACT,
        process.env.NEXT_PUBLIC_L2_RECEIVER_CONTRACT,
        0,
        0,
        message,
      ],
    }),
    chainId: scrollSepolia.id,
    query: { enabled: !!gasPrice && !!amount && !!address },
  })

  const handleBridge = useCallback(() => {
    writeContractAsync({
      address: process.env.NEXT_PUBLIC_L1_BRIDGE_CONTRACT,
      abi: parseAbi([
        "function bridge(address token, uint256 amount, uint256 gasLimit)",
      ]),
      functionName: "bridge",
      value: ((gasLimit * 120n) / 100n) * gasPrice,
      args: [
        process.env.NEXT_PUBLIC_L1_EC_CONTRACT,
        parseEther(amount),
        (gasLimit * 120n) / 100n,
      ],
    })
  }, [writeContractAsync, amount, gasLimit, gasPrice])

  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: balanceQueryKey })
    queryClient.invalidateQueries({ queryKey: allowanceQueryKery })
  }, [blockNumber, queryClient, balanceQueryKey, allowanceQueryKery])

  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-4">
      <header className="font-serif text-5xl">EC One-Way Bridge ⚡️</header>

      <div className="flex flex-col text-center max-w-md">
        <p>
          The challenge can be solved by obtaining 100 million BTC tokens from
          L2 by exploiting the Bridge vulnerability.
        </p>
        <div className="mt-4 flex flex-row gap-4 items-center justify-center text-center font-bold text-cyan-400 underline">
          <Link
            href={`https://sepolia.scrollscan.com/address/${process.env.NEXT_PUBLIC_L2_BTC_CONTRACT}`}
          >
            BTC Contract
          </Link>
          <Link href="/faucet">
            <p>EC Token Faucet</p>
          </Link>
        </div>
      </div>

      <div className="flex flex-col bg-[#18181B] bg-opacity-70 rounded-lg py-2 px-4 gap-2">
        <NetworkPanel name="Sepolia" image={<SeploliaSvg />} direction="From" />
        <NetworkPanel
          name="Scroll Sepolia"
          direction="To"
          image={<ScrollSvg />}
        />

        <div className="flex items-center justify-between">
          <div className="relative items-stretch w-3/4">
            <div className="absolute flex flex-col top-1 right-2 opacity-40 font-normal text-xs">
              <p>Balance</p>
              <p>{formatEther(balance?.value ?? 0n)}</p>
            </div>
            <input
              className="rounded-md bg-gray-700 px-4 py-2 text-center text-serif text-lg font-semibold w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p
            className="w-1/4 text-cyan-400 underline cursor-pointer"
            onClick={() => setAmount(formatEther(balance?.value ?? 0n))}
          >
            MAX
          </p>
        </div>

        <button
          className="hover:bg-green-800 focus:ring-4 focus:ring-green-300 bg-green-700 rounded-lg text-sm h-10"
          onClick={
            Number(formatEther(allowance ?? 0n)) >= Number(amount)
              ? handleBridge
              : handleApprove
          }
        >
          {Number(formatEther(allowance ?? 0n)) >= Number(amount)
            ? "Bridge"
            : "Approve"}
        </button>
      </div>
    </div>
  )
}
