import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const StudentEngagementTable = ({ students }: { students: { id: string; name: string; dominantExpression: string; average: number }[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">Name</TableHead>
          <TableHead className="whitespace-nowrap">Dominant Expression</TableHead>
          <TableHead className="whitespace-nowrap">Average</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student: { id: string; name: string; dominantExpression: string; average: number }) => (
          <TableRow key={student.id}>
            <TableCell className="whitespace-nowrap">{student.name}</TableCell>
            <TableCell className="whitespace-nowrap">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                student.dominantExpression === 'Happy' ? 'bg-green-100 text-green-800' :
                student.dominantExpression === 'Neutral' ? 'bg-blue-100 text-blue-800' :
                student.dominantExpression === 'Sad' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {student.dominantExpression}
              </span>
            </TableCell>
            <TableCell className="whitespace-nowrap font-medium">{student.average}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};