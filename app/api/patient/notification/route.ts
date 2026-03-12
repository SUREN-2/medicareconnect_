import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";
import { User } from "@/backend/types/auth.types";
import { getNotificationSettings } from "@/backend/services/caretaker.service";
import { handleError } from "@/backend/lib/errorhandler";

export const GET = withAuth(async (req: NextRequest, user: User) => {
  try {
    const patientId = user.id;

    // console.log('from here'+patientId)

    const data = await getNotificationSettings(patientId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const err = handleError(error);
    return NextResponse.json(err, { status: err.statusCode });
  }
});