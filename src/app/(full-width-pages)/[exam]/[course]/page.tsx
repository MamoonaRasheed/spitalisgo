"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getAllCategories } from '@/services/categoryService';
import { HorenIcon, LesenIcon, SchreibenIcon, SprechenIcon } from "@/icons";
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
    const { course } = params;
    const [categories, setCategories] = useState<CategoryResponse | null>(null); // Define state inside the component

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCategories();
    }, []);
    return (
        <section id="choose-category" className="header-space">
            <div className="container">
                <div className="align-choose-category">
                    <div className="ctaegory-choose-title">
                        <h2>
                            <span>A1 Übungen</span>
                            für Telc Prüfung
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
