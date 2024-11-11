"use client"

import Link from "next/link"
import { useState } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { parseAbi } from "viem"
import TransactionSuccessToast from "@/components/TransactionSuccessToast"
import TransactionRejectToast from "@/components/TransactionRejectToast"

export default function Home() {
  const [tx, setTx] = useState(undefined)
  const [success, setSuccess] = useState(false)
  const [reject, setReject] = useState(false)

  const { address } = useAccount()
  const { data: isClaimed } = useReadContract({
    address: process.env.NEXT_PUBLIC_AIRDROP_CONTRACT,
    abi: parseAbi(["function claimed(address) view returns (bool)"]),
    functionName: "claimed",
    args: [address],
  })
  const { writeContractAsync } = useWriteContract()

  const handleClaim = async () => {
    if (isClaimed) return

    writeContractAsync({
      address: process.env.NEXT_PUBLIC_AIRDROP_CONTRACT,
      abi: parseAbi(["function claim() external"]),
      functionName: "claim",
    })
      .then((tx) => {
        setTx(tx)
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      })
      .catch((error) => {
        setReject(true)
        setTimeout(() => {
          setReject(false)
        }, 3000)

        console.error(error)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <header className="font-serif text-5xl">Claim Your EC Tokens</header>

      <div className="flex flex-col justify-center items-stretch bg-opacity-70 rounded-lg py-2 px-4 gap-6">
        <button
          type="button"
          onClick={handleClaim}
          className={`focus:outline-none text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isClaimed ? "disabled cursor-not-allowed" : ""
          }`}
        >
          {isClaimed ? "AREADY CLAIMED" : "CLAIM"}
        </button>

        <div className="flex flex-col text-center">
          <p>Stake your EC tokens and earn points !</p>
          <p>You can solve the challenge by earning more than 3,000 points.</p>
          <Link href="/stake" className="mt-5">
            <p className="text-center font-bold">🔗 GO TO STAKING</p>
          </Link>
        </div>
      </div>

      {success && <TransactionSuccessToast tx={tx} />}
      {reject && <TransactionRejectToast />}
    </div>
  )
}
