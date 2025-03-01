import { TopTenCard } from "@/components/top-ten-card";
import { useEffect, useState } from "react";

interface Student {
    name: string;
    id: string;
    course: string;
}

export function TopStudents() {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        // Simulating API call - replace this with your actual API call
        const fetchStudents = async () => {
            try {
                // Replace this with your actual API endpoint
                // const response = await fetch('/api/top-students');
                // const data = await response.json();
                
                // Temporary mock data
                const mockData = [
                    { name: "Alice Johnson", id: "STU001", course: "Mathematics 101" },
                    { name: "Bob Smith", id: "STU002", course: "Physics Advanced" },
                    { name: "Carol White", id: "STU003", course: "Chemistry Lab" },
                    { name: "David Brown", id: "STU004", course: "Biology 201" },
                    { name: "Eve Wilson", id: "STU005", course: "Computer Science" },
                ];
                
                setStudents(mockData);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
        
        // Optional: Set up polling to refresh data periodically
        const interval = setInterval(fetchStudents, 30000); // Updates every 30 seconds
        
        return () => clearInterval(interval);
    }, []);

    return (
        <TopTenCard
            title="Top 10 Students with Positive Expression"
            type="students"
            data={students}
        />
    );
} 