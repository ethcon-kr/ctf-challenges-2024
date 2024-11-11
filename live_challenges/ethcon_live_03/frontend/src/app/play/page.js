"use client"

import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { parseAbi } from "viem"
import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useWriteContract,
  useEstimateGas,
} from "wagmi"
import { encodeFunctionData } from "viem"

const abi = parseAbi([
  "function play(bool)",
  "function rounds(address) returns (uint256)",
  "function results(address,uint256) returns (bool)",
  "function wins(address) returns (uint256)",
  "function jackpotWinner() returns (address)",
])

export default function Home() {
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [isDraw, setIsDraw] = useState(false)
  const [betRound, setBetRound] = useState(undefined)
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({
    watch: true,
  })

  const { data: rounds, queryKey: roundsQueryKey } = useReadContract({
    address: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
    abi,
    functionName: "rounds",
    args: [address],
    query: {
      enabled: !!address,
    },
  })

  const { data: lastGameResult, queryKey: lastGameResultQueryKey } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
      abi,
      functionName: "results",
      args: [address, Number(rounds) - 1],
      query: {
        enabled: !!address && rounds !== undefined,
      },
    })

  const { data: wins, queryKey: winsQueryKey } = useReadContract({
    address: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
    abi,
    functionName: "wins",
    args: [address],
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    queryClient.invalidateQueries(winsQueryKey)
    queryClient.invalidateQueries(roundsQueryKey)
    queryClient.invalidateQueries(lastGameResultQueryKey)
  }, [blockNumber])

  useEffect(() => {
    if (betRound && betRound !== rounds) {
      setIsLoading(false)
      setIsDraw(false)
    }
  }, [betRound, rounds])

  const { data: jackpotWinner } = useReadContract({
    address: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
    abi,
    functionName: "jackpotWinner",
  })

  const { data: gasLimit } = useEstimateGas({
    account: address,
    to: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
    data: encodeFunctionData({
      abi,
      functionName: "play",
      args: [true],
    }),
    query: { enabled: address !== undefined },
  })

  const play = useCallback(
    async (isEven) => {
      setBetRound(rounds)
      setIsLoading(true)
      writeContractAsync({
        address: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
        abi,
        functionName: "play",
        args: [isEven],
        gasLimit,
      }).then(() => setIsDraw(true))
    },
    [writeContractAsync, rounds, gasLimit]
  )

  if (rounds === undefined || wins === undefined || !address)
    return (
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-serif">
        Loading...
      </p>
    )

  if (
    jackpotWinner &&
    jackpotWinner !== "0x0000000000000000000000000000000000000000"
  ) {
    return (
      <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-4 items-stretch justify-center">
        <header className="font-serif text-5xl">
          Winner is {jackpotWinner}
        </header>
      </div>
    )
  }

  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-4 items-stretch justify-center">
      <div className="mb-8">
        <header className="font-serif text-5xl">💸 JACKPOT 💸</header>
        <p className="text-4xl font-bold font-serif">100,000,000 EC</p>
      </div>

      <div className="flex gap-4 items-center justify-center font-bold text-gray-400">
        <p>BlockNumber {Number(blockNumber)}</p>
        <p>Round {Number(rounds) + 1}</p>
      </div>

      <div className="relative rounded-full overflow-hidden w-full h-96">
        <Image
          src={
            isLoading
              ? "/evenodd.webp"
              : lastGameResult
              ? "/even.webp"
              : "/odd.webp"
          }
          alt="EvenOdd"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <p className="font-bold text-cyan-600">{Number(wins)} wins</p>

      {isDraw ? (
        <p className="font-bold font-serif">
          Round {Number(rounds) + 1} draw in progress...
        </p>
      ) : (
        <div className="flex gap-4 items-center justify-center">
          <button
            className="bg-green-500 w-1/2 text-white px-4 py-2 rounded-md"
            onClick={() => play(true)}
          >
            EVEN
          </button>
          <button
            className="bg-red-500 w-1/2 text-white px-4 py-2 rounded-md"
            onClick={() => play(false)}
          >
            ODD
          </button>
        </div>
      )}
    </div>
  )
}
