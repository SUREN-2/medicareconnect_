import { AppError } from "../lib/error";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { LoginInput, SignupInput } from "../types/auth.types";

export const ProfileRepo = async (patientId: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("name")
      .eq("id", patientId)
      .maybeSingle();


    

    if (error) {
      throw new AppError("Database error", 500);
    }
    if (!data) throw new AppError("Patient not found", 404);


    return data;
  } catch (err) {
    console.error("Network error:", err);

    throw new AppError(
      "Service temporarily unavailable. Please try again.",
      503,
    );
  }
};


export const getMedicationRepo = async (patientId: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("medications")
      .select("*")
      .eq("patient_id", patientId)
      .maybeSingle();

    if (error) {
      throw new AppError("Database error", 500);
    }
    if (!data) throw new AppError("Patient not found", 404);


    return data;
  } catch (err) {
    console.error("Network error:", err);

    throw new AppError(
      "Service temporarily unavailable. Please try again.",
      503,
    );
  }
};

export const getMedicationLogsRepo = async (
  patientId: string,
  monthStartStr: string,
  todayStr: string
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("medication_logs")
      .select("*")
      .eq("patient_id", patientId)
      .gte("date", monthStartStr)
      .lte("date", todayStr); // VERY IMPORTANT

    if (error) {
      throw new AppError("Database error", 500);
    }

    return data || [];
  } catch (err) {
    console.error("Network error:", err);

    throw new AppError(
      "Service temporarily unavailable. Please try again.",
      503
    );
  }
};

export const getPatientMedicationLogsRepo = async (patientId: string) => {
  try {

    
    const { data, error } = await supabaseAdmin
      .from("medication_logs")
      .select(
        `
        date,
        status,
        taken_at,
        medications (
          schedule_time
        )
      `,
      )
      .eq("patient_id", patientId)
      .order("date", { ascending: true });

    if (error) {
      throw new AppError("Failed to fetch medication logs", 500);
    }

    return data;
  } catch (err) {
    throw new AppError("Database connection failed", 503);
  }
};

export const getLast7DaysLogsRepo = async (patientId: string) => {
  try {
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);

    const todayStr = today.toISOString().split("T")[0];
    const last7DaysStr = last7Days.toISOString().split("T")[0];

    const { data, error } = await supabaseAdmin
      .from("medication_logs")
      .select("*")
      .eq("patient_id", patientId)
      .gte("date", last7DaysStr)
      .lte("date", todayStr)
      .order("date", { ascending: false });

    if (error) throw new AppError(error.message, 500);

    return data || [];
  } catch (err) {
    throw new AppError("Database connection failed", 503);
  }
};

type TakeMedicationInput = {
  patientId: string;
  medicationId: string;
  photoUrl?: string | null;
};

export const takeMedicationRepo = async ({
  patientId,
  medicationId,
  photoUrl,
}: TakeMedicationInput) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("medication_logs")
      .select("id")
      .eq("patient_id", patientId)
      .eq("medication_id", medicationId)
      .eq("date", today)
      .maybeSingle();

    if (fetchError) throw new AppError(fetchError.message, 500);

    const payload = {
      taken: true,
      taken_at: new Date().toISOString(),
      status: "taken",
      photo_url: photoUrl,
    };

    
    if (existing) {
      const { error } = await supabaseAdmin
        .from("medication_logs")
        .update(payload)
        .eq("id", existing.id);

      if (error) throw new AppError(error.message, 500);

      return { message: "Medication updated for today" };
    }

    
    const { error } = await supabaseAdmin
      .from("medication_logs")
      .insert({
        patient_id: patientId,
        medication_id: medicationId,
        date: today,
        ...payload,
      });

    if (error) throw new AppError(error.message, 500);

    return { message: "Medication log created for today" };

  } catch (err: any) {
    throw new AppError(err.message || "Database connection failed", 503);
  }
};

export const addMedicationRepo = async ({
  patientId,
  name,
  dosage,
  scheduleTime,
}: {
  patientId: string;
  name: string;
  dosage?: string;
  scheduleTime?: string;
}) => {
  const { error } = await supabaseAdmin
    .from("medications")
    .upsert(
      {
        patient_id: patientId,
        name,
        dosage,
        schedule_time: scheduleTime,
      },
      {
        onConflict: "patient_id", // column that should be unique
      }
    );

  if (error) throw new Error(error.message);

  return { message: "Medication saved successfully" };
};