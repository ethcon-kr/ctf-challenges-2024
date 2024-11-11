import { NextResponse } from "next/server"
import { createPublicClient, http, parseAbi } from "viem"
import { scrollSepolia } from "viem/chains"

export const dynamic = "force-dynamic"

const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
})

export async function GET() {
  const solver = await publicClient.readContract({
    address: process.env.NEXT_PUBLIC_CASINO_CONTRACT,
    abi: parseAbi(["function jackpotWinner() view returns (address)"]),
    functionName: "jackpotWinner",
  })

  return NextResponse.json({ solver })
}
