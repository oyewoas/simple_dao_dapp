import { type Address, isAddress, zeroAddress } from "viem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Message from "./Message";
import { useDaoActions } from "../providers/DaoActionsContext";


// ---- Validation Schema ----
const schema = yup.object({
  member: yup
    .string()
    .required("Member address is required")
    .test("is-address", "Enter a valid Ethereum address", (value) => !!value && isAddress(value) && value !== zeroAddress),
});

type FormValues = yup.InferType<typeof schema>;

export default function AddMemberForm() {
  const { addMember, txPending, txError, txSuccess } = useDaoActions();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { member: "" },
  });

  const onSubmit = async (data: FormValues) => {
      await addMember(data.member as Address);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 backdrop-blur-lg bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-300/30 shadow-lg rounded-2xl border border-white/30 space-y-4"
    >
      {txPending && <Message message="Transaction pending..." type="info" />}
      {txError && <Message message={txError} type="error" />}
      {txSuccess && <Message message="Transaction successful!" type="success" />}

      <h2 className="text-lg font-bold">Add Member</h2>

      <input
        placeholder="Member address"
        className="w-full p-2 border rounded"
        {...register("member")}
      />
      {errors.member && <span className="block text-red-500">{errors.member.message}</span>}

      <button
        type="submit"
        disabled={txPending}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-700 text-white rounded shadow hover:scale-105 disabled:bg-gray-400 transition-transform duration-200"
      >
        {txPending ? "Submitting..." : "Add Member"}
      </button>
    </form>
  );
}
