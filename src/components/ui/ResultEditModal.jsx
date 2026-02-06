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
import { toast } from "react-toastify";

const ResultEditModal = ({ isOpen, onClose, studentData, onSave }) => {
    const [subjects, setSubjects] = useState([]);
    const [fullUserData, setFullUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch fresh data when modal opens or studentData changes
    useEffect(() => {
        const fetchUser = async () => {
            if (isOpen && studentData) {
                setLoading(true);
                try {
                    const res = await axios.get(`https://erp-college-project.onrender.com/users/${studentData.studentId || studentData.id}`);
                    setFullUserData(res.data);
                    
                    // Find the specific exam form
                    // studentData might be the flattened object from Dashboard, so it has 'semester'
                    // OR it might be a student object if passed from elsewhere.
                    // Let's assume dashboard passes the flattened object with 'semester'.
                    const semester = studentData.semester || studentData.examForm?.semester;
                    
                    if (res.data.examHistory) {
                        const exam = res.data.examHistory.find(e => e.semester === semester);
                        if (exam && exam.subjects) {
                            setSubjects(exam.subjects);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user details", error);
                    toast.error("Failed to load student data");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [isOpen, studentData]);

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
        if (!fullUserData || !subjects.length) return;

        try {
            const semester = studentData.semester || studentData.examForm?.semester;
            
            // Update the specific exam in history
            const updatedHistory = fullUserData.examHistory.map(exam => {
                if (exam.semester === semester) {
                    return { ...exam, subjects: subjects };
                }
                return exam;
            });

            await axios.patch(`https://erp-college-project.onrender.com/users/${fullUserData.id}`, {
                examHistory: updatedHistory,
                // Also update legacy examForm if it matches, to keep things in sync just in case? 
                // No, let's move away from it.
            });

            toast.success("Result updated successfully");
            onSave(); // Refresh parent data
            onClose();
        } catch (error) {
            console.error("Failed to save marks", error);
            toast.error("Failed to save marks");
        }
    };

    if (!studentData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Result for {studentData.studentName || studentData.name}</DialogTitle>
                </DialogHeader>
                
                {loading ? (
                    <div className="py-8 text-center">Loading...</div>
                ) : (
                    <div className="py-4">
                        <p className="mb-4 text-sm text-muted-foreground">Semester: {studentData.semester || studentData.examForm?.semester}</p>
                        
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResultEditModal;
