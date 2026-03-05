import { NextRequest, NextResponse } from "next/server";
import { takeMedication } from "@/backend/services/patient.service";
import { User } from "@/backend/types/auth.types";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(async (req: NextRequest, user: User) => {

  try {


    console.log('hii')
    const body = await req.json();
    const patientId = user.id

    const {medicationId, photoUrl } = body;

    console.log(body)
    console.log(patientId)

    

    if (!patientId || !medicationId) {
      return NextResponse.json(
        { message: "patientId and medicationId are required" },
        { status: 400 },
      );
    }

    const result = await takeMedication({
      patientId,
      medicationId,
      photoUrl,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
})
