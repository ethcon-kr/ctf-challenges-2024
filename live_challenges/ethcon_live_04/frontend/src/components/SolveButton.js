"use client"

import { useWriteContract } from "wagmi"
import { parseAbi } from "viem"

export default function SolveButton() {
  const { writeContractAsync } = useWriteContract()

  const handleSolve = async () => {
    await writeContractAsync({
      address: process.env.NEXT_PUBLIC_SOLVER_CONTRACT,
      abi: parseAbi(["function solve() external"]),
      functionName: "solve",
    })
  }

  return (
    <button
      className="rounded-full bg-green-500 h-full px-4 py-2"
      onClick={handleSolve}
    >
      Solve
    </button>
  )
}
