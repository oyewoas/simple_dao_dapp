import { useEffect, useState } from "react";
import { useStatus } from "../providers/StatusContext";
import { formatEther } from "viem";
import VoteProposal from "./VoteProposal";
import { isAfter } from "date-fns";

export default function ProposalList() {
  const { proposals, loading, getUserVoteInProposal } = useStatus();
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<bigint | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, { state: number; comment: string } | null>>({});

  useEffect(() => {
    const fetchVotes = async () => {
      const votes: Record<string, { state: number; comment: string } | null> = {};
      for (const proposal of proposals) {
        const vote = await getUserVoteInProposal(proposal.id);
        votes[proposal.id.toString()] = vote;
      }
      setUserVotes(votes);
    };
    fetchVotes();
  }, [proposals, getUserVoteInProposal]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Proposals</h2>
      <div className="grid gap-4">
        {loading && <p className="text-gray-500">Loading proposals...</p>}
        {!loading && proposals.length === 0 && (
          <p className="text-gray-500">No proposals yet.</p>
        )}
        {proposals.map((p) => (
          <div
            key={p.id.toString()}
            className="backdrop-blur-lg bg-gradient-to-br from-white/60 via-indigo-100/40 to-indigo-300/30 shadow-lg rounded-2xl p-4 border border-white/30 transition-transform hover:scale-105 hover:shadow-xl duration-200"
          >
            <h3 className="font-semibold text-indigo-700 mb-1">
              #{p.id.toString()} – {p.description}
            </h3>
            <p className="text-sm text-gray-600">
              Recipient: <span className="font-mono">{p.recipient}</span>
            </p>
            <p className="text-sm text-gray-600">
              Amount: <span className="font-bold">{formatEther(p.amount)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Deadline:{" "}
              <span className="font-mono">
                {new Date(Number(p.deadline) * 1000).toLocaleString()}
              </span>
            </p>
            <p className="text-sm">Executed: {p.executed ? "Yes" : "No"}</p>
            {/* Vote on proposal */}
            <p className="text-sm">{userVotes[p.id.toString()] ? `Your Vote: ${userVotes[p.id.toString()]?.state === 1 ? "Approved" : "Rejected"}${userVotes[p.id.toString()]?.comment ? ` - Comment: ${userVotes[p.id.toString()]?.comment}` : ""}` : "You have not voted on this proposal yet."}</p>
            {isAfter(new Date(Number(p.deadline) * 1000), new Date()) &&  <button
              className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 text-white rounded shadow hover:scale-105 hover:bg-red-700 transition-transform duration-200"
              onClick={() => {
                setSelectedProposalId(p.id);
                setShowVoteForm(!showVoteForm);
              }}
            >
              {showVoteForm && selectedProposalId === p.id ? "Hide Vote Form" : "Vote on Proposal"}
            </button>}
            {showVoteForm && selectedProposalId === p.id &&  (
              <VoteProposal proposalId={p.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
