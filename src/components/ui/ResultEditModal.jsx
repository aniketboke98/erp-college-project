import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import axios from 'axios';

const ResultEditModal = ({ isOpen, onClose, studentData, onSave }) => {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (studentData && studentData.examForm && studentData.examForm.subjects) {
            setSubjects(studentData.examForm.subjects);
        }
    }, [studentData]);

    const handleMarkChange = (index, field, value) => {
        const newSubjects = [...subjects];
        newSubjects[index][field] = Number(value);
        
        // Auto-calculate total
        const internal = newSubjects[index].internal || 0;
        const external = newSubjects[index].external || 0;
        newSubjects[index].total = internal + external;

        setSubjects(newSubjects);
    };

    const handleSave = async () => {
        try {
            const updatedExamForm = {
                ...studentData.examForm,
                subjects: subjects
            };

            await axios.patch(`http://localhost:3000/users/${studentData.id}`, {
                examForm: updatedExamForm
            });

            onSave(); // Refresh parent data
            onClose();
        } catch (error) {
            console.error("Failed to save marks", error);
            alert("Failed to save marks");
        }
    };

    if (!studentData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Result for {studentData.name}</DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <p className="mb-4 text-sm text-muted-foreground">Semester: {studentData.examForm?.semester}</p>
                    
                    <div className="space-y-4">
                        {subjects.map((subject, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 items-center border-b pb-4 last:border-0">
                                <div className="font-medium col-span-1">{subject.name}</div>
                                
                                <div className="col-span-1">
                                    <label className="text-xs text-muted-foreground block mb-1">Internal (Max 30)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border rounded px-2 py-1 text-sm"
                                        value={subject.internal}
                                        max={30}
                                        onChange={(e) => handleMarkChange(index, 'internal', e.target.value)}
                                    />
                                </div>
                                
                                <div className="col-span-1">
                                    <label className="text-xs text-muted-foreground block mb-1">External (Max 70)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border rounded px-2 py-1 text-sm"
                                        value={subject.external}
                                        max={70}
                                        onChange={(e) => handleMarkChange(index, 'external', e.target.value)}
                                    />
                                </div>

                                <div className="col-span-1 text-center">
                                     <label className="text-xs text-muted-foreground block mb-1">Total</label>
                                     <span className="font-bold">{subject.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResultEditModal;
