import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Trash2, Edit, Save } from 'lucide-react';

interface Topic {
  timeStart: string;
  timeEnd: string;
  title: string;
  description: string;
}

const LessonPlanModal = () => {
  const [schedule, setSchedule] = useState({
    date: "February 25, 2025",
    timeRange: "10:00 AM - 11:00 AM",
    lessonPlan: {
      title: "Introduction to Programming Control Structures",
      topics: [
        {
          timeStart: "10:00 AM",
          timeEnd: "10:15 AM",
          title: "Introduction and Overview",
          description: "Welcome and introduction to today's topics"
        },
        {
          timeStart: "10:15 AM",
          timeEnd: "10:35 AM",
          title: "Control Structures - If/Else",
          description: "Understanding conditional logic and decision making in programming"
        },
        {
          timeStart: "10:35 AM",
          timeEnd: "10:55 AM",
          title: "Control Structures - Loops",
          description: "Exploring for loops, while loops, and iterative processes"
        }
      ],
      materials: "Laptops, code examples handout, whiteboard markers"
    }
  });

  // State for the new lesson plan form
  const [newLessonOpen, setNewLessonOpen] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonMaterials, setNewLessonMaterials] = useState('');
  const [newTopics, setNewTopics] = useState([
    { timeStart: '', timeEnd: '', title: '', description: '' }
  ]);

  // State for editing mode
  const [editLessonOpen, setEditLessonOpen] = useState(false);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonMaterials, setEditLessonMaterials] = useState('');
  const [editTopics, setEditTopics] = useState<Topic[]>([]);

  // Handler for adding a new topic field
  const addNewTopic = (isEdit = false) => {
    const newTopic = { timeStart: '', timeEnd: '', title: '', description: '' };
    if (isEdit) {
      setEditTopics((topics) => [...topics, newTopic] as typeof topics);
    } else {
      setNewTopics((topics) => [...topics, newTopic]);
    }
  };

  // Handler for removing a topic
  const removeTopic = (index: number, isEdit = false) => {
    if (isEdit && editTopics.length > 1) {
      const updatedTopics = [...editTopics];
      updatedTopics.splice(index, 1);
      setEditTopics(updatedTopics);
    } else if (!isEdit && newTopics.length > 1) {
      const updatedTopics = [...newTopics];
      updatedTopics.splice(index, 1);
      setNewTopics(updatedTopics);
    }
  };

  // Handler for updating topic fields
  const updateTopic = (index: number, field: keyof typeof newTopics[number], value: string, isEdit = false) => {
    if (isEdit) {
      const updatedTopics = [...editTopics];
      updatedTopics[index][field] = value as never;
      setEditTopics(updatedTopics);
    } else {
      const updatedTopics = [...newTopics];
      updatedTopics[index][field] = value as never;
      setNewTopics(updatedTopics);
    }
  };

  // Handler for creating a new lesson plan
  const createNewLessonPlan = () => {
    const newPlan = {
      date: schedule.date,
      timeRange: schedule.timeRange,
      lessonPlan: {
        title: newLessonTitle,
        topics: newTopics,
        materials: newLessonMaterials
      }
    };
    
    setSchedule(newPlan);
    
    // Reset form and close modal
    resetNewLessonForm();
    setNewLessonOpen(false);
  };

  // Reset the form fields
  const resetNewLessonForm = () => {
    setNewLessonTitle('');
    setNewLessonMaterials('');
    setNewTopics([{ timeStart: '', timeEnd: '', title: '', description: '' }]);
  };

  // Handler for starting edit mode
  const startEditMode = () => {
    setEditLessonTitle(schedule.lessonPlan.title);
    setEditLessonMaterials(schedule.lessonPlan.materials);
    setEditTopics([...schedule.lessonPlan.topics] as typeof editTopics);
    setEditLessonOpen(true);
  };

  // Handler for saving edited lesson plan
  const saveEditedLessonPlan = () => {
    const updatedPlan = {
      ...schedule,
      lessonPlan: {
        title: editLessonTitle,
        topics: editTopics,
        materials: editLessonMaterials
      }
    };
    
    setSchedule(updatedPlan);
    setEditLessonOpen(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex justify-between items-start">
          <div>
            <DialogTitle>
              Lesson Plan
            </DialogTitle>
            <DialogDescription>
              {schedule.date} • {schedule.timeRange}
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startEditMode}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Dialog open={newLessonOpen} onOpenChange={setNewLessonOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> New Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Create New Lesson Plan
                  </DialogTitle>
                  <DialogDescription>
                    {schedule.date} • {schedule.timeRange}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-lesson-title">
                      Title
                    </Label>
                    <Input
                      id="new-lesson-title"
                      placeholder="Enter lesson title"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>
                      Lesson Topics
                    </Label>
                    <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                      {newTopics.map((topic, index) => (
                        <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                          <div className="flex gap-2 mb-2 items-center">
                            <Input
                              placeholder="Start time"
                              className="w-24"
                              value={topic.timeStart}
                              onChange={(e) => updateTopic(index, 'timeStart', e.target.value)}
                            />
                            <span className="flex items-center">
                              -
                            </span>
                            <Input
                              placeholder="End time"
                              className="w-24"
                              value={topic.timeEnd}
                              onChange={(e) => updateTopic(index, 'timeEnd', e.target.value)}
                            />
                            {newTopics.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeTopic(index)}
                                className="h-8 w-8 ml-auto"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                          <Input
                            placeholder="Topic title"
                            className="mb-1"
                            value={topic.title}
                            onChange={(e) => updateTopic(index, 'title', e.target.value)}
                          />
                          <Textarea
                            placeholder="Topic description"
                            className="text-sm"
                            rows={2}
                            value={topic.description}
                            onChange={(e) => updateTopic(index, 'description', e.target.value)}
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => addNewTopic()}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Topic
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-lesson-materials">
                      Materials Needed
                    </Label>
                    <Textarea
                      id="new-lesson-materials"
                      placeholder="List required materials"
                      value={newLessonMaterials}
                      onChange={(e) => setNewLessonMaterials(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewLessonOpen(false)} className="mr-2">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={createNewLessonPlan}
                    disabled={!newLessonTitle.trim()}
                  >
                    Create Plan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </DialogHeader>

        {/* Edit Lesson Modal */}
        <Dialog open={editLessonOpen} onOpenChange={setEditLessonOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit Lesson Plan
              </DialogTitle>
              <DialogDescription>
                {schedule.date} • {schedule.timeRange}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-lesson-title">
                  Title
                </Label>
                <Input
                  id="edit-lesson-title"
                  placeholder="Enter lesson title"
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  Lesson Topics
                </Label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                  {editTopics.map((topic, index) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                      <div className="flex gap-2 mb-2 items-center">
                        <Input
                          placeholder="Start time"
                          className="w-24"
                          value={topic.timeStart}
                          onChange={(e) => updateTopic(index, 'timeStart', e.target.value, true)}
                        />
                        <span className="flex items-center">
                          -
                        </span>
                        <Input
                          placeholder="End time"
                          className="w-24"
                          value={topic.timeEnd}
                          onChange={(e) => updateTopic(index, 'timeEnd', e.target.value, true)}
                        />
                        {editTopics.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeTopic(index, true)}
                            className="h-8 w-8 ml-auto"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Topic title"
                        className="mb-1"
                        value={topic.title}
                        onChange={(e) => updateTopic(index, 'title', e.target.value, true)}
                      />
                      <Textarea
                        placeholder="Topic description"
                        className="text-sm"
                        rows={2}
                        value={topic.description}
                        onChange={(e) => updateTopic(index, 'description', e.target.value, true)}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => addNewTopic(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Topic
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lesson-materials">
                  Materials Needed
                </Label>
                <Textarea
                  id="edit-lesson-materials"
                  placeholder="List required materials"
                  value={editLessonMaterials}
                  onChange={(e) => setEditLessonMaterials(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditLessonOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button 
                onClick={saveEditedLessonPlan}
                disabled={!editLessonTitle.trim()}
              >
                <Save className="h-4 w-4 mr-1" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lesson plan content */}
        <div className="pt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              {schedule.lessonPlan.title}
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Topic progression with timing during this session</h4>
              <div className="space-y-4">
                {schedule.lessonPlan.topics.map((topic, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1">
                      <div className={`h-3 w-3 rounded-full ${
                        index === 0 ? "bg-green-500" :
                        index === 1 ? "bg-blue-500" : 
                        index === 2 ? "bg-purple-500" : "bg-gray-300"
                      }`}></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        {topic.timeStart} - {topic.timeEnd}
                      </div>
                      <div className="font-medium text-gray-900">
                        {topic.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {topic.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Materials Needed</h4>
              <p className="text-sm">{schedule.lessonPlan.materials}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonPlanModal;