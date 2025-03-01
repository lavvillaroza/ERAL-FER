'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Select } from '@/components/ui/select'

export default function AddClassForm() {  
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const days = ['M', 'T', 'W', 'TH', 'F', 'S']

  return (
    <form className="space-y-6">
      <div>
        <label className="block mb-2">Name of Class</label>
        <Input type="text" placeholder="Enter class name" />
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <Textarea placeholder="Enter class description" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Start Date</label>
          <DatePicker />
        </div>
        <div>
          <label className="block mb-2">End Date</label>
          <DatePicker />
        </div>
      </div>

      <div>
        <label className="block mb-2">Schedule Days</label>
        <div className="flex gap-4">
          {days.map((day) => (
            <div key={day} className="flex items-center">
              <Checkbox
                id={day}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedDays([...selectedDays, day])
                  } else {
                    setSelectedDays(selectedDays.filter((d) => d !== day))
                  }
                }}
              />
              <label htmlFor={day} className="ml-2">{day}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Assign Teacher</label>
        <Select>
          {/* Teacher options will be populated from API */}
        </Select>
      </div>

      <Button type="submit">Create Class</Button>
    </form>
  )
} 