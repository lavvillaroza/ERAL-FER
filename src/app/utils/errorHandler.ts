import { ZodError } from "zod";
import { NextResponse } from "next/server";

// Properly type the error parameter
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(      
      { 
        sucess: false,
        message: `Validation error:${error.errors}`},
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { sucess: false,
        message: `Internal Server Error: ${error}`},
      { status: 500 }
    );
  }

  return NextResponse.json(
    { sucess: false,
      message: "Unknown error occurred"}, 
    { status: 500 }
  );
}
