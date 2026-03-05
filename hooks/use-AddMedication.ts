import api from "@/lib/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";

type AddMedicationInput = {
  name: string;
  dosage?: string;
  scheduleTime?: string;
};

export const useAddMedication = (
  options?: UseMutationOptions<any, Error, AddMedicationInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddMedicationInput) => {
      const res = await api.post("/patient/add-medication", data);
      return res.data;
    },

    onSuccess: () => {
      // refresh patient stats automatically
      queryClient.invalidateQueries({
        queryKey: ["patientStats"],
      });
    },

    ...options,
  });
};