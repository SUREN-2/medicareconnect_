import api from "@/lib/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";

type TakeMedicationInput = {
  medicationId: string;
  photoUrl?: string;
};

export const useTakeMedication = (
  options?: UseMutationOptions<any, Error, TakeMedicationInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TakeMedicationInput) => {
      console.log("called");
      const res = await api.post("/patient/take-medication", data);
      return res.data;
    },

    onSuccess: (data, variables, onMutateResult, context) => {
      // console.log("success");

      queryClient.invalidateQueries({ queryKey: ["patient-stats"] });
      queryClient.invalidateQueries({ queryKey: ["patient-logs"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};