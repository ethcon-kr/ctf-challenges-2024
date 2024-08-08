// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

interface IVerifier {
    function verifyProof(uint256[2] calldata, uint256[2][2] calldata, uint256[2] calldata, uint256[1] calldata)
        external
        returns (bool);
}

contract Circom {
    IVerifier public _verifier;
    mapping(address user => bool hasFlag) public flag;
    mapping(uint256 hash => bool used) private _usedHashes;

    constructor(IVerifier verifier) {
        _verifier = verifier;
    }

    function buyFlag(bytes calldata proof) external payable {
        uint256[2] memory pA;
        uint256[2][2] memory pB;
        uint256[2] memory pC;
        uint256[1] memory pubSignals;
        (pA, pB, pC, pubSignals) = abi.decode(proof, (uint256[2], uint256[2][2], uint256[2], uint256[1]));
        require(_usedHashes[pubSignals[0]] == false, "proof already used");
        require(_verifier.verifyProof(pA, pB, pC, pubSignals), "invalid proof");
        _usedHashes[pubSignals[0]] = true;
        flag[msg.sender] = true;
    }
}
