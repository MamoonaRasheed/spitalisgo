"use client";
import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getQuestionsByExcercises } from '@/services/excerciseService';
import { createRoot } from 'react-dom/client';
import { PlayIcon, PauseIcon, MuteIcon, UnmuteIcon } from "@/icons";
import { useRouter } from 'next/navigation';
import ExerciseRenderer from "@/components/common/ExerciseRenderer";
interface Option {
    description: string;
}

interface Question {
    id: number;
    description: string;
    options: Option[];
    correct_option: number;
    question_type: string;
}

interface Exercise {
    id: number;
    chapter_id: number;
    excercise_type: string,
    title: string;
    media_url: string,
    slug: string;
    excercise_no: string;
    progress: number;
    questions: Question[];
    prev_slug: string;
    prev_chapter_id: number;
    next_slug: string;
    next_chapter_id: number;
}
export default function Exercise() {
    const router = useRouter();
    const params = useParams();
    const paramValues = Object.values(params);
    const slug = paramValues[paramValues.length - 1];

    const [exerciseData, setExercise] = useState<Exercise | null>(null);
    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const response = await getQuestionsByExcercises({ slug });
                setExercise(response.data);
            } catch (error) {
                console.error('Error fetching exercise:', error);
            }
        };

        if (slug) {
            fetchExercise();
        }
    }, [slug]);

    const containerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Event delegation for play button
        container.addEventListener('click', (e) => {
            if (e.target.closest('.play-btn')) {
                handlePlayClick();
            }
            if (e.target.closest('.mute-btn')) {
                handleMuteClick();
            }
            if (e.target.closest('.progress-bar_a')) {
                handleProgressClick(e);
            }
        });

        // Find and store the audio element reference
        const audioElement = container.querySelector('audio');
        if (audioElement) {
            audioRef.current = audioElement;

            // Add timeupdate event for progress bar
            audioElement.addEventListener('timeupdate', updateProgressBar);
            audioElement.addEventListener('loadedmetadata', updateDurationDisplay);
        }

        // Cleanup
        return () => {
            container.removeEventListener('click', () => { });
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgressBar);
                audioRef.current.removeEventListener('loadedmetadata', updateDurationDisplay);
            }
        };
    }, [exerciseData?.description]);

    const handlePlayClick = () => {
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play();
            // Update play button UI
            const playBtn = containerRef.current.querySelector('.play-btn');
            if (playBtn) {
                const root = createRoot(playBtn);
                root.render(<PlayIcon />);
            }
        } else {
            audioRef.current.pause();
            // Update play button UI
            const playBtn = containerRef.current.querySelector('.play-btn');
            if (playBtn) {
                const root = createRoot(playBtn);
                root.render(<PauseIcon />);
            }
        }
    };

    const handleMuteClick = () => {
        if (!audioRef.current) return;

        audioRef.current.muted = !audioRef.current.muted;
        // Update mute button UI
        const muteBtn = containerRef.current.querySelector('.mute-btn');
        if (muteBtn) {
            const root = createRoot(muteBtn);
            muteBtn.innerHTML = audioRef.current.muted
                ? root.render(<UnmuteIcon />)
                :
                root.render(<MuteIcon />);
        }
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current || !containerRef.current) return;

        const progressContainer = containerRef.current.querySelector('.progress-bar-container_a');
        if (!progressContainer) return;

        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pos * audioRef.current.duration;
    };

    const updateProgressBar = () => {
        if (!audioRef.current || !containerRef.current) return;

        const progressBar = containerRef.current.querySelector('.progress-bar_a');
        if (progressBar) {
            const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        // Update current time display
        const currentTimeDisplay = containerRef.current.querySelector('.current-time');
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(audioRef.current.currentTime);
        }
    };

    const updateDurationDisplay = () => {
        if (!audioRef.current || !containerRef.current) return;

        const durationDisplay = containerRef.current.querySelector('.duration');
        if (durationDisplay) {
            durationDisplay.textContent = formatTime(audioRef.current.duration);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

    const handleOptionChange = (questionId, optionId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const [showResults, setShowResults] = useState(false);
    const handleReset = () => {
        setSelectedAnswers({});
        setShowResults(false);
    };

    return (
        <section id="detailed-boxes" className="header-space">
            <div className="container">
                {(exerciseData?.excercise_type == 'image and audio') ?
                    <div className="deutsch-b1-horen">
                        <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description }} />
                    </div>
                    :
                    <div className="align-detailed-boxes">
                        <div className="title-detailed-boxes">
                            <h2>{exerciseData?.title}</h2>
                        </div>

                        <div className="listing-detailed-boxes">
                            <div className="detailed-box-main">
                                <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description }} />
                            </div>
                            {/* <SafeHtmlParser htmlString={exerciseData?.description || ""} /> */}

                            <div className="detailed-box-main">
                                {
                                    exerciseData?.excercise_type == 'dropdown' &&
                                    <>
                                        {exerciseData?.excercise_type === 'dropdown' && (
                                            <ExerciseRenderer
                                                question_description={exerciseData?.question_description || ''}
                                                questions={exerciseData?.questions?.map(q => ({
                                                    description: q.description,
                                                    options: Array.isArray(q.options) ? q.options.map(opt => opt.description) : [],
                                                    correct_option: q.correct_option
                                                })) || []}
                                            />
                                        )}
                                    </>

                                }
                                {exerciseData?.excercise_type == 'input field' &&
                                    <>
                                        <section className="listening-german deutsch-b1-horen">
                                            <div className="text-container">
                                                <div className="container">
                                                    <div className="box_border back__width">
                                                        <h2>Bestellformular – Blumenversand</h2>
                                                        <form method="post" data-gtm-form-interact-id="0">
                                                            <div className="list__">
                                                                <p className="label text p2_semibold">Vorname</p>
                                                                <div className="form_input">
                                                                    <span className="field">
                                                                        <input type="text" name="antwort_167899" className="login__form-input" placeholder="" value="" aria-label="antwort_167899" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="list__">
                                                                <p className="label text p2_semibold">Nachname</p>
                                                                <div className="form_input">
                                                                    <span className="field">
                                                                        <input type="text" name="antwort_167900" className="login__form-input" placeholder="" value="" aria-label="antwort_167900" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="list__">
                                                                <p className="label text p2_semibold">Telefonnummer</p>
                                                                <div className="form_input">
                                                                    <span className="field">
                                                                        <input type="text" name="antwort_167901" className="login__form-input" placeholder="" value="(0171) 656342223" aria-label="antwort_167901" disabled />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="list__">
                                                                <p className="label text p2_semibold">Zustelladresse</p>
                                                                <div className="form_input">
                                                                    <span className="field">
                                                                        <input type="text" name="antwort_167902" className="login__form-input" placeholder="" value="Willy-Brandt-Str. 75, 20459 Hamburg" aria-label="antwort_167902" disabled />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="list__ unset-input">
                                                                <p className="label text p2_semibold">Anlass</p>
                                                                <div className="option-field-main active">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                                <div className="option-field-main">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                                <div className="option-field-main">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                            </div>
                                                            <div className="list__ unset-input">
                                                                <p className="label text p2_semibold">Blumenart</p>
                                                                <div className="option-field-main active">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                                <div className="option-field-main">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                                <div className="option-field-main">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                            </div>
                                                            <div className="list__ unset-input">
                                                                <p className="label text p2_semibold">Lieferdatum</p>
                                                                <div className="option-field-main active">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                                <div className="option-field-main">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                                <div className="option-field-main">
                                                                    <input type="checkbox" name="option" />
                                                                    <label>falsch</label>
                                                                </div>
                                                            </div>
                                                            <div className="list__">
                                                                <p className="label text p2_semibold">Bezahlmethode</p>
                                                                <div className="form_input">
                                                                    <span className="field">
                                                                        <input type="text" name="antwort_167912" className="login__form-input" placeholder="" value="Banküberweisung" aria-label="antwort_167912" disabled />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="action-btns">
                                                                <button type="button">
                                                                    <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M1.5 8.00016L8.16667 14.6668M1.5 8.00016L8.16667 1.3335M1.5 8.00016H25.5" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                    </svg>
                                                                    Zurück
                                                                </button>
                                                                <button type="button">
                                                                    Prüfen
                                                                </button>
                                                            </div>
                                                            <input type="hidden" name="submit" value="1" />
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                }
                                {(exerciseData?.excercise_type == 'audio' || exerciseData?.excercise_type == 'text') &&
                                    <>
                                        <div className="option-fields">
                                            <div className="option-fields-align">
                                                <ul>
                                                    {exerciseData?.questions.map((question, index) => {
                                                        const selectedOption = selectedAnswers[question.id];
                                                        const correctOption = question.correct_option;

                                                        return (
                                                            <li key={question.id || index}>
                                                                <div className="title-option-field">
                                                                    <h3>{question.description}</h3>
                                                                </div>
                                                                <div className="options-main">
                                                                    {question.options.map((option) => {
                                                                        const isSelected = selectedOption === option.id;
                                                                        const isCorrect = option.id === correctOption;

                                                                        let className = "option-field-main";
                                                                        if (showResults && selectedOption !== undefined) {
                                                                            if (isSelected && !isCorrect) {
                                                                                className += " error";
                                                                            }
                                                                            if (isCorrect) {
                                                                                className += " active green-option";
                                                                            }
                                                                        }

                                                                        return (
                                                                            <div className={className} key={option.id}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`option-${question.id}`}
                                                                                    onChange={() =>
                                                                                        handleOptionChange(question.id, option.id)
                                                                                    }
                                                                                    checked={isSelected}
                                                                                />
                                                                                <label>{option.description}</label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="action-btns">
                                            <button type="button" onClick={() => router.push(`${exerciseData?.prev_slug}`)}
                                                disabled={
                                                    !exerciseData?.prev_slug ||
                                                    exerciseData?.prev_chapter_id !== exerciseData?.chapter_id
                                                }>
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
                                            {
                                                showResults ? (
                                                    <>
                                                        <button type="button" onClick={handleReset}>Zurücksetzen</button>
                                                        <button
                                                            type="button"
                                                            onClick={() => router.push(`${exerciseData?.next_slug}`)}
                                                            disabled={
                                                                !exerciseData?.next_slug ||
                                                                exerciseData?.next_chapter_id !== exerciseData?.chapter_id
                                                            }
                                                        >
                                                            Nächste
                                                        </button>

                                                    </>
                                                ) : (
                                                    <button type="button" onClick={() => setShowResults(true)}>Prüfen</button>
                                                )
                                            }
                                        </div>
                                    </>
                                }




                            </div>
                        </div>

                    </div>
                }
            </div>
        </section>
    );
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};
