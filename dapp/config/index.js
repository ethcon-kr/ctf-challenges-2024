import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { klaytnBaobab } from 'wagmi/chains'

export const projectId = 'project_id'

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'wklay',
  description: 'ethcon2024 ctf - wklay',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains = [klaytnBaobab]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
