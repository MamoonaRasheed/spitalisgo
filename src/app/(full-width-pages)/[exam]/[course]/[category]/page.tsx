"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getChapters } from '@/services/chapterService';
import { getExcercises } from '@/services/excerciseService';
interface Chapter {
    id: number;
    title: string;
    description: string;
    progress: number;
}

interface Exercise {
    id: number;
    title: string;
    excercise_no: string;
    progress: number;
}

export default function Category() {
    const params = useParams();
    const { exam, course, category } = params;
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await getChapters({ exam, course, category });
                setChapters(response.data);
                if (response.data.length > 0) {
                    const firstChapterId = response.data[0].id;
                    setSelectedChapterId(firstChapterId);
                    fetchExercises(firstChapterId);
                }
            } catch (error) {
                console.error('Error fetching chapters:', error);
            }
        };

        if (exam && course && category) {
            fetchChapters();
        }
    }, [exam, course, category]);
    const fetchExercises = async (chapterId: number) => {
        try {
            const response = await getExcercises({ chapter_id: chapterId });
            setExercises(response.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setExercises([]); // Handle the case when no exercises are found
        }
    };
    const handleChapterClick = (chapterId: number) => {
        setSelectedChapterId(chapterId);
        fetchExercises(chapterId);
    };
    return (
        <section id="category-tabs" className="header-space">
            <div className="container">
                <div className="category-tabs-align">
                    <div className="category-tabs-list">
                        <ul>
                            {chapters?.map((chapter) => (
                                <li key={chapter.id}>
                                    <button
                                        type="button"
                                        className={selectedChapterId === chapter.id ? 'chapter active' : ''}
                                        onClick={() => handleChapterClick(chapter.id)}
                                    >
                                        {chapter?.name}
                                    </button>
                                </li>
                            ))}

                        </ul>
                    </div>

                    <div className="category-tab-content">
                        <div className="title-category-tab-content">
                            <h3>{exam} <span>{category}</span> Übungen</h3>
                        </div>

                        <div className="listing-categories-tab">
                            {exercises?.length > 0 ? (
                                exercises?.map((exercise) => (
                                    <div className="main-box-list" key={exercise.id}>
                                        <a href="#">
                                            <div className="listig-title-left">
                                                <div className="checkmark-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M4 12.0005L8.94975 16.9502L19.5572 6.34375" stroke="#F7631B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div className="title-box-category">
                                                    <p>{exercise.excercise_no}</p>
                                                    <h4>{exercise.title}</h4>
                                                </div>
                                            </div>

                                            <div className="listening-list__progress">
                                                <div
                                                    className="progress-circle"
                                                    data-progress="0"
                                                    style={{
                                                        background: 'conic-gradient(#df0000 4% 0%, #d4cdbf 0% 100%)'
                                                    }}
                                                />
                                                <span>0%</span>
                                            </div>
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p>No exercises found for this chapter.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
