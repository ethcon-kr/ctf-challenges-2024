"use client"

import { projectId, wagmiAdapter } from "@/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cookieToInitialState, WagmiProvider } from "wagmi"
import { createAppKit } from "@reown/appkit/react"
import { scrollSepolia } from "@reown/appkit/networks"

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error("Project ID is not defined")
}

// Set up metadata
const metadata = {
  name: "appkit-example-scroll",
  description: "AppKit Example - Scroll",
  url: "https://scrollapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [scrollSepolia],
  defaultNetwork: scrollSepolia,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
})

function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
