import { ZodError } from "zod";
import { NextResponse } from "next/server";

// Properly type the error parameter
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Validation error", errors: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
}
