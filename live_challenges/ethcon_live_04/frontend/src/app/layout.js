import "./globals.css"

import ContextProvider from "@/context"
import SolveButton from "@/components/SolveButton"
import { headers } from "next/headers"

export const metadata = {
  title: "Ethcon Live Challenge",
  description: "Bridge",
}

export default function RootLayout({ children }) {
  const cookies = headers().get("cookie")

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <div className="absolute flex flex-row gap-4 justify-center items-stretch top-0 right-0 my-4 mr-4">
            <SolveButton />
            <w3m-button />
          </div>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
