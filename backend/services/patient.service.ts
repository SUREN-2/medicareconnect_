import {
  getMedicationLogsRepo,
  ProfileRepo,
  getPatientMedicationLogsRepo,
  getLast7DaysLogsRepo,
  takeMedicationRepo,
  getMedicationRepo,
  addMedicationRepo,
} from "../repositories/patient.repo";
type MedicationData = {
  date: string;
  status: string;
  time: string;
  taken_at: string;
};
export const getPatientStats = async (patientId: string) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split("T")[0];

  // Week start Monday
  const weekStart = new Date(today);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(today.getDate() + diff);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const [profile, logs, medicationData] = await Promise.all([
    ProfileRepo(patientId).catch(() => null),
    getMedicationLogsRepo(patientId, monthStartStr, todayStr).catch(() => []),
    getMedicationRepo(patientId).catch(() => null),
  ]);

  const monthLogs = logs || [];

  const todayLog = monthLogs.find((l) => l.date === todayStr);
  const todayStatus = todayLog?.status || "pending";

  const takenDaysMonth = monthLogs.filter((l) => l.status === "taken").length;
  const missedDaysMonth = monthLogs.filter((l) => l.status === "missed").length;

  const totalDaysMonth = takenDaysMonth + missedDaysMonth;

  const consistencyRate =
    totalDaysMonth > 0
      ? Number(((takenDaysMonth / totalDaysMonth) * 100).toFixed(2))
      : 0;

  // Week stats
  const weekLogs = monthLogs.filter((l) => l.date >= weekStartStr);

  const takenCurrentWeek = weekLogs.filter((l) => l.status === "taken").length;

  // Streak
  const sortedLogs = [...monthLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  for (const log of sortedLogs) {
    if (log.status === "taken") {
      streak++;
    } else {
      break;
    }
  }

  // Remaining days in the full month
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const remainingDaysCurrentMonth = daysInMonth - totalDaysMonth;

  return {
    patientName: profile?.name ?? "No Patient",

    medicineName: medicationData?.name ?? null,
    dosage: medicationData?.dosage ?? null,
    scheduleTime: medicationData?.schedule_time ?? null,
    medicineId: medicationData?.id ?? null,

    todayStatus,

    consistencyRate,
    streak,

    takenCurrentWeek,

    takenDaysCurrentMonth: takenDaysMonth,
    missedDaysCurrentMonth: missedDaysMonth,

    remainingDaysCurrentMonth,
  };
};

const formatTime = (time: string | null) => {
  if (!time) return "-";

  const [hour, minute] = time.split(":");
  const h = Number(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;

  return `${formattedHour}:${minute} ${ampm}`;
};

export const getPatientMedicationLogs = async (patientId: string) => {
  const logs = await getPatientMedicationLogsRepo(patientId);

  return logs.map((log: any) => ({
    date: log.date,
    status: log.status,
    time: formatTime(log.medications?.schedule_time),
    taken_at: log.taken_at
      ? formatTime(new Date(log.taken_at).toTimeString().slice(0, 5))
      : "-",
  }));
};

const weekFormatTime = (timestamp: string) => {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getLast7DaysLogs = async (patientId: string) => {
  const logs = await getLast7DaysLogsRepo(patientId);

  //   console.log(logs);

  return logs.map((log) => ({
    date: log.date,
    status: log.status,
    time: weekFormatTime(log.created_at),
    taken_at: log.taken_at ? formatTime(log.taken_at) : "-",
    url: log.photo_url
  }));
};

export const takeMedication = async (input: {
  patientId: string;
  medicationId: string;
  photoUrl?: string | null;
}) => {
  return await takeMedicationRepo(input);
};


export const addMedication = async (input: {
  patientId: string;
  name: string;
  dosage?: string;
  scheduleTime?: string;
}) => {
  return await addMedicationRepo(input);
};