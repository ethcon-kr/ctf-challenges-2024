pragma circom 2.1.9;

include "node_modules/circomlib/circuits/bitify.circom";
include "node_modules/circomlib/circuits/poseidon.circom";

template CalcMe() {
    signal input secret1;
    signal input secret2;
    signal output hash;

    signal inputs[2];
    inputs[0] <== secret1;
    inputs[1] <== secret2;

    component poseidonHash = Poseidon(2);
    poseidonHash.inputs <== inputs;
    hash <== poseidonHash.out;
    
    component condition1 = Num2Bits(248);
    component condition2 = Num2Bits(248);
    component condition3 = Num2Bits(256);
    component condition1num = Bits2Num(16);
    component condition2num = Bits2Num(16);
    component condition3num = Bits2Num(16);
    condition1.in <== secret1;
    condition2.in <== secret2;
    condition3.in <== hash;
    for (var i = 0; i < 16; i++) {
        condition1num.in[i] <== condition1.out[i];
        condition2num.in[i] <== condition2.out[i];
        condition3num.in[i] <== condition3.out[i];
    }
    condition3num.out === condition1num.out + condition2num.out;
    log(secret1);
    log(secret2);
    log(hash);
}

component main = CalcMe();
