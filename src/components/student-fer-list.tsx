"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClassStudentFERAggStudentModel } from "@/models/classStudentFERAggStudentModel";
import { ChevronDown, Filter } from "lucide-react";
import Image from "next/image";

type Expression = "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "neutral" | "na";

const expressions: Expression[] = ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral", "na"];

const getExpressionColor = (expression: Expression) => {
  switch (expression) {
    case "happy":
      return "hsl(120, 90%, 50%)";
    case "sad":
      return "hsl(240, 90%, 50%)";
    case "angry":
      return "hsl(0, 90%, 50%)";
    case "fearful":
      return "hsl(280, 90%, 50%)";
    case "disgusted":
      return "hsl(60, 90%, 50%)";
    case "surprised":
      return "hsl(30, 90%, 50%)";
    case "neutral":
      return "hsl(210, 90%, 50%)";
    case "na":
      return "hsl(0, 0%, 50%)";
  }
};

export function StudentsFERList({ students }: { students: ClassStudentFERAggStudentModel[] }) {

  console.log("STUDENTS",students);
  const [search, setSearch] = useState("");
  const [selectedExpressions, setSelectedExpressions] = useState<Expression[]>(expressions);

  const filteredStudents = students.filter((student) => {
    const studentExpression = student.dominantExpression.toLowerCase() as Expression;
    return (
      student.full_name.toLowerCase().includes(search.toLowerCase()) &&
      selectedExpressions.includes(studentExpression)
    );
  });

  const toggleExpression = (expression: Expression) => {
    setSelectedExpressions((prev) =>
      prev.includes(expression) ? prev.filter((e) => e !== expression) : [...prev, expression]
    );
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-2 flex flex-col gap-2">
        <CardTitle className="flex flex-col items-center pb-2">Students</CardTitle>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="flex flex-col gap-2">
                {expressions.map((expression) => (
                  <div key={expression} className="flex items-center gap-2">
                    <Checkbox
                      id={expression}
                      checked={selectedExpressions.includes(expression)}
                      onCheckedChange={() => toggleExpression(expression)}
                    />
                    <label htmlFor={expression} className={getExpressionColor(expression)}>
                      {expression.charAt(0).toUpperCase() + expression.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pb-0">
        <ScrollArea className="h-full max-h-[400px] pr-2">
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const studentExpression = student.dominantExpression.toLowerCase() as Expression;
                return (
                  <Card key={student.id} className="shadow-lg">
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10">
                            <Image
                              src="/images/user.png"
                              alt={student.full_name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{student.full_name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>Dominant Expression:</span>
                              <div className={`flex items-center gap-1 text-sm ${getExpressionColor(studentExpression)}`}>
                                {studentExpression.charAt(0).toUpperCase() + studentExpression.slice(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-default font-bold">{student.average}%</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center text-2xl text-gray-500 py-10">No students found</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
