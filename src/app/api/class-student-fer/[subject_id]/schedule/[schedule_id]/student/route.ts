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

    const result = await prisma.$queryRaw<Array<{          
            class_subject_id: number;
            class_schedule_id: number; 
            full_name: string;           
            dominant_expression: string;
            average: number;            
        }>>`
        WITH AggregatedData AS (
            SELECT 
                csf.class_subject_id,
                csf.class_schedule_id, 
                csf.student_user_id,               
                COUNT(CASE WHEN csf.dominant_fer = 'surprised' THEN 1 END) AS surprised_count,
                COUNT(CASE WHEN csf.dominant_fer = 'happy' THEN 1 END) AS happy_count,
                COUNT(CASE WHEN csf.dominant_fer = 'neutral' THEN 1 END) AS neutral_count,
                COUNT(CASE WHEN csf.dominant_fer = 'sad' THEN 1 END) AS sad_count,
                COUNT(CASE WHEN csf.dominant_fer = 'angry' THEN 1 END) AS angry_count,
                COUNT(CASE WHEN csf.dominant_fer = 'disgusted' THEN 1 END) AS disgusted_count,
                COUNT(CASE WHEN csf.dominant_fer = 'fearful' THEN 1 END) AS fearful_count,  
                COUNT(CASE WHEN csf.dominant_fer = 'na' THEN 1 END) AS na_count,  
                COUNT(*) AS total_count 
            FROM ClassStudentsFER csf  
            WHERE class_subject_id = ${classSubjectId}
                    AND class_schedule_id =  ${classScheduleId}           
            GROUP BY csf.class_subject_id, csf.class_schedule_id, csf.student_user_id
        )
        SELECT 
            ad.class_subject_id,
            ad.class_schedule_id,
            ud.user_id AS id,
            CONCAT(ud.first_name, ' ', COALESCE(ud.middle_name, ''), ' ', ud.last_name) AS full_name,
            COALESCE(ud.course, 'N/A') AS course,
            CASE 
                WHEN ad.surprised_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'surprised'
                WHEN ad.happy_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'happy'
                WHEN ad.neutral_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'neutral'
                WHEN ad.sad_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'sad'
                WHEN ad.angry_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'angry'
                WHEN ad.disgusted_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'disgusted'
                WHEN ad.fearful_count = GREATEST(ad.surprised_count, ad.happy_count, ad.neutral_count, ad.sad_count, ad.angry_count, ad.disgusted_count, ad.fearful_count, ad.na_count) THEN 'fearful'
                ELSE 'na'
            END AS dominantExpression,
            ROUND(GREATEST(
                (ad.surprised_count / ad.total_count) * 100, 
                (ad.happy_count / ad.total_count) * 100, 
                (ad.neutral_count / ad.total_count) * 100, 
                (ad.sad_count / ad.total_count) * 100, 
                (ad.angry_count / ad.total_count) * 100, 
                (ad.disgusted_count / ad.total_count) * 100, 
                (ad.fearful_count / ad.total_count) * 100, 
                (ad.na_count / ad.total_count) * 100
            ), 2) AS average
        FROM AggregatedData ad
        LEFT JOIN UserDetails ud ON ad.student_user_id = ud.user_id
        WHERE ad.total_count > 0
        ORDER BY ad.class_subject_id, ad.class_schedule_id, ud.user_id;
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
