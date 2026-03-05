import api from "@/lib/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type TakeMedicationInput = {
  medicationId: string;
  photoUrl?: string;
};

export const useTakeMedication = (
  options?: UseMutationOptions<any, Error, TakeMedicationInput>
) => {
  return useMutation({
    mutationFn: async (data: TakeMedicationInput) => {
      const res = await api.post("/patient/take-medication", data);
      return res.data;
    },
    ...options, 
  });
};