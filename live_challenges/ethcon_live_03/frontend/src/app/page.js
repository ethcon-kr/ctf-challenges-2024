"use client"

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-4">
      <header className="font-serif text-5xl">EC Casino 💸</header>

      <div className="flex flex-col gap-2 w-72">
        <div className="relative rounded-lg h-80">
          <Image
            src="/evenodd.webp"
            alt="EvenOdd"
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div>
          Welcome to EC Casino. You can play the odd-even game for free, and if
          you win 10 times in a row, you can win the jackpot.
        </div>

        <Link href="/play">
          <button className="bg-green-600 hover:bg-green-700 rounded-lg py-2 w-32">
            Play
          </button>
        </Link>
      </div>
    </div>
  )
}
