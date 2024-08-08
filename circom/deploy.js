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

spawn('circom2 calcme.circom --r1cs --sym --wasm')
spawn('snarkjs wc calcme_js/calcme.wasm input.json witness.wtns')
spawn('snarkjs powersoftau new bn128 12 tau1.ptau')
spawn(
  `echo ${Math.random()} | snarkjs powersoftau contribute tau1.ptau tau2.ptau`
)
spawn('snarkjs powersoftau prepare phase2 tau2.ptau tau3.ptau')
spawn('snarkjs groth16 setup calcme.r1cs tau3.ptau calcme_pre.zkey')
spawn(
  `echo ${Math.random()} | snarkjs zkey contribute calcme_pre.zkey calcme.zkey`
)
spawn('snarkjs zkey export verificationkey calcme.zkey verification_key.json')
spawn('snarkjs groth16 prove calcme.zkey witness.wtns proof.json public.json')
spawn('snarkjs groth16 verify verification_key.json public.json proof.json')
spawn('snarkjs zkey export solidityverifier calcme.zkey src/verifier.sol')

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

const { deployedTo: verifier } = JSON.parse(
  spawn(
    `forge create --json -r ${rpc} --private-key ${key} src/verifier.sol:Groth16Verifier`
  )
)

spawn(
  `cast call ${verifier} -r ${rpc} "verifyProof(uint[2], uint[2][2], uint[2], uint[1]) returns (bool)" ${args}`,
  true
)

const { deployedTo: circom } = JSON.parse(
  spawn(
    `forge create --json -r ${rpc} --private-key ${key} src/Circom.sol:Circom --constructor-args ${verifier}`
  )
)

const bytes = spawn(
  `cast abi-encode "verifyProof(uint[2], uint[2][2], uint[2], uint[1]) returns (bool)" ${args}`
)

const { from } = JSON.parse(
  spawn(
    `cast send --json -r ${rpc} --private-key ${key} ${circom} "buyFlag(bytes)" ${bytes}`
  )
)

spawn(`cast call -r ${rpc} ${circom} "flag(address)(bool)" ${from}`, true)

spawn(
  'rm -rf verification_key.json proof.json public.json witness.wtns calcme_pre.zkey calcme.sym calcme.r1cs tau1.ptau tau2.ptau tau3.ptau src/verifier.sol calcme_js input.json'
)
