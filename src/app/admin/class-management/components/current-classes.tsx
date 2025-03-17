'use client'

import { useState } from 'react'
import { DonutChart } from '@/components/donut-chart'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TimelineModal from './TimelineModal'

interface ClassData {
  id: string
  title: string
  code: string
  instructor: string
  studentCount: number
  status: string
}

export default function CurrentClasses() {
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<{
    date: string
    time: string
    status: string
    remarks: string
  } | null>(null)

  // Sample data - replace with your actual data
  const classes: ClassData[] = [
    {
      id: '1',
      title: 'Computer Programming 1',
      code: 'CRP-2002024',
      instructor: 'John Doe',
      studentCount: 35,
      status: 'In Progress'
    },
    // ... more classes
  ]

  if (!selectedClass) {
    return (
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {classes.map((classItem) => (
          <Card 
            key={classItem.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedClass(classItem)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{classItem.title}</h3>
              <p className="text-sm text-gray-500">Code: {classItem.code}</p>
              <p className="text-sm text-gray-500">Instructor: {classItem.instructor}</p>
              <p className="text-sm text-gray-500">Students: {classItem.studentCount}</p>
              <div className="mt-3">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {classItem.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedClass.title}</h2>
        <Button variant="outline" onClick={() => setSelectedClass(null)}>
          Back to Classes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DonutChart />
        <div>
          <h3 className="text-xl font-semibold mb-4">Class Schedule</h3>
          <DataTable 
            columns={[
              { header: 'Date', accessorKey: 'date' },
              { header: 'Time', accessorKey: 'time' },
              { header: 'Status', accessorKey: 'status' },
              { header: 'Remarks', accessorKey: 'remarks' },
              {
                header: 'Action',
                cell: () => (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTimeline({
                      date: '2024-02-25',
                      time: '10:00 AM',
                      status: 'In Progress',
                      remarks: 'Class is going well'
                    })}
                  >
                    View Timeline
                  </Button>
                ),
              },
            ]}
            data={[]}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Student List</h3>
        <DataTable 
          columns={[
            { header: 'Name', accessorKey: 'name' },
            { header: 'Dominant Face Expression', accessorKey: 'faceExpression' },
            { header: 'Average Percentage', accessorKey: 'averagePercentage' },
          ]}
          data={[]}
        />
      </div>

      <Button variant="destructive">Close Class</Button>

      <TimelineModal 
        isOpen={!!selectedTimeline}
        onClose={() => setSelectedTimeline(null)}
        data={selectedTimeline || undefined}
      />
    </div>
  )
} 