import { useDaoActions } from "../providers/DaoActionsContext";
import { type Address, zeroAddress, isAddress, parseEther } from "viem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Message from "./Message";

// ---- Validation Schema ----
const schema = yup.object({
  recipient: yup
    .string()
    .required("Recipient address is required")
    .test("is-address", "Enter a valid recipient address", (value) => {
      return value ? isAddress(value) && value !== zeroAddress : false;
    }),
  amount: yup
    .string()
    .typeError("Enter a valid number")
    .test("is-positive", "Enter a valid amount greater than 0", (value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    })
    .required("Amount is required"),
  description: yup
    .string()
    .trim()
    .required("Description cannot be empty"),
});

type FormValues = yup.InferType<typeof schema>;

export default function CreateProposal() {
  const { createProposal, txPending, txError, txSuccess } = useDaoActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      recipient: "",
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const parsedAmount = parseEther(data.amount.toString());
    await createProposal(data.recipient as Address, parsedAmount, data.description);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 backdrop-blur-lg bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-300/30 shadow-lg rounded-2xl border border-white/30 space-y-4"
    >
      {txPending && <Message message="Transaction pending..." type="info" />}
      {txError && <Message message={txError} type="error" />}
      {txSuccess && <Message message="Transaction successful!" type="success" />}

      <h2 className="text-lg font-bold">Create Proposal</h2>

      {/* Recipient */}
      <input
        className="w-full p-2 border rounded"
        placeholder="Recipient Address"
        {...register("recipient")}
      />
      {errors.recipient && (
        <span className="block text-red-500">{errors.recipient.message}</span>
      )}

      {/* Amount */}
      <input
        className="w-full p-2 border rounded"
        placeholder="Amount"
        type="number"
        {...register("amount")}
      />
      {errors.amount && (
        <span className="block text-red-500">{errors.amount.message}</span>
      )}

      {/* Description */}
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Description"
        {...register("description")}
      />
      {errors.description && (
        <span className="block text-red-500">{errors.description.message}</span>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={txPending}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-700 text-white rounded shadow hover:scale-105 hover:bg-blue-700 disabled:bg-gray-400 transition-transform duration-200"
      >
        {txPending ? "Submitting..." : "Submit Proposal"}
      </button>
    </form>
  );
}
