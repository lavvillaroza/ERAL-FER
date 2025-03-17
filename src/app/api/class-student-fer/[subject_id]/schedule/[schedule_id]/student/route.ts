import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, { params }: { params: { subject_id: string, schedule_id: string} }) {
  try {
    const {subject_id, schedule_id} = await params;
    const classSubjectId = Number(subject_id);
    const classScheduleId = Number(schedule_id);    

    if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classScheduleId)) {
        return NextResponse.json({ message: "Invalid Class Schedule Id" }, { status: 400 });
    }    

    const result = await prisma.$queryRaw`       
        WITH AvgValues AS (
            SELECT  
                A.class_subject_id,
                A.class_schedule_id,
                A.student_user_id,
                CONCAT_WS(' ', B.first_name, B.middle_name, B.last_name) AS full_name,
                B.course,
                ROUND(AVG(A.highest_avg_value),2) AS avg_highest_value,
                A.dominant_expression,
                ROW_NUMBER() OVER (PARTITION BY A.student_user_id ORDER BY AVG(A.highest_avg_value) DESC) AS rn
            FROM dberal.view_classStudentFERAggsWithStudentUserId A
            LEFT JOIN UserDetails B ON B.user_id = A.student_user_id
            WHERE A.class_subject_id = ${classSubjectId}
                AND A.class_schedule_id = ${classScheduleId}              
            GROUP BY 
                A.class_subject_id,
                A.class_schedule_id,
                A.student_user_id,
                B.first_name, B.middle_name, B.last_name,
                B.course,
                A.dominant_expression
        )
        SELECT student_user_id AS id, full_name, course, avg_highest_value AS average, dominant_expression AS dominantExpression
        FROM AvgValues
        WHERE rn = 1
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
