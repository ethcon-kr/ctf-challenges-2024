"use client"

import { useState, useCallback } from "react"
import { useWriteContract, useAccount } from "wagmi"
import { parseAbi, parseEther } from "viem"

export default function Faucet() {
  const [amount, setAmount] = useState(0)
  const { writeContractAsync } = useWriteContract()
  const { address, isConnected } = useAccount()

  const handleMint = useCallback(() => {
    if (!isConnected || !address) return

    writeContractAsync({
      address: process.env.NEXT_PUBLIC_L1_EC_CONTRACT,
      abi: parseAbi(["function mint(address to, uint256 amount)"]),
      functionName: "mint",
      args: [address, parseEther(amount)],
    })
  }, [writeContractAsync, address, amount, isConnected])

  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-4">
      <header className="font-serif text-5xl">EC Token Faucet</header>

      <div className="flex bg-[#18181B] bg-opacity-70 rounded-lg py-2 px-4 gap-2">
        <input
          className="rounded-md bg-gray-700 px-4 py-2 text-center text-serif text-lg font-semibold w-4/5"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleMint}
          className={`hover:bg-green-800 focus:ring-4 focus:ring-green-300 bg-green-700 rounded-lg text-sm h-10 w-1/5 ${
            !isConnected && "opacity-50 cursor-not-allowed"
          }`}
        >
          Mint
        </button>
      </div>
    </div>
  )
}
