'use client'

import { getBalance } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { config } from '../../../config'

export default function Home() {
  const { isConnected, address } = useAccount()
  const [nativeBalance, setNativeBalance] = useState(0)

  useEffect(() => {
    const init = async () => {
      const balance = await getBalance(config, {
        address,
        unit: 'ether',
      })
      setNativeBalance(balance.formatted)
    }

    if (address) init()
  }, [address])

  const buyFlag = () => {}
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
              <div>Native Balance : {nativeBalance}</div>
              <div>wKlay Balance : {address}</div>
              <br />
              <div>
                <input type='number' className='border-2 w-10/12 mr-2' />
                <button className='border-2 border-blue-500'>Wrap</button>
                <button className='border-2 border-red-500'>Unwrap</button>
              </div>
              <br />
              <button onClick={buyFlag} className='border-2 border-black'>
                Buy Flag
              </button>
            </>
          ) : (
            <w3m-connect-button />
          )}
        </div>
      </div>
    </main>
  )
}
