import { useDaoActions } from "../providers/DaoActionsContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { type FC } from "react";
import Message from "./Message";

const VoteState = {
  Reject: 0,
  Approve: 1,
} as const;
type VoteState = typeof VoteState[keyof typeof VoteState];
// ---- Optional Comment Validation ----
const schema = yup.object({
  comment: yup
    .string()
    .max(200, "Comment cannot exceed 200 characters")
    .optional(),
});

type FormValues = yup.InferType<typeof schema>;
const VoteProposal: FC<{ proposalId: bigint }> = ({ proposalId }) => {
  const { vote, txPending, txError, txSuccess } = useDaoActions();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { comment: "" },
  });

  const onSubmit = async (data: FormValues, state: VoteState) => {
    await vote(proposalId, state, data.comment || "");
  };
  return (
    <form
      className="backdrop-blur-lg bg-gradient-to-br from-white/60 via-green-100/40 to-green-300/30 shadow-lg rounded-2xl p-4 mt-4 border border-white/30 transition-transform hover:scale-105 hover:shadow-xl duration-200"
    >
              {txPending && <Message message="Transaction pending..." type="info" />}
      {txError && <Message message={txError} type="error" />}
      {txSuccess && <Message message="Transaction successful!" type="success" />}
      <h3 className="font-semibold mb-2">
        Vote on Proposal #{proposalId.toString()}
      </h3>

      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Optional comment (max 200 chars)"
        {...register("comment")}
      />
      {errors.comment && (
        <span className="block text-red-500 text-sm">{errors.comment.message}</span>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={txPending}
          onClick={handleSubmit((data) => onSubmit(data, VoteState.Approve))}
          className="px-3 py-2 bg-gradient-to-r from-green-600 via-green-400 to-green-700 text-white rounded shadow hover:scale-105 hover:bg-green-700 disabled:bg-gray-400 transition-transform duration-200"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, VoteState.Reject))}
          disabled={txPending}
          className="px-3 py-2 bg-gradient-to-r from-red-600 via-pink-400 to-red-700 text-white rounded shadow hover:scale-105 hover:bg-red-700 disabled:bg-gray-400 transition-transform duration-200"
        >
          Reject
        </button>
      </div>
    </form>
  );
};

export default VoteProposal;
