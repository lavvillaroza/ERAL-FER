'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TimelineModalProps {
  isOpen: boolean
  onClose: () => void
  data?: {
    date: string
    time: string
    status: string
    remarks: string
  }
}

export default function TimelineModal({ isOpen, onClose, data }: TimelineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Class Timeline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {data ? (
            <>
              <div>
                <strong>Date:</strong> {data.date}
              </div>
              <div>
                <strong>Time:</strong> {data.time}
              </div>
              <div>
                <strong>Status:</strong> {data.status}
              </div>
              <div>
                <strong>Remarks:</strong> {data.remarks}
              </div>
            </>
          ) : (
            <div>No timeline data available</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 