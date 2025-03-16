import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, { params }: { params: { subject_id: string } }) {
  try {
    const {subject_id} = await params;
    const classSubjectId = Number(subject_id);        

    if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }      

    const result = await prisma.$queryRaw`
        WITH AvgValues AS (
            SELECT  
                A.class_subject_id,                
                A.student_user_id,
                CONCAT_WS(' ', B.first_name, B.middle_name, B.last_name) AS full_name,
                B.course,
                ROUND(AVG(A.highest_avg_value),2) AS avg_highest_value,
                A.dominant_expression
            FROM dberal.view_classStudentFERAggsWithStudentUserId A
            LEFT JOIN UserDetails B ON B.user_id = A.student_user_id
            WHERE A.class_subject_id = ${classSubjectId}                                
            GROUP BY 
                A.class_subject_id,                
                A.student_user_id,
                full_name,
                B.course,
                A.dominant_expression
        )
        SELECT * 
        FROM AvgValues
        WHERE avg_highest_value = (SELECT MAX(avg_highest_value) FROM AvgValues)
    `;

    return NextResponse.json({
        success: true,
        message: "Successfully Aggregated Overall FER data",
        data: result}, 
        { status: 200 });
    
  } catch (error) {
    console.error("Error fetching FER data:", error);
    return handleApiError(error);     
  }
}
