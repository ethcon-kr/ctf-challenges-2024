'use client'

import { getBalance, readContract, writeContract } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatEther, parseAbi } from 'viem'
import { useAccount } from 'wagmi'
import { config } from '../../../config'

export default function Home() {
  const abi = parseAbi([
    'function wrap()',
    'function unwrap(uint256)',
    'function transfer(address, uint256)',
    'function buyFlag()',
    'function flag(address) view returns (bool)',
  ])
  const contractAddr = '0xCEd09888Af7412217fe02ce78f1dF2e89e4941b7'
  const { isConnected, address } = useAccount()
  const [nativeBalance, setNativeBalance] = useState({
    formatted: '0',
    value: 0n,
  })
  const [wrapBalance, setWrapBalance] = useState({
    formatted: '0',
    value: 0n,
  })
  const [history, setHistory] = useState([])
  const [hasFlag, setHasFlag] = useState(false)
  const { register, watch } = useForm()

  const appendHistory = (tx) => {
    const newHistory = [...history, tx]
    localStorage.setItem('history', JSON.stringify(newHistory))
    setHistory(newHistory)
  }

  useEffect(() => {
    const init = async () => {
      setNativeBalance(
        await getBalance(config, {
          address,
          unit: 'ether',
        })
      )
      setWrapBalance(
        await getBalance(config, {
          address,
          token: contractAddr,
          unit: 'ether',
        })
      )
      setHasFlag(
        await readContract(config, {
          abi,
          address: contractAddr,
          functionName: 'flag',
          args: [address],
        })
      )
      const newHistory = localStorage.getItem('history')
      if (newHistory != null) setHistory(JSON.parse(newHistory))
    }

    if (address) init()
  }, [address, abi])

  const wrap = async () => {
    if (nativeBalance.value < BigInt(watch('actionAmt')))
      return alert('Not Enough Native Coin')
    if (
      confirm(
        `Are you sure you want to wrap ${formatEther(watch('actionAmt'))}?`
      )
    ) {
      const tx = await writeContract(config, {
        abi,
        address: contractAddr,
        functionName: 'wrap',
        value: watch('actionAmt'),
      })
      appendHistory(tx)
    }
  }

  const unwrap = async () => {
    if (wrapBalance.value < BigInt(watch('actionAmt')))
      return alert('Not Enough Wrapped Token')
    if (parseInt(watch('actionAmt')) > 0)
      if (
        confirm(
          `Are you sure you want to unwrap ${formatEther(watch('actionAmt'))}?`
        )
      ) {
        const tx = await writeContract(config, {
          abi,
          address: contractAddr,
          functionName: 'unwrap',
          args: [watch('actionAmt')],
        })
        appendHistory(tx)
      }
  }

  const transfer = async () => {
    const to = watch('transferTo')
    const amt = watch('transferAmt')
    if (typeof to !== 'string' || to.length !== 42)
      return alert('Invalid Address')
    if (wrapBalance.value < BigInt(amt))
      return alert('Not Enough Wrapped Token')
    if (BigInt(amt) > 0n) {
      const tx = await writeContract(config, {
        abi,
        address: contractAddr,
        functionName: 'transfer',
        args: [to, amt],
      })
      appendHistory(tx)
    }
  }

  const buyFlag = async () => {
    if (10000000000000000000000n > wrapBalance.value)
      return alert('Not Enough Wrapped Token')
    const tx = await writeContract(config, {
      abi,
      address: contractAddr,
      functionName: 'buyFlag',
    })
    appendHistory(tx)
  }

  return (
    <main>
      <div className='flex justify-center mt-20'>
        <div className='flex flex-col w-1/4 justify-self-center'>
          <div className='border-b-4 text-center font-extrabold'>
            wKlay - To ensure compatibility with the ERC20 standard, wrap your
            native coin!
          </div>
          {isConnected ? (
            <>
              <div>Address : {address}</div>
              <div>Native Balance : {nativeBalance.formatted}</div>
              <div>wKlay Balance : {wrapBalance.formatted}</div>
              <br />
              <div className='grid grid-cols-8'>
                <input
                  type='number'
                  className='border-2 col-span-6'
                  {...register('actionAmt')}
                />
                <button
                  className='border-2 border-blue-500 col-span-1'
                  onClick={wrap}
                >
                  Wrap
                </button>
                <button
                  className='border-2 border-red-500 col-span-1'
                  onClick={unwrap}
                >
                  Unwrap
                </button>
              </div>
              <br />
              <div className='grid grid-cols-10'>
                <p className='col-span-1'>To:</p>
                <input
                  type='text'
                  className='border-2 col-span-9'
                  {...register('transferTo')}
                />
              </div>
              <div className='grid grid-cols-10'>
                <p className='col-span-1'>Amount:</p>
                <input
                  type='number'
                  className='border-2 col-span-9'
                  {...register('transferAmt')}
                />
              </div>
              <button
                className='border-2 border-black col-span-6'
                onClick={transfer}
              >
                Transfer
              </button>
              <p className='mt-4'>Flag price : 10000.0000 wKlay</p>
              {hasFlag ? (
                <button>Nicely Done!</button>
              ) : (
                <button onClick={buyFlag} className='border-2 border-black'>
                  Buy Flag
                </button>
              )}
            </>
          ) : (
            <w3m-connect-button />
          )}
          <div className='mt-10'>
            <div className='text-center'>Transaction History</div>
            {history.map((tx, i) => (
              <div key={i}>
                <a
                  target='_blank'
                  className='hover:text-blue-600'
                  href={`https://baobab.klaytnscope.com/tx/${tx}`}
                >
                  {tx}
                </a>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
