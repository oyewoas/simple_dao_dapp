import React, { useEffect, type ReactNode } from "react";
import { useAccount, useReadContract } from "wagmi";
import { zeroAddress } from "viem";
import contracts from "../contracts";
import { StatusContext, type Proposal, type StatusContextType } from "./StatusContext";
import { config } from "../config";
import { readContract } from "wagmi/actions";

export const StatusProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address: connectedAccount } = useAccount();
  const [proposals, setProposals] = React.useState<Proposal[]>([]);

  // Reads
  const {
    data: admin,
    isLoading: isLoadingAdmin,
    refetch: refetchAdmin,
  } = useReadContract({
    ...contracts.simpleDao,
    functionName: "admin",
  });

  const {
    data: daoToken,
    isLoading: isLoadingDaoToken,
    refetch: refetchDaoToken,
  } = useReadContract({
    ...contracts.simpleDao,
    functionName: "daoToken",
  });

  const {
    data: proposalCount,
    isLoading: isLoadingProposalCount,
    refetch: refetchProposalCount,
  } = useReadContract({
    ...contracts.simpleDao,
    functionName: "proposalCount",
  });

  const {
    data: isMember,
    isLoading: isLoadingIsMember,
    refetch: refetchIsMember,
  } = useReadContract({
    ...contracts.simpleDao,
    functionName: "isMember",
    args: [connectedAccount ?? zeroAddress],
  });

  const getUserVoteInProposal = React.useCallback(
    async (proposalId: bigint): Promise<{ state: number; comment: string } | null> => {
      if (!connectedAccount) return null;
      const voted = await readContract(config, {
        ...contracts.simpleDao,
        functionName: "getUserVoteInProposal",
        args: [proposalId, connectedAccount],
      });
      // If user hasn't voted, voted will be null or undefined
      if (!voted) return null;
      // voted should be [number, string] if user has voted
      if (Array.isArray(voted) && voted.length === 2) {
        const [state, comment] = voted as [number, string];
        return { state, comment };
      }
      return null;
    },
    [connectedAccount]
  );
  const fetchProposals = React.useCallback(async () => {
    if (!proposalCount || proposalCount === 0n) {
      return [];
    }
    // make an array of IDs [0,1,2,...]
    const ids = Array.from({ length: Number(proposalCount) + 1 }, (_, i) =>
  BigInt(i)
);

    // fetch all proposals in parallel instead of sequentially
    const results = await Promise.all(
      ids.map((id) =>
        readContract(config, {
          ...contracts.simpleDao,
          functionName: "proposals",
          args: [id],
        }).then((res) => ({ id, res }))
      )
    );

    // map results into Proposal objects
    const filters = results.map(({ id, res }) => {
      const [pid, description, recipient, amount, deadline, executed] =
        res as [bigint, string, `0x${string}`, bigint, bigint, boolean];
      return {
        id: pid ?? id,
        description,
        recipient,
        amount,
        deadline,
        executed,
      };
    });
    setProposals(filters);
    return filters;
  }, [proposalCount]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const refetchAll = async () => {
    await Promise.all([
      refetchAdmin(),
      refetchDaoToken(),
      refetchProposalCount(),
      refetchIsMember(),
      fetchProposals(),
    ]);
  };

  const loading =
    isLoadingProposalCount ||
    isLoadingIsMember ||
    isLoadingAdmin ||
    isLoadingDaoToken;

  const value: StatusContextType = {
    admin: admin ?? zeroAddress,
    daoToken: daoToken ?? zeroAddress,
    proposalCount: proposalCount ?? BigInt(0),
    isMember: Boolean(isMember),
    proposals,
    refetchAll,
    getUserVoteInProposal,
    loading,
  };

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
};
