"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getAllCourses } from '@/services/courseService';
interface Course {
    name: string;
    // icon: string;
    slug: string;
}

interface CourseResponse {
    data: Course[];
}

export default function Course() {
    const params = useParams();
    const { exam } = params;
    const [courses, setCourses] = useState<CourseResponse | null>(null); // Define state inside the component

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllCourses();
                setCourses(courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);
    return (
        <section id="providers" className="header-space section-space">
            <div className="container">
                <div className="align-providers">
                    <div className="ctaegory-choose-title">
                        <h2>A1 Übungen  <span>{exam}-Prüfung:</span></h2>
                    </div>
                    <div className="providers-btns">
                        {courses?.data?.map((course, index) => (
                            <a href={`${exam}/${course?.slug}`}>
                                {course?.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
