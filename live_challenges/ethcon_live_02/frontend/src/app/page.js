"use client"

import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { parseAbi, formatEther } from "viem"
import { useReadContract, useBlockNumber } from "wagmi"
import { useEffect } from "react"

const Address = ({ address }) => {
  return (
    <Link
      className="w-1/4"
      href={`https://sepolia.scrollscan.com/address/${address}`}
    >
      <p>
        {address.slice(0, 6)}...{address.slice(-4)}
      </p>
    </Link>
  )
}

export default function Home() {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient])

  const { data: histories, queryKey } = useReadContract({
    address: process.env.NEXT_PUBLIC_VAULT_CONTRACT,
    abi: parseAbi([
      "function getHistory(uint256 start, uint256 end) external view returns ((bool, address, address, uint256, uint256)[])",
    ]),
    functionName: "getHistory",
    args: [0, 20],
  })

  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-4">
      <header className="font-serif text-5xl">EC Vault Transactions</header>

      <p>
        You can solve the challenge by stealing the tokens deposited in the
        Vault.
      </p>
      <div className="flex flex-row gap-4 items-center justify-center">
        <p>Contract:</p>
        <Link
          href={`https://sepolia.scrollscan.com/address/${process.env.NEXT_PUBLIC_VAULT_CONTRACT}`}
        >
          {process.env.NEXT_PUBLIC_VAULT_CONTRACT}
        </Link>
      </div>

      <div className="flex flex-col items-stretch bg-[#18181B] bg-opacity-70 rounded-lg py-2 px-4 gap-2 min-w-[800px]">
        <div className="flex flex-row bg-black px-4 py-2 rounded-lg font-semibold">
          <p className="text-gray-500 w-1/4">Action</p>
          <p className="text-gray-500 w-1/4">Account</p>
          <p className="text-gray-500 w-1/4">Token</p>
          <p className="text-gray-500 w-1/4">Amount</p>
        </div>

        {histories?.map((history, index) => (
          <div key={index} className="flex flex-row px-4 py-2 rounded-lg">
            <p
              className={`w-1/4 font-semibold ${
                history[0] === true ? "text-green-800" : "text-purple-800"
              }`}
            >
              {history[0] === true ? "Deposit" : "Withdraw"}
            </p>
            <Address address={history[1]} />
            <Address address={history[2]} />
            <p className="w-1/4">
              {Number(formatEther(history[3])).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
