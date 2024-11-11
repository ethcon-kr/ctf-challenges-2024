"use client"

import { useRef } from "react"
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useReadContracts,
} from "wagmi"
import {
  keccak256,
  parseEther,
  parseAbi,
  encodeAbiParameters,
  formatEther,
} from "viem"

export default function Home() {
  const inputRefs = useRef([])
  const amountRef = useRef()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const { data: lockIndex } = useReadContract({
    address: process.env.NEXT_PUBLIC_LOCKER_CONTRACT,
    abi: parseAbi(["function currentLockId() external view returns (uint256)"]),
    functionName: "currentLockId",
  })

  const { data: amountList } = useReadContracts({
    contracts: new Array(lockIndex).fill(0).map((idx) => ({
      address: process.env.NEXT_PUBLIC_LOCKER_CONTRACT,
      abi: parseAbi([
        "function lockedOf(uint256) external view returns (uint256)",
      ]),
      functionName: "lockedOf",
      args: [idx],
    })),
    query: {
      select: (data) => data.map((x) => x.result),
      enabled: lockIndex > 0,
    },
  })

  const { data: passwdList } = useReadContracts({
    contracts: new Array(lockIndex).fill(0).map((idx) => ({
      address: process.env.NEXT_PUBLIC_LOCKER_CONTRACT,
      abi: parseAbi([
        "function passwdOf(uint256) external view returns (bytes32)",
      ]),
      functionName: "passwdOf",
      args: [idx],
    })),
    query: {
      select: (data) => data.map((x) => x.result),
      enabled: lockIndex > 0,
    },
  })

  const handleInputChange = (index, e) => {
    let currentIndex = index
    while (currentIndex < inputRefs.current.length - 1) {
      if (inputRefs.current[currentIndex].value?.length === 1) {
        inputRefs.current[currentIndex + 1].focus()
        currentIndex++
      } else {
        break
      }
    }
  }

  const createLock = () => {
    if (!address) {
      alert("Please connect your wallet first")
      return
    }

    if (inputRefs.current.some((x) => !x?.value)) {
      alert("Please fill all inputs")
      return
    }

    if (Number(amountRef.current?.value) <= 0) {
      alert("Please enter amount")
      return
    }

    console.log(`wallet address: ${address}`)

    const passphrase = `${address}:${inputRefs.current
      .map((x) => x?.value)
      .join("")}`
    console.log(`passphrase: ${passphrase}`)

    const passwd = keccak256(
      encodeAbiParameters([{ name: "passwd", type: "string" }], [passphrase])
    )
    console.log(`passwd: ${passwd}`)
    writeContractAsync({
      address: process.env.NEXT_PUBLIC_LOCKER_CONTRACT,
      abi: parseAbi(["function lock(uint256,bytes32) external"]),
      args: [parseEther(amountRef.current?.value), passwd],
      functionName: "lock",
    })
  }

  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center justify-center gap-4">
      <header className="font-serif text-5xl">EC Locker 🔒</header>

      <p>
        Can you steal the token of a Lock created by someone else? If so, you
        could be the winner of this challenge.
      </p>

      <div className="flex flex-col min-w-64 gap-4">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            className="rounded-lg p-2 w-full text-center text-black"
            ref={amountRef}
          />
          <div className="absolute inset-y-0 right-0 flex items-center font-bold text-gray-400 pr-7">
            <p>EC</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <input
            ref={(el) => (inputRefs.current[0] = el)}
            onChange={(e) => handleInputChange(0, e)}
            maxLength="1"
            className="rounded-lg p-2 w-12 text-center text-black"
          />
          <input
            ref={(el) => (inputRefs.current[1] = el)}
            onChange={(e) => handleInputChange(1, e)}
            maxLength="1"
            className="rounded-lg p-2 w-12 text-center text-black"
          />
          <input
            ref={(el) => (inputRefs.current[2] = el)}
            onChange={(e) => handleInputChange(2, e)}
            maxLength="1"
            className="rounded-lg p-2 w-12 text-center text-black"
          />
          <input
            ref={(el) => (inputRefs.current[3] = el)}
            onChange={(e) => handleInputChange(3, e)}
            maxLength="1"
            className="rounded-lg p-2 w-12 text-center text-black"
          />
          <input
            ref={(el) => (inputRefs.current[4] = el)}
            onChange={(e) => handleInputChange(4, e)}
            maxLength="1"
            className="rounded-lg p-2 w-12 text-center text-black"
          />
        </div>

        <button
          onClick={createLock}
          className="bg-green-600 hover:bg-green-700 rounded-lg py-2"
        >
          Create LOCK
        </button>
      </div>

      <div className="flex flex-col items-stretch bg-[#18181B] bg-opacity-70 rounded-lg py-2 px-4 gap-2 min-w-[800px]">
        <div className="flex flex-row bg-black px-4 py-2 rounded-lg font-semibold">
          <p className="text-gray-500 w-1/3">LockId</p>
          <p className="text-gray-500 w-1/3">Amount</p>
          <p className="text-gray-500 w-1/3">Passwd</p>
        </div>

        {passwdList?.map((passwd, index) => (
          <div key={index} className="flex flex-row px-4 py-2 rounded-lg">
            <p className="w-1/3">{Number(index) + 1}</p>
            <p className="w-1/3">{formatEther(amountList?.[index] ?? 0n)}</p>
            <p className="w-1/3">{`${passwd.slice(0, 6)}...${passwd.slice(
              -4
            )}`}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
