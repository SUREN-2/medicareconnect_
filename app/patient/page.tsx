"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { IconHeartHandshake } from "@tabler/icons-react";
import UploadProof from "@/components/upload-proof";
import { MedicationProgressCard } from "@/components/progress-card";

export default function PatientPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  // const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [file, setFile] = React.useState<File | null>(null);

  type StatusType = "taken" | "missed";

  type MedicationData = {
    date: string;
    status: StatusType;
    time?: string;
  };

  const medicationData: MedicationData[] = [
    { date: "2026-02-01", status: "taken", time: "8:00 PM" },
    { date: "2026-03-02", status: "missed", time: "8:00 PM" },
    { date: "2026-03-03", status: "taken", time: "9:00 PM" },
    { date: "2026-03-09", status: "taken", time: "9:00 PM" },
  ];

  const takenDates = ["2026-03-01", "2026-03-02"];
  const missedDates = ["2026-03-03"];

  const today = format(new Date(), "yyyy-MM-dd");

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div
          className="flex justify-between items-center mb-8 p-5 rounded-2xl 
                        bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <IconHeartHandshake size={30} stroke={2} />

            <h1 className="text-xl md:text-2xl font-bold">Medicare Connect </h1>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-white text-purple-700 hover:bg-gray-100 !curson-pointer !important"
              onClick={() => router.push("/caretaker/user")}
            >
              <i className="bi bi-person"></i> Caretaker
            </Button>
            <Button variant="destructive" onClick={() => router.push("/")}>
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center text-3xl font-bold text-gray-800 ">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back !{" "}
            </h2>
          </div>

          <p className="text-gray-500 mt-1">
            Stay consistent with your medication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card
            className="p-6 rounded-2xl shadow-lg 
                           bg-gradient-to-br from-purple-300 to-indigo-200
                           border border-purple-300 backdrop-blur-md"
          >
            <p className="text-xl font-medium ">
              <i className="bi bi-clock-history text-indigo-500"></i> Today
              Status
            </p>

            <h3 className="text-2xl font-bold mt-1 text-purple-900">
              {takenDates.includes(today) ? (
                <>
                  <Badge className="bg-blue-100 text-lg text-blue-600 border border-blue-300 px-5">
                    Pending
                  </Badge>{" "}
                </>
              ) : (
                <>
                  <Badge className="bg-green-100 text-lg text-green-600 border border-green-300 ">
                    Taken
                  </Badge>{" "}
                </>
              )}{" "}
            </h3>
          </Card>

          <Card
            className="p-6 rounded-2xl shadow-lg 
                           bg-gradient-to-br from-purple-300 to-indigo-200
                           border border-purple-300"
          >
            <p className="text-xl font-medium">
              <i className="bi bi-fire text-yellow-500"></i> Day Streak
            </p>

            <h3 className="text-2xl font-bold mt-1 text-purple-900">5 Days</h3>
          </Card>

          <Card
            className="p-6 rounded-2xl shadow-lg 
                           bg-gradient-to-br from-purple-300 to-indigo-200 
                           border border-purple-300"
          >
            <p className="text-xl  font-medium">
              <i className="bi bi-activity "></i> Consistency Rate
            </p>

            {/* <Progress value={78} className="mt-4 bg-purple-200" /> */}

            <h3 className="text-2xl mt-1 font-bold text-purple-900">78%</h3>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 rounded-2xl shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold ">
                <span>
                  <i className="bi bi-calendar-check text-l-primary"></i>
                </span>{" "}
                Medication Tracker
              </CardTitle>
            </CardHeader>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl border p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto"
              classNames={{
                table:
                  "w-full border-separate border-spacing-1 sm:border-spacing-2",

                head_row: "flex justify-between",
                row: "flex w-full justify-between mt-2",

                cell: "flex-1 flex justify-center",

                day: `
                  h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12
                  flex items-center justify-center
                  rounded-md transition-all mx-auto
                `,

                day_selected: "bg-purple-200 text-purple-800",

                day_today: "bg-blue-100 text-blue-700",

                day_outside: "text-gray-300",
              }}
              modifiers={{
                taken: medicationData
                  .filter((d) => d.status === "taken")
                  .map((d) => new Date(d.date)),

                missed: medicationData
                  .filter((d) => d.status === "missed")
                  .map((d) => new Date(d.date)),
              }}
              modifiersClassNames={{
                taken: "bg-green-100 text-green-700 border border-green-300",

                missed: "bg-red-100 text-red-600 border border-red-300",
              }}
            />

            {/* <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className="w-full"
              classNames={{
                day: "h-10 w-10 flex items-center justify-center rounded-md mx-auto",
                table: "border-separate border-spacing-2",
              }}
              modifiers={{
                taken: takenDates.map((d) => new Date(d)),
                missed: missedDates.map((d) => new Date(d)),
                today: new Date(),
              }}
              modifiersClassNames={{
                taken: "bg-green-100 text-green-700 border border-green-300",
                missed: "bg-red-100 text-red-600 border border-red-300",
                today: "bg-gray-200 text-gray-800",
              }}
            /> */}
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="p-6 rounded-2xl shadow-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">
                <i className="bi bi-capsule text-green-500"></i> Today’s
                Medication
              </h3>

              <div className="bg-gray-50 p-4 rounded-xl border mb-4">
                <p className="text-sm text-gray-500">Medicine</p>
                <h4 className="text-lg font-bold">Paracetamol 500mg</h4>

                <p className="text-sm text-gray-500 mt-2">Time</p>
                <h4 className="font-semibold">8:00 PM</h4>
              </div>

              <Button className="w-full text-lg">Mark as Taken</Button>
            </Card>

            <Card className="p-6 rounded-2xl shadow-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">
                <i className="bi bi-file-earmark-image text-indigo-400"></i>{" "}
                Upload Prescription
              </h3>

              <UploadProof />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { format } from "date-fns";

// export default function PatientPage() {
//   const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
//   const [dragValue, setDragValue] = React.useState(0);
//   const [file, setFile] = React.useState<File | null>(null);

//   const takenDates = ["2026-03-01", "2026-03-02"];
//   const missedDates = ["2026-03-03"];

//   const today = format(new Date(), "yyyy-MM-dd");

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const uploadedFile = e.dataTransfer.files[0];
//     setFile(uploadedFile);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
//
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//
//         <div
//           className="flex justify-between items-center mb-8 p-5 rounded-2xl
//                         bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
//         >
//           <h1 className="text-xl md:text-2xl font-bold">Medicare Connect</h1>

//           <div className="flex gap-3">
//             <Button className="bg-white text-purple-700 hover:bg-gray-100">
//               👨‍⚕️ Caretaker
//             </Button>
//             <Button variant="destructive">Logout</Button>
//           </div>
//         </div>

//         {/* ================= WELCOME ================= */}
//         <div className="mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Welcome back 👋
//           </h2>
//           <p className="text-gray-500 mt-1">
//             Stay consistent with your medication 💊
//           </p>
//         </div>

//         {/* ================= STATS ================= */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card className="p-6 rounded-2xl shadow-md bg-white">
//             <p className="text-sm text-gray-500">Today Status</p>
//             <h3 className="text-xl font-bold mt-2">
//               {takenDates.includes(today) ? "✅ Taken" : "❌ Pending"}
//             </h3>
//           </Card>

//           <Card className="p-6 rounded-2xl shadow-md bg-white">
//             <p className="text-sm text-gray-500">Day Streak 🔥</p>
//             <h3 className="text-xl font-bold mt-2">5 Days</h3>
//           </Card>

//           <Card className="p-6 rounded-2xl shadow-md bg-white">
//             <p className="text-sm text-gray-500">Consistency 📊</p>
//             <Progress value={78} className="mt-3" />
//             <p className="text-sm mt-2 font-medium">78%</p>
//           </Card>
//         </div>

//         {/* ================= MAIN GRID ================= */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* ================= CALENDAR ================= */}
//           <Card className="p-6 rounded-2xl shadow-lg bg-white">
//             <h3 className="text-lg font-semibold mb-4">
//               📅 Medication Calendar
//             </h3>

//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={(d) => d && setSelectedDate(d)}
//               className="w-full"
//               classNames={{
//                 day: "h-10 w-10 flex items-center justify-center rounded-md mx-auto",
//                 table: "border-separate border-spacing-2",
//               }}
//               modifiers={{
//                 taken: takenDates.map((d) => new Date(d)),
//                 missed: missedDates.map((d) => new Date(d)),
//                 today: new Date(),
//               }}
//               modifiersClassNames={{
//                 taken: "bg-green-100 text-green-700 border border-green-300",
//                 missed: "bg-red-100 text-red-600 border border-red-300",
//                 today: "bg-gray-200 text-gray-800",
//               }}
//             />
//           </Card>

//           {/* ================= RIGHT PANEL ================= */}
//           <div className="flex flex-col gap-6">
//             {/* MEDICATION */}
//             <Card className="p-6 rounded-2xl shadow-lg bg-white">
//               <h3 className="text-lg font-semibold mb-4">
//                 💊 Today’s Medication
//               </h3>

//               <div className="bg-gray-50 p-4 rounded-xl border mb-4">
//                 <p className="text-sm text-gray-500">Medicine</p>
//                 <h4 className="text-lg font-bold">Paracetamol 500mg</h4>

//                 <p className="text-sm text-gray-500 mt-2">Time</p>
//                 <h4 className="font-semibold">8:00 PM</h4>
//               </div>

//               {/* SLIDER */}
//               <input
//                 type="range"
//                 min={0}
//                 max={100}
//                 value={dragValue}
//                 onChange={(e) => setDragValue(Number(e.target.value))}
//                 className="w-full accent-purple-600 mb-4"
//               />

//               <Button disabled={dragValue < 80} className="w-full text-lg">
//                 {dragValue >= 80 ? "✅ Marked as Taken" : "Slide to confirm"}
//               </Button>
//             </Card>

//             {/* ================= FILE UPLOAD ================= */}
//             <Card className="p-6 rounded-2xl shadow-lg bg-white">
//               <h3 className="text-lg font-semibold mb-4">
//                 📂 Upload Prescription
//               </h3>

//               <div
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={handleDrop}
//                 className="border-2 border-dashed border-purple-300 rounded-xl
//                            p-6 text-center hover:bg-purple-50 transition"
//               >
//                 <p className="text-gray-500">
//                   Drag & Drop file here or click to upload
//                 </p>

//                 <input
//                   type="file"
//                   className="hidden"
//                   id="fileUpload"
//                   onChange={(e) =>
//                     setFile(e.target.files ? e.target.files[0] : null)
//                   }
//                 />

//                 <label
//                   htmlFor="fileUpload"
//                   className="inline-block mt-3 cursor-pointer text-purple-600 font-medium"
//                 >
//                   Browse File
//                 </label>

//                 {file && (
//                   <p className="mt-3 text-sm text-green-600">
//                     Uploaded: {file.name}
//                   </p>
//                 )}
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
