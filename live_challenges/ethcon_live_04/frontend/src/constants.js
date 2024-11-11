import { parseAbi } from "viem"

export const L1Messenger = "0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A"
export const L2Messenger = "0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d"
export const L2Keeper = "0x61d8d3E7F7c656493d1d76aAA1a836CEdfCBc27b"

export const L1MessengerABI = parseAbi([
  "function sendMessage(address _to,uint256 _value,bytes memory _message,uint256 _gasLimit) external payable",
])
