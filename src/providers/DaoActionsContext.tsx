
import { createContext, useContext } from "react";
import type { Address, Hash } from "viem";

export type DaoActionsContextType = {
  addMember: (addr: Address) => Promise<void>;
  createProposal: (recipient: Address, amount: bigint, description: string) => Promise<void>;
  fulfillProposal: (id: bigint) => Promise<void>;
  vote: (id: bigint, state: number, comment: string) => Promise<void>;
  txPending: boolean;
  lastTxHash?: Hash;
  txError: string | null;
  txSuccess: boolean;
  events: unknown[];
};

export const DaoActionsContext = createContext<DaoActionsContextType | undefined>(undefined);

export const useDaoActions = () => {
  const ctx = useContext(DaoActionsContext);
  if (!ctx) throw new Error("useDaoActions must be used inside DaoActionsProvider");
  return ctx;
};