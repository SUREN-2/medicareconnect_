import { getPatientStats } from "@/backend/services/patient.service";
import { successResponse, errorResponse } from "@/backend/lib/response";
import { authMiddleware } from "@/backend/middleware/auth.middleware";
import { handleError } from "@/backend/lib/errorhandler";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";
import { User } from "@/backend/types/auth.types";

export const GET = withAuth(async (req: NextRequest, user: User) => {

  try {
    // const user = await authMiddleware(req);

    
    const patientId = user.id

    if (!patientId) {
      return Response.json(errorResponse("patientId is required", 400), {
        status: 400,
      });
    }

    const stats = await getPatientStats(patientId);


    // console.log('patient' + stats?.stats)
    

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    const err = handleError(error);

    return NextResponse.json(err, { status: err.statusCode });
  }
})

