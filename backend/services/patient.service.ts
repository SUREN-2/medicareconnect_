import {
  getMedicationLogsRepo,
  ProfileRepo,
  getPatientMedicationLogsRepo,
  getLast7DaysLogsRepo,
  takeMedicationRepo,
  getMedicationRepo,
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

  console.log(today + " " + todayStr);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split("T")[0];

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const profile = await ProfileRepo(patientId);

  const logs = await getMedicationLogsRepo(patientId, monthStartStr);


  const medicationData = await getMedicationRepo(patientId)

  const monthLogs = logs || [];

  const todayLog = monthLogs.find((l) => l.date === todayStr);
  const todayStatus = todayLog?.status || "pending";

  const takenDaysMonth = monthLogs.filter((l) => l.status === "taken").length;
  const missedDaysMonth = monthLogs.filter((l) => l.status === "missed").length;
  const totalDaysMonth = monthLogs.length;

  const consistency =
    totalDaysMonth > 0
      ? Number(((takenDaysMonth / totalDaysMonth) * 100).toFixed(2))
      : 0;

  const weekLogs = monthLogs.filter((l) => l.date >= weekStartStr);
  const takenWeek = weekLogs.filter((l) => l.status === "taken").length;

  const sortedLogs = [...monthLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  let streak = 0;
  for (const log of sortedLogs) {
    if (log.status === "taken") {
      streak++;
    } else {
      break;
    }
  }

  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const remainingDays = lastDay.getDate() - today.getDate();

  return {
    patientName: profile.name,
    medicineName : medicationData.name,
    dosage: medicationData.dosage,
    scheduleTime : medicationData.schedule_time,
    medicineId: medicationData.id,
    todayStatus,
    consistencyRate: consistency,
    streak,
    missedCurrentMonth: missedDaysMonth,
    takenCurrentWeek: takenWeek,
    missedDaysCurrentMonth: missedDaysMonth,
    takenDaysCurrentMonth: takenDaysMonth,
    remainingDaysCurrentMonth: remainingDays,
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
