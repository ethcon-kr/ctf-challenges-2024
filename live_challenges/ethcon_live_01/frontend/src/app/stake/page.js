"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { parseAbi, parseEther, formatEther } from "viem"
import TransactionSuccessToast from "@/components/TransactionSuccessToast"
import TransactionRejectToast from "@/components/TransactionRejectToast"

const Unstake = () => {
  const { address } = useAccount()

  const [tx, setTx] = useState(undefined)
  const { writeContractAsync } = useWriteContract()
  const [success, setSuccess] = useState(false)
  const [reject, setReject] = useState(false)

  const handleWithdraw = async () => {
    writeContractAsync({
      address: process.env.NEXT_PUBLIC_STAKER_CONTRACT,
      abi: parseAbi(["function withdraw()"]),
      functionName: "withdraw",
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

  const { data } = useReadContract({
    abi: parseAbi(["function rewardOf(address) view returns (uint256)"]),
    address: process.env.NEXT_PUBLIC_STAKER_CONTRACT,
    functionName: "rewardOf",
    args: [address],
  })

  const { data: withdrawAt } = useReadContract({
    abi: parseAbi(["function withdrawAt(address) view returns (uint256)"]),
    address: process.env.NEXT_PUBLIC_STAKER_CONTRACT,
    functionName: "withdrawAt",
    args: [address],
  })

  console.log()

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-center items-center h-full">
        <p className="text-center text-2xl mb-4">
          {formatEther(data ?? 0n)} POINT
        </p>
      </div>

      <button
        type="button"
        className={`focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
          Number(withdrawAt) < Date.now() / 1000
            ? ""
            : "disabled cursor-not-allowed"
        }`}
        onClick={handleWithdraw}
      >
        {Number(withdrawAt) < Date.now() / 1000
          ? "WITHDRAW"
          : `Withdrawable at ${new Date(
              Number(withdrawAt) * 1000
            ).toLocaleString()}`}
      </button>

      {success && <TransactionSuccessToast tx={tx} />}
      {reject && <TransactionRejectToast />}
    </div>
  )
}

const Stake = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState("")
  const [days, setDays] = useState("")
  const [amountError, setAmountError] = useState(false)
  const [daysError, setDaysError] = useState(false)

  const [tx, setTx] = useState(undefined)
  const { writeContractAsync } = useWriteContract()
  const [success, setSuccess] = useState(false)
  const [reject, setReject] = useState(false)

  const handleStake = async () => {
    if (amountError || daysError) return

    writeContractAsync({
      address: process.env.NEXT_PUBLIC_STAKER_CONTRACT,
      abi: parseAbi(["function stake(uint256, uint256)"]),
      functionName: "stake",
      args: [parseEther(amount), Number(days)],
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

  const { data } = useReadContract({
    abi: parseAbi(["function balanceOf(address) view returns (uint256)"]),
    address: process.env.NEXT_PUBLIC_EC_CONTRACT,
    functionName: "balanceOf",
    args: [address],
  })

  useEffect(() => {
    if (!amount) {
      setAmountError(false)
      return
    }

    if (isNaN(Number(amount))) setAmountError(true)
    else setAmountError(false)
  }, [amount])

  useEffect(() => {
    if (!days) {
      setDaysError(false)
      return
    }

    if (isNaN(Number(days))) setDaysError(true)
    else if (Number(days) < 0 || Number(days) > 358) setDaysError(true)
    else setDaysError(false)
  }, [days])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0">
          <p className="text-center text-gray-400">You can stake</p>
          <p className="text-2xl text-center">{formatEther(data ?? 0n)} EC</p>
        </div>

        <div className="flex gap-1 w-full font-serif h-10">
          <input
            type="text"
            placeholder="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`text-center rounded-lg bg-gray-600 w-3/5 ${
              amountError
                ? "border-red-500 border-2 text-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          <input
            type="text"
            placeholder="days (0 ~ 358)"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className={`text-center rounded-lg bg-gray-600 w-2/5 ${
              daysError
                ? "border-red-500 border-2 text-red-500 focus:border-red-500 block focus:ring-red-500"
                : ""
            }`}
          />
        </div>

        {(amountError || daysError) && (
          <div>
            {amountError && (
              <p className="text-red-500 text-sm">
                ⚠️ Please enter a valid amount
              </p>
            )}
            {daysError && (
              <p className="text-red-500 text-sm">
                ⚠️ Please enter a valid days
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className={`focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
          amountError || daysError ? "disabled cursor-not-allowed" : ""
        }`}
        onClick={handleStake}
      >
        STAKE
      </button>

      {success && <TransactionSuccessToast tx={tx} />}
      {reject && <TransactionRejectToast />}
    </div>
  )
}

export default function Home() {
  const [tab, setTab] = useState("stake")

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <header className="font-serif text-5xl">Stake Your EC Token</header>

      <p className="text-wrap text-center w-1/5 text-gray-400">
        The lockup period is applied as 7 days by default. You can earn more
        points by increasing the lockup period. If you enter a lockup period,
        the lockup period will increase by the amount of the lockup period added
        to the default 7 days. If you enter a lockup period of 1, you can
        withdraw points after a total of 8 days.
      </p>
      <p className="text-wrap text-center w-1/5 font-bold">
        Point reward per a day 1EC = 0.01 POINT
      </p>

      <div className="flex flex-col justify-between items-stretch bg-[#18181B] bg-opacity-70 rounded-lg py-2 px-4 gap-6 min-w-[374px] min-h-[246px]">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="w-1/2">
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg active w-full ${
                  tab === "stake" ? "text-blue-500 border-blue-500" : ""
                }`}
                onClick={() => setTab("stake")}
              >
                STAKE
              </a>
            </li>
            <li className="w-1/2">
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg active w-full ${
                  tab === "unstake" ? "text-blue-500 border-blue-500" : ""
                }`}
                onClick={() => setTab("unstake")}
                aria-current="page"
              >
                UNSTAKE
              </a>
            </li>
          </ul>
        </div>

        {tab === "stake" ? <Stake /> : <Unstake />}
      </div>
    </div>
  )
}
