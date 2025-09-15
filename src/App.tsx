import React from "react";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";
import CreateProposal from "./components/CreateProposal";
import ProposalList from "./components/ProposalList";
import Header from "./components/Header";
import { useStatus } from "./providers/StatusContext";
import { useAccount } from "wagmi";
import AddMemberForm from "./components/AddMember";

const App: React.FC = () => {
  const { admin } = useStatus();
  const { address: connectedAccount } = useAccount();

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6">
      <Toaster position="top-right" />
      <Header />
      {/* Dashboard (top section) */}
      <div className="mb-6">
        <Dashboard />
      </div>

      {/* Main content: Proposal creation + Proposal list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Create Proposal */}
        {admin === connectedAccount && <AddMemberForm />}
        {/* Left: Create Proposal */}
        <div className="lg:col-span-1">
          <CreateProposal />
        </div>

        {/* Right: Proposal List */}
        <div className="lg:col-span-2">
          <ProposalList />
        </div>
      </div>
    </div>
  );
};

export default App;
