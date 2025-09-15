import { useStatus } from "../providers/StatusContext";

export default function Dashboard() {
  const { admin, daoToken, proposals, isMember, loading } = useStatus();

  if (loading)
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading DAO status...
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="backdrop-blur-lg bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-300/30 shadow-lg rounded-2xl p-4 border border-white/30 transition-transform hover:scale-105 hover:shadow-xl duration-200">
        <h2 className="text-sm text-blue-700 font-semibold mb-1">Admin</h2>
        <p className="break-words text-xs text-gray-800">{admin}</p>
      </div>
      <div className="backdrop-blur-lg bg-gradient-to-br from-white/60 via-purple-100/40 to-purple-300/30 shadow-lg rounded-2xl p-4 border border-white/30 transition-transform hover:scale-105 hover:shadow-xl duration-200">
        <h2 className="text-sm text-purple-700 font-semibold mb-1">
          DAO Token
        </h2>
        <p className="break-words text-xs text-gray-800">{daoToken}</p>
      </div>
      <div className="backdrop-blur-lg bg-gradient-to-br from-white/60 via-green-100/40 to-green-300/30 shadow-lg rounded-2xl p-4 border border-white/30 transition-transform hover:scale-105 hover:shadow-xl duration-200">
        <h2 className="text-sm text-green-700 font-semibold mb-1">Proposals</h2>
          <p className="text-xl font-bold text-green-900">
            {proposals.length.toString()}
        </p>
      </div>
      <div className="backdrop-blur-lg bg-gradient-to-br from-white/60 via-pink-100/40 to-pink-300/30 shadow-lg rounded-2xl p-4 border border-white/30 transition-transform hover:scale-105 hover:shadow-xl duration-200">
        <h2 className="text-sm text-pink-700 font-semibold mb-1">Membership</h2>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow ${
            isMember
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {isMember ? (
            <>
              <span className="mr-1">Member</span>
            </>
          ) : (
            <>
              <span className="mr-1">Not a Member</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
