import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { cookieStorage, createStorage } from "wagmi"
import { scrollSepolia } from "@reown/appkit/networks"

// Get projectId from https://cloud.reown.com
export const projectId = "ebbae71bbe4821a29b59e87c412a7751"

if (!projectId) {
  throw new Error("Project ID is not defined")
}

export const networks = [scrollSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig
