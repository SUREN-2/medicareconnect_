import { NextRequest, NextResponse } from "next/server";
import { addMedication, takeMedication } from "@/backend/services/patient.service";
import { User } from "@/backend/types/auth.types";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(async (req: NextRequest, user: User) => {
  try {
    const body = await req.json();
    const { name, dosage, scheduleTime } = body;

    const patientId = user.id;

    if (!name) {
      return NextResponse.json(
        { message: "Medicine name required" },
        { status: 400 }
      );
    }

    const result = await addMedication({
      patientId,
      name,
      dosage,
      scheduleTime,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
})