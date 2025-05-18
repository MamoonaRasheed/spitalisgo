"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getAllCategories } from '@/services/categoryService';
import { HorenIcon, LesenIcon, SchreibenIcon, SprechenIcon } from "@/icons";
import LoadingSpinner from "@/components/loader/Loader";
interface Category {
    id: number,
    name: string;
    // icon: string;
    slug: string;
}

interface CategoryResponse {
    data: Category[];
}


export default function Course() {
    const params = useParams();
    const { exam, course } = params;
    const [categories, setCategories] = useState<CategoryResponse | null>(null); // Define state inside the component
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    if (categories === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <section id="choose-category" className="header-space">
            <div className="container">
                <div className="align-choose-category">
                    <div className="ctaegory-choose-title">
                        <h2>
                            <span>{exam} Übungen</span>
                            für {course} Prüfung
                        </h2>
                    </div>
                    <div className="choose-category-boxes-align">
                        {categories?.data.map((category, index) => (
                            <div key={category?.id || index} className="choose-category-box">
                                <a href={`${course}/${category?.slug}`}>
                                    {
                                        category?.slug === 'horen' ? (
                                            <HorenIcon />
                                        ) : category?.slug === 'lesen' ? (
                                            <LesenIcon />
                                        ) : category?.slug === 'schreiben' ? (
                                            <SchreibenIcon />
                                        ) : category?.slug === 'sprechen' ? (
                                            <SprechenIcon />
                                        ) : null
                                    }

                                    {category?.name}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
