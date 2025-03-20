import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Trash2, Edit, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClassScheduleModel } from '@/models/classScheduleModel';
import { ClassCourseContentModel } from '@/models/classCourseContentModel';
import { getClassCourseContentByScheduleId, getClassScheduleById, updateClassCourseContentsByScheduleId } from '@/services/classScheduleAppService';
import { toast, Toaster } from "sonner";
import Loading from "@/components/loading";
import { convertTo24HourFormat, formatDate, formatTime } from '@/lib/formatTime';
import { ClassScheduleStatus } from '@/types/classScheduleStatus';

const CourseContentModal = ({ schedule, variant }: { schedule: ClassScheduleModel, variant: "student" | "teacher" }) => {  
  const [scheduleSelected, setScheduleSelected] = useState<ClassScheduleModel>(schedule);
  const [courseContents, setCourseContents] = useState<ClassCourseContentModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // State for editing mode
  const [editCourseContentOpen, setEditCourseContentOpen] = useState(false);
  const [editScheduleTopicTitle, setEditScheduleTopicTitle] = useState('');  
  const [editCourseContents, setEditCourseContents] = useState<ClassCourseContentModel[]>([]);

  useEffect(() => {
    if (!schedule?.id || !schedule?.class_subject_id) return;
    
    const fetchCourseContents = async () => {
      try {         
        const courseContentsData = await getClassCourseContentByScheduleId(schedule.id);
        if (!courseContentsData.success) {
          throw new Error(courseContentsData.message);
        }      
        setCourseContents(courseContentsData.data);
      } catch (error) {
        console.log("Error fetching class subject:", error);
        toast.error("Failed to fetch class subject!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchCourseContents();    
  }, [schedule.class_subject_id, schedule.id]);

  // State for the new lesson plan form
  const [newCourseContents, setNewCourseContents] = useState([
    {
      id: 0, // Set default value
      class_schedule_id: schedule?.id ?? 0, // Provide fallback default
      time_start: '',
      title: '',
      description: '',
      status: "upcoming", // Ensure it matches expected type
    }
  ]);

  // Handler for adding a new topic field
  const addNewCourseContent = (isEdit = false) => {
    const newCourseContent =  {
      id: 0, // Set default value
      class_schedule_id: schedule?.id ?? 0, // Provide fallback default
      time_start: '',
      title: '',
      description: '',
      status: "upcoming", // Ensure it matches expected type
    };
    if (isEdit) {
      setEditCourseContents((contents) => [...contents, newCourseContent] as typeof contents);
    } else {
      setNewCourseContents((contents) => [...contents, newCourseContent]);
    }
  };

  // Handler for removing a topic
  const removeContent = (index: number, isEdit = false) => {
    if (isEdit && editCourseContents.length > 1) {
      const updatedContents = [...editCourseContents];
      updatedContents.splice(index, 1);
      setEditCourseContents(updatedContents);
    } else if (!isEdit && newCourseContents.length > 1) {
      const updatedContents = [...newCourseContents];
      updatedContents.splice(index, 1);
      setNewCourseContents(updatedContents);
    }
  };

  // Handler for updating topic fields
  const updateContent = (index: number, field: keyof typeof newCourseContents[number], value: string, isEdit = false) => {
    if (isEdit) {      
      setEditCourseContents((prevContents) =>
        prevContents.map((content, i) =>
          i === index ? { ...content, [field]: value } : content
        )
      );
    } else {
      const updatedTopics = [...newCourseContents];
      updatedTopics[index][field] = value as never;
      setNewCourseContents(updatedTopics);
    }
  };

  // Handler for starting edit mode
  const startEditMode = () => {
    setEditScheduleTopicTitle(schedule.topic_title);    
    setEditCourseContents([...courseContents] as typeof editCourseContents);
    setEditCourseContentOpen(true);
  };

  const fetchUpdatedData = async () => {
    try {         
      const getClassSchedule = await getClassScheduleById(schedule.class_subject_id, schedule.id);
      if (!getClassSchedule.success) {
        throw new Error(getClassSchedule.message);
      }      
      setScheduleSelected(getClassSchedule.data);
    } catch (error) {
      console.log("Error fetching class schedule:", error);
      toast.error("Failed to fetch class schedule!", {
        description: error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
    
    try {         
      const courseContentsData = await getClassCourseContentByScheduleId(schedule.id);
      if (!courseContentsData.success) {
        throw new Error(courseContentsData.message);
      }      
      setCourseContents(courseContentsData.data);
    } catch (error) {
      console.log("Error fetching class subject:", error);
      toast.error("Failed to fetch class subject!", {
        description: error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  }


  // Handler for saving edited lesson plan
  const saveEditedCourseContents = async () => {        
     // Update editCourseContents with formatted time_start values
    const updatedCourseContents = editCourseContents.map(content => ({
      ...content,
      time_start: formatTime(content.time_start), // Format time_start before saving
    }));      

    try {
      const response = await updateClassCourseContentsByScheduleId(updatedCourseContents, scheduleSelected.id, editScheduleTopicTitle);
      if (response.success) {        
        await fetchUpdatedData();
        toast.success('Course contents updated successfully!');
      } else {
        toast.error('Failed to update course contents: ' + response.message);
      }
    } catch (error) {
      toast.error('Error updating course contents: ' + error);
    } finally {
      setEditCourseContentOpen(false);
    }        
  };

  // Function to validate editCourseContents
  const isEditCourseContentsValid = () => {
    if (!Array.isArray(editCourseContents) || editCourseContents.length === 0) {
      return false; // If undefined, null, or empty array, return false
    }
  
    return editCourseContents.every(content => {
      // Check if time_start, title, and description are valid (not empty)
      const isTimeValid = content.time_start?.trim() !== '';
      const isTitleValid = content.title?.trim() !== '';
      const isDescriptionValid = content.description?.trim() !== '';
  
      return isTimeValid && isTitleValid && isDescriptionValid; 
    });
  };

  return (
    <>
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
                Course Content
              </DialogTitle>
              <DialogDescription>
                {formatDate(schedule.date_schedule)} • {`${schedule.time_start} - ${schedule.time_end}`}
              </DialogDescription>
            </div>
            {schedule.status !== ClassScheduleStatus.FiNISHED  && 
              (
                variant === "teacher" && (
                  <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startEditMode}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>            
                </div>
                )                
            )}            
          </DialogHeader>

          {/* Edit Lesson Modal */}
          <Dialog open={editCourseContentOpen} onOpenChange={setEditCourseContentOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit Course Content
                </DialogTitle>
                <DialogDescription>
                  {formatDate(schedule.date_schedule)} • {`${schedule.time_start} - ${schedule.time_end}`}
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
                    value={editScheduleTopicTitle}
                    onChange={(e) => setEditScheduleTopicTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>
                    Topics
                  </Label>
                  <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                  {editCourseContents && editCourseContents.length > 0 ? (
                        editCourseContents.map((content, index) => (
                          <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                            <div className="flex gap-2 mb-2 items-center">                        
                              <Input 
                                id="time_start" 
                                type="time" 
                                value={convertTo24HourFormat(content.time_start)} 
                                className="w-32"
                                onChange={(e) => updateContent(index, 'time_start', e.target.value, true)} required />                       
                              {editCourseContents.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeContent(index, true)}
                                  className="h-8 w-8 ml-auto">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Topic title"
                              className="mb-1"
                              value={content.title}
                              onChange={(e) => updateContent(index, 'title', e.target.value, true)}
                              required />
                            <Textarea
                              placeholder="Topic description"
                              className="text-sm"
                              rows={2}
                              value={content.description}
                              onChange={(e) => updateContent(index, 'description', e.target.value, true)}
                              required/>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-[150px] w-[380px] rounded-xl" />
                        </div>
                      )}                  
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => addNewCourseContent(true)}>
                          <Plus className="h-4 w-4 mr-1" /> Add Topic
                        </Button>                                                                          
                  </div>
                </div>              
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditCourseContentOpen(false)} className="mr-2">
                  Cancel
                </Button>
                <Button 
                  onClick={saveEditedCourseContents}
                  disabled={!editScheduleTopicTitle.trim() || !isEditCourseContentsValid()}>
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Lesson plan content */}
          {isLoading ? 
            (<Loading/>) :  
            (
              courseContents && courseContents.length > 0 ? (
                <div className="pt-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Title</h4>
                    <h3 className="text-lg font-semibold">
                      {scheduleSelected.topic_title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>      
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Contents</h4>                
                      <ScrollArea className="h-[300px] sm:h-[200px] pr-4">
                        <div className="space-y-4">
                          {courseContents.map((content, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="mt-1">
                                <div className="h-3 w-3 rounded-full bg-black"></div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {content.time_start}
                                </div>
                                <div className="font-medium text-gray-900">
                                  {content.title}
                                </div>
                                <div className="text-sm text-gray-700">
                                  {content.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>                
                    </div>           
                  </div>
                </div>
              ) : (
                <div className="pt-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Titile</h4>
                    <h3 className="text-lg font-semibold">
                      {scheduleSelected.topic_title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Contents</h4>
                      <ScrollArea className="h-[300px] sm:h-[200px] pr-4">
                        <div className="space-y-4">
                          <Skeleton className="h-[150px] w-[380px] rounded-xl" />
                        </div>
                      </ScrollArea>                
                    </div>           
                  </div>
                </div>
              )
            )}          
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default CourseContentModal;