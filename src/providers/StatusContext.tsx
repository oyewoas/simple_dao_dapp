import { createContext, useContext } from "react";

export type Proposal = {
  id: bigint;
  description: string;
  recipient: string;
  amount: bigint;
  deadline: bigint;
  executed: boolean;
};
export type StatusContextType = {
  admin: string;
  daoToken: string;
  proposalCount: bigint;
  isMember: boolean;
  proposals: Proposal[];
  refetchAll: () => Promise<void>;
  getUserVoteInProposal: (proposalId: bigint) => Promise<{ state: number; comment: string } | null>;
  loading: boolean;
};

export const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = () => {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error("useStatus must be used inside StatusProvider");
  return ctx;
};
