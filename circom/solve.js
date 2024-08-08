// npm i -g circom2 snarkjs
import { spawnSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { poseidon2 } from 'poseidon-lite'

const spawn = (cmd, print = false, opt) => {
  const stdout = spawnSync(cmd, [], { ...opt, shell: true }).stdout.toString()
  print && console.log(stdout)
  return stdout
}

while (!existsSync('input.json')) {
  const secret1 = Math.floor(Math.random() * 100000000)
  const secret2 = Math.floor(Math.random() * 100000000)
  const hash = parseInt(poseidon2([secret1, secret2]) & BigInt(0xffff))
  const condition = (secret1 & 0xffff) + (secret2 & 0xffff)
  if (condition == hash)
    writeFileSync('input.json', JSON.stringify({ secret1, secret2 }))
}

const circom = '0x12d2e3bfa22fd4275ddf19c2d99b934a93a342cf'

spawn('circom2 calcme.circom --sym --wasm')
spawn('snarkjs wc calcme_js/calcme.wasm input.json witness.wtns')
spawn('snarkjs groth16 prove calcme.zkey witness.wtns proof.json public.json')

let args = ''
const data = JSON.parse(`[${spawn('snarkjs zkey export soliditycalldata')}]`)
args = `"[${data[0].join(',')}]" `
args += `"[[${data[1][0].join(',')}],[${data[1][1].join(',')}]]" `
args += `"[${data[2].join(',')}]" `
args += `"[${data[3].join(',')}]"`

const key =
  process.env.pKey ??
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const rpc = process.env.rpc ?? 'http://localhost:8545'

const bytes = spawn(
  `cast abi-encode "verifyProof(uint[2], uint[2][2], uint[2], uint[1]) returns (bool)" ${args}`,
  true
)

const { from } = JSON.parse(
  spawn(
    `cast send --json -r ${rpc} --private-key ${key} ${circom} "buyFlag(bytes)" ${bytes}`,
    true
  )
)

spawn(`cast call -r ${rpc} ${circom} "flag(address)(bool)" ${from}`, true)

spawn(
  'rm -rf calcme.sym calcme_js proof.json public.json witness.wtns input.json'
)
