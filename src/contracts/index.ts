import { erc20Abi, type Abi, type Address } from "viem";
import simpleDaoAbi from "./abis/simpleDao";

type TContracts = Record<
  string,
  {
    address: Address;
    abi: Abi;
  }
>;

const contracts = {
  simpleDao: {
    address: "0xE9eccf5Fe4e251eF8a73a9F02A119ABf29B79893",
    abi: simpleDaoAbi,
  },
  daoToken: {
    address: "0x8e430c4abae2c2bb9253bc0c8d16ccbc5ff8f809",
    abi: erc20Abi,
  },
} as const satisfies TContracts;

export default contracts;
