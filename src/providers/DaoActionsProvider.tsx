import { type ReactNode, useEffect, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { simulateContract } from "@wagmi/core";
import { webSocketConfig, config } from "../config";
import contracts from "../contracts";
import {
  DaoActionsContext,
  type DaoActionsContextType,
} from "./DaoActionsContext";
import type { Address } from "viem";
import { getErrorFormatter } from "../utils/getErrorFormatter";
import { useStatus } from "./StatusContext";

function useDaoEventWatcher(setEvents: React.Dispatch<React.SetStateAction<unknown[]>>) {
  useWatchContractEvent({
    ...contracts.simpleDao,
    config: webSocketConfig,
    eventName: "MemberAdded",
    onLogs: (logs) => setEvents((p) => [...p, { type: "MemberAdded", logs }]),
  });
  useWatchContractEvent({
    ...contracts.simpleDao,
    config: webSocketConfig,
    eventName: "ProposalCreated",
    onLogs: (logs) => setEvents((p) => [...p, { type: "ProposalCreated", logs }]),
  });
  useWatchContractEvent({
    ...contracts.simpleDao,
    config: webSocketConfig,
    eventName: "ProposalFulfilled",
    onLogs: (logs) => setEvents((p) => [...p, { type: "ProposalFulfilled", logs }]),
  });
  useWatchContractEvent({
    ...contracts.simpleDao,
    config: webSocketConfig,
    eventName: "Voted",
    onLogs: (logs) => setEvents((p) => [...p, { type: "Voted", logs }]),
  });
}

export const DaoActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { writeContract, data: txHash } = useWriteContract();
  const { refetchAll } = useStatus();
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [events, setEvents] = useState<unknown[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useDaoEventWatcher(setEvents);
useEffect(() => {
  if (isSuccess) {
    refetchAll();
  }
}, [isSuccess, refetchAll]);
  // ---- Separate Action Methods ----

  const addMember = async (addr: Address) => {
    setLastError(null);
    try {
      setIsSimulating(true);
      await simulateContract(config, {
        ...contracts.simpleDao,
        functionName: "addMember",
        args: [addr],
      });
      setIsSimulating(false);

      writeContract(
        {
          ...contracts.simpleDao,
          functionName: "addMember",
          args: [addr],
        },
        { onError: (err) => setLastError(getErrorFormatter(err)) }
      );
    } catch (err) {
      setIsSimulating(false);
      setLastError(getErrorFormatter(err));
    }
  };

  const createProposal = async (recipient: Address, amount: bigint, description: string) => {
    setLastError(null);
    try {
      setIsSimulating(true);
      await simulateContract(config, {
        ...contracts.simpleDao,
        functionName: "createProposal",
        args: [recipient, amount, description],
      });
      setIsSimulating(false);

      writeContract(
        {
          ...contracts.simpleDao,
          functionName: "createProposal",
          args: [recipient, amount, description],
        },
        { onError: (err) => setLastError(getErrorFormatter(err)) }
      );
    } catch (err) {
      setIsSimulating(false);
      setLastError(getErrorFormatter(err));
    }
  };

  const fulfillProposal = async (id: bigint) => {
    setLastError(null);
    try {
      setIsSimulating(true);
      await simulateContract(config, {
        ...contracts.simpleDao,
        functionName: "fulfillProposal",
        args: [id],
      });
      setIsSimulating(false);

      writeContract(
        {
          ...contracts.simpleDao,
          functionName: "fulfillProposal",
          args: [id],
        },
        { onError: (err) => setLastError(getErrorFormatter(err)) }
      );
    } catch (err) {
      setIsSimulating(false);
      setLastError(getErrorFormatter(err));
    }
  };

  const vote = async (id: bigint, state: number, comment: string) => {
    setLastError(null);
    try {
      setIsSimulating(true);
      await simulateContract(config, {
        ...contracts.simpleDao,
        functionName: "vote",
        args: [id, state, comment],
      });
      setIsSimulating(false);

      writeContract(
        {
          ...contracts.simpleDao,
          functionName: "vote",
          args: [id, state, comment],
        },
        { onError: (err) => setLastError(getErrorFormatter(err)) }
      );
    } catch (err) {
      setIsSimulating(false);
      setLastError(getErrorFormatter(err));
    }
  };

  const value: DaoActionsContextType = {
    addMember,
    createProposal,
    fulfillProposal,
    vote,
    txPending: isSimulating || isWaiting,
    txSuccess: isSuccess,
    lastTxHash: txHash,
    txError: lastError,
    events,
  };

  return (
    <DaoActionsContext.Provider value={value}>
      {children}
    </DaoActionsContext.Provider>
  );
};
