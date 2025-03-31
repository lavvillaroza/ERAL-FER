import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
/**
 * GET: Fetch all class subjects
 */
export async function GET(req: NextRequest, { params }: { params: { teacher_user_id: string } }) {
  try {
    const {teacher_user_id} = await params;
    const teacherUserId = Number(teacher_user_id);    

    if (isNaN(teacherUserId)) {
        return NextResponse.json({ message: "Invalid Teacher User Id" }, { status: 400 });
    }    

    const result = await prisma.$queryRaw<{ class_subject_id: number; name: string; students: number; surprised: number; 
        happy: number; neutral: number; sad: number; angry: number; disgusted: number; 
        fearful: number; na: number; total_positive: number; }[]>`
        WITH AggregatedData AS (
            SELECT 
                class_subject_id,
                COUNT(CASE WHEN dominant_fer = 'surprised' THEN 1 END) AS surprised_count,
                COUNT(CASE WHEN dominant_fer = 'happy' THEN 1 END) AS happy_count,
                COUNT(CASE WHEN dominant_fer = 'neutral' THEN 1 END) AS neutral_count,
                COUNT(CASE WHEN dominant_fer = 'sad' THEN 1 END) AS sad_count,
                COUNT(CASE WHEN dominant_fer = 'angry' THEN 1 END) AS angry_count,
                COUNT(CASE WHEN dominant_fer = 'disgusted' THEN 1 END) AS disgusted_count,
                COUNT(CASE WHEN dominant_fer = 'fearful' THEN 1 END) AS fearful_count,     
                COUNT(CASE WHEN dominant_fer = 'na' THEN 1 END) AS na_count,
                COUNT(*) AS total_count -- Total number of records per subject
            FROM ClassStudentsFER
            GROUP BY class_subject_id
            ), 
            CountStudentsPerSubject AS (
            SELECT 		
                A.class_subject_id, 
                B.name, 
                COUNT(A.student_id) AS students_enrolled
            FROM ClassStudents AS A
            INNER JOIN ClassSubject AS B ON B.id = A.class_subject_id
            WHERE B.teacher_user_id = ${teacherUserId}
            GROUP BY A.class_subject_id, B.name
            )
            SELECT 
                AD.class_subject_id,
                CSS.name,
                CSS.students_enrolled AS students, 
                ROUND((AD.surprised_count / NULLIF(AD.total_count, 0)) * 100, 2) AS surprised,
                ROUND((AD.happy_count / NULLIF(AD.total_count, 0)) * 100, 2) AS happy,
                ROUND((AD.neutral_count / NULLIF(AD.total_count, 0)) * 100, 2) AS neutral,
                ROUND((AD.sad_count / NULLIF(AD.total_count, 0)) * 100, 2) AS sad,
                ROUND((AD.angry_count / NULLIF(AD.total_count, 0)) * 100, 2) AS angry,
                ROUND((AD.disgusted_count / NULLIF(AD.total_count, 0)) * 100, 2) AS disgusted,
                ROUND((AD.fearful_count / NULLIF(AD.total_count, 0)) * 100, 2) AS fearful,
                ROUND((AD.na_count / NULLIF(AD.total_count, 0)) * 100, 2) AS na,
                (ROUND((AD.surprised_count / NULLIF(AD.total_count, 0)) * 100, 2) +
                ROUND((AD.happy_count / NULLIF(AD.total_count, 0)) * 100, 2) +
                ROUND((AD.neutral_count / NULLIF(AD.total_count, 0)) * 100, 2)) AS total_positive
            FROM AggregatedData AS AD
            INNER JOIN CountStudentsPerSubject AS CSS ON CSS.class_subject_id = AD.class_subject_id
            HAVING total_positive > 50
            ORDER BY total_positive DESC
            `;

    const formattedResult = result.map((row: { class_subject_id: number; name: string; students: number; surprised: number; 
                happy: number; neutral: number; sad: number; angry: number; disgusted: number; 
                fearful: number; na: number; total_positive: number; }) => ({
    class_subject_id: Number(row.class_subject_id),
    name: row.name,
    students: Number(row.students), 
    surprised: Number(row.surprised),
    happy: Number(row.happy),
    neutral: Number(row.neutral),
    sad: Number(row.sad),
    angry: Number(row.angry),
    disgusted: Number(row.disgusted),
    fearful: Number(row.fearful),
    na: Number(row.na),
    total_positive: Number(row.total_positive)
    }));
    
    return NextResponse.json({
        success: true,
        message: "Successfully fetched data",
        data: formattedResult}, 
        { status: 200 });
  } catch (error) {    
    return handleApiError(error);
  }
}
