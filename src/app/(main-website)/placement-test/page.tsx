"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getAllCourses } from '@/services/courseService';
import LoadingSpinner from "@/components/loader/Loader";
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
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllCourses();
                setCourses(courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    if (courses === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <section className="header-space section-space">
            <div className="container">
                <div className="ctaegory-choose-title">
                    <h2>
                        <span>Willkommen beim Einstufungstest DaF</span>
                    </h2>
                </div>
                <div className="detailed-box-main">
                    <p>
                        Dieser niveauübergreifende Einstufungstest bewertet Ihre Sprachkenntnisse in Deutsch bis Niveau C1.
                    </p>
                    <p>
                        Nach der Auswertung erhalten Sie eine Einschätzung, auf welchem Niveau Sie sich befinden.
                    </p>
                    <ul>
                        <li className="list-style-test">Bearbeiten Sie die Aufgaben sorgfältig, es gibt keine Zeitvorgabe.</li>
                        <li className="list-style-test">Der Test besteht aus 64 Aufgaben. Lesen Sie die Anweisung zu jeder Aufgabe genau durch.</li>
                        <li className="list-style-test">Sie können die Aufgaben in der vorgesehenen Reihenfolge bearbeiten, mit „Weiter“ gelangen Sie jeweils zur nächsten, mit "Zurück" zur vorherigen Aufgabe.</li>
                        <li className="list-style-test">Oberhalb des Aufgabenfensters finden Sie die Fragenliste, mit der Sie zu den einzelnen Aufgaben gelangen können.</li>
                        <li className="list-style-test">Sie können den Test zu jeder Zeit abbrechen und auswerten lassen. Es werden alle Antworten gewertet, die Sie bis zu diesem Zeitpunkt gegeben haben.</li>
                        <li className="list-style-test">Möchten Sie den Test abschließen, klicken Sie bitte auf "Alles Einreichen", um Ihr Ergebnis zu erhalten.</li>
                    </ul>
                    <div className="auth-fields">
                        <div className="auth-fields">
                            <label htmlFor="email">Name</label>
                            <div className="input-field-align">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="example"
                                    value=""
                                />
                            </div>
                        </div>

                        <div className="auth-fields">
                            <label htmlFor="email">E-mail address</label>
                            <div className="input-field-align">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@example.com"
                                    value=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-btns">
                    <button type="button">
                        <svg
                            width="27"
                            height="16"
                            viewBox="0 0 27 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.5 8.00016L8.16667 14.6668M1.5 8.00016L8.16667 1.3335M1.5 8.00016H25.5"
                                stroke="#161616"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Zurück
                    </button>

                    {/* <button type="button">Weiter</button> */}
                    <a href="placement-test/tasks">
                        <button type="button">Zum Einstufungstest</button>
                    </a>

                </div>
            </div>
        </section>
    );
}
