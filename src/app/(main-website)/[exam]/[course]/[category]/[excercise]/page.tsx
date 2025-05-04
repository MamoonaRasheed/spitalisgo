"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { getQuestionsByExcercises, submitAnswers } from '@/services/excerciseService';
import { checkQuestionAnswers } from '@/services/questionService';
import { createRoot, Root } from 'react-dom/client';
import { PlayIcon, PauseIcon, MuteIcon, UnmuteIcon } from "@/icons";
import { useRouter } from 'next/navigation';
import ExerciseRenderer from "@/components/common/ExerciseRenderer";
import LoadingSpinner from "@/components/loader/Loader";
interface Option {
    id: number,
    description: string;
}

interface Question {
    id: number;
    description: string;
    options: Option[];
    correct_option: number;
    question_type: string;
    is_static: number;
    value: string;
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
    description: string;
    question_description: string;
}
export default function Exercise() {
    const router = useRouter();
    const params = useParams();
    const paramValues = Object.values(params);
    const slug = paramValues[paramValues.length - 1];

    const [exerciseData, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchExercise = async () => {
            try {
                if (typeof slug === 'string') {
                    const response = await getQuestionsByExcercises({ slug });
                    setExercise(response.data);
                }
            } catch (error) {
                console.error('Error fetching exercise:', error);
            } finally {
                setLoading(false);
            }
        };
    
        if (slug) {
            fetchExercise();
        }
    }, [slug]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
    
        const container = containerRef.current;
    
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
    
            if (target.closest('.play-btn')) {
                handlePlayClick();
            }
            if (target.closest('.mute-btn')) {
                handleMuteClick();
            }
            if (target.closest('.progress-bar_a')) {
                handleProgressClick(e);
            }
        };
    
        container.addEventListener('click', handleClick);
    
        // Find and store the audio element reference
        const audioElement = container.querySelector('audio');
        if (audioElement instanceof HTMLAudioElement) {
            audioRef.current = audioElement;
    
            // Add timeupdate event for progress bar
            audioElement.addEventListener('timeupdate', updateProgressBar);
            audioElement.addEventListener('loadedmetadata', updateDurationDisplay);
        }
    
        // Cleanup
        return () => {
            container.removeEventListener('click', handleClick);
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgressBar);
                audioRef.current.removeEventListener('loadedmetadata', updateDurationDisplay);
            }
        };
    }, [exerciseData?.description]);

    

    const handlePlayClick = () => {
        if (!audioRef.current || !containerRef.current) return;

        const playBtn = containerRef.current.querySelector('.play-btn') as HTMLElement;
        if (!playBtn) return;

        // Store the root once, as a property on the element or in a ref
        let root = (playBtn as any)._reactRoot as Root;

        if (!root) {
            root = createRoot(playBtn);
            (playBtn as any)._reactRoot = root;
        }

        if (audioRef.current.paused) {
            audioRef.current.play();
            root.render(<PauseIcon />);
        } else {
            audioRef.current.pause();
            root.render(<PlayIcon />);
        }
    };
    





    
    const handleMuteClick = () => {
        if (!audioRef.current || !containerRef.current) return;
    
        audioRef.current.muted = !audioRef.current.muted;
    
        const muteBtn = containerRef.current.querySelector('.mute-btn') as HTMLElement;
        if (!muteBtn) return;
    
        let root = (muteBtn as any)._reactRoot as Root;
    
        if (!root) {
            root = createRoot(muteBtn);
            (muteBtn as any)._reactRoot = root;
        }
    
        root.render(audioRef.current.muted ? <MuteIcon /> : <UnmuteIcon />);
    };
    

    const handleProgressClick = (e: MouseEvent) => {
        if (!audioRef.current || !containerRef.current) return;
    
        const progressContainer = containerRef.current.querySelector<HTMLElement>('.progress-bar-container_a');
        if (!progressContainer) return;
    
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (!isNaN(audioRef.current.duration)) {
            audioRef.current.currentTime = pos * audioRef.current.duration;
        }
    };
    
    const updateProgressBar = () => {
        if (!audioRef.current || !containerRef.current) return;
    
        const progressBar = containerRef.current.querySelector<HTMLElement>('.progress-bar_a');
        if (progressBar && !isNaN(audioRef.current.duration)) {
            const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    
        const currentTimeDisplay = containerRef.current.querySelector<HTMLElement>('.current-time');
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(audioRef.current.currentTime);
        }
    };

    const updateDurationDisplay = () => {
        if (!audioRef.current || !containerRef.current) return;
    
        const durationDisplay = containerRef.current.querySelector<HTMLElement>('.duration');
        if (durationDisplay && !isNaN(audioRef.current.duration)) {
            durationDisplay.textContent = formatTime(audioRef.current.duration);
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | number[] | string>>({});


    const handleOptionChange = (questionId: number, optionId: number, type: string) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            const prev = prevSelectedAnswers[questionId];

            if (type === 'checkbox') {
                const current = Array.isArray(prev) ? prev : [];
                const updated = current.includes(optionId)
                    ? current.filter(id => id !== optionId)
                    : [...current, optionId];

                return {
                    ...prevSelectedAnswers,
                    [questionId]: updated,
                };
            } else {
                return {
                    ...prevSelectedAnswers,
                    [questionId]: optionId,
                };
            }
        });
    };


    useEffect(() => {
        console.log(selectedAnswers, "selectedAnswers updated");
    }, [selectedAnswers]);


    const [showResults, setShowResults] = useState(false);
    const [checkResults, setCheckResults] = useState<Record<number, boolean>>({});

    const handleCheck = async () => {
        try {
            setLoading(true);
            const payload = {
                question_answers: exerciseData?.questions
                    .filter((question) => selectedAnswers.hasOwnProperty(question.id))
                    .map((question) => ({
                        question_id: question.id,
                        answer: selectedAnswers[question.id],
                    })) || [],
            };

            console.log(payload, "payload");
            const response = await checkQuestionAnswers(payload);

            const mappedResults = response.correct_answers.reduce((acc: Record<number, boolean | { option_id: number, is_correct: boolean }[]>, item: any) => {
                acc[item.question_id] = item.answers ?? item.is_correct;
                return acc;
            }, {});

            setCheckResults(mappedResults);
            setShowResults(true);
        } catch (error) {
            console.error('Error submitting answers:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log("checkResults p", checkResults);
    }, [checkResults]);
    const handleReset = () => {
        setSelectedAnswers({});
        setShowResults(false);
    };

    const handleSubmitAnswers = async (slug: string | undefined) => {
        if (!slug) {
            console.error("Slug is undefined. Cannot navigate.");
            return;
        }
    
        try {
            setLoading(true); // Show loading state
            const result = await submitAnswers(selectedAnswers);
            console.log('Answers submitted:', result);
            console.log('Navigating to slug:', slug);
    
            await router.push(`${slug}`); // Navigate after submission
        } catch (error: any) {
            console.error('Error submitting answers:', error?.message || error);
            alert(`Error: ${error?.message || "Something went wrong."}`);
        } finally {
            setLoading(false); // End loading state
        }
    };
    
    return (
        loading ? (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        ) : (
            <section id="detailed-boxes" className="header-space">
                <div className="container">
                    {(exerciseData?.excercise_type == 'image and audio') ?
                        <div className="deutsch-b1-horen">
                            <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description || ''}} />
                        </div>
                        :
                        <div className="align-detailed-boxes">
                            <div className="title-detailed-boxes">
                                <h2>{exerciseData?.title}</h2>
                            </div>

                            <div className="listing-detailed-boxes">
                                <div className="detailed-box-main">
                                    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description || ''}} />
                                </div>
                                {/* <SafeHtmlParser htmlString={exerciseData?.description || ""} /> */}

                                <div className="detailed-box-main">
                                    {
                                        exerciseData?.excercise_type === 'dropdown' && (
                                            <ExerciseRenderer
                                                question_description={exerciseData?.question_description || ''}
                                                questions={exerciseData?.questions?.map(q => ({
                                                    question_id: q.id,
                                                    description: q.description,
                                                    options: Array.isArray(q.options) ? q.options.map(opt => opt.description) : [],
                                                    option_q: Array.isArray(q.options) ? q.options.map(opt => ({
                                                        id: opt.id, description: opt.description
                                                    })) : [],
                                                    correct_option: q.correct_option,
                                                    showResults: showResults,
                                                })) || []}
                                                selectedAnswers={selectedAnswers}
                                                onAnswerChange={handleOptionChange}
                                                checkResults={checkResults} // Fixed: Pass checkResults directly, not as an object
                                            />
                                        )}
                                    {exerciseData?.excercise_type == 'input field' &&
                                        <>
                                            <section className="listening-german deutsch-b1-horen">
                                                <div className="text-container">
                                                    <div className="container">
                                                        <div className="box_border back__width">
                                                            <h2>{exerciseData?.question_description || ''}</h2>
                                                            <form method="post" data-gtm-form-interact-id="0">
                                                                {exerciseData?.questions?.map((question, index) => {
                                                                    const selected = selectedAnswers[question.id];

                                                                    return (
                                                                        <div key={index} className="list__ unset-input">
                                                                            <p className="label text p2_semibold">{question?.description}</p>

                                                                            {/* ✅ Checkbox question (multiple options) */}
                                                                            {question?.question_type === 'radio' && question.options.map((option, idx) => {
                                                                                // Check result for current question
                                                                                const answers = (Array.isArray(checkResults[question.id]) ? checkResults[question.id] : []) as Array<{option_id: number; is_correct: boolean}>;
                                                                                const answerResult = answers.find((ans) => ans.option_id === option.id);
                                                                                const isChecked = Array.isArray(selected) && selected.includes(option.id);
                                                                                const isCorrect = answerResult?.is_correct === true;

                                                                                return (
                                                                                    <div key={idx} className={`option-field-main ${showResults && isChecked ? (isCorrect ? 'border-green' : 'border-red') : ''}`}>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            name={`option_${question.id}_${option.id}`}
                                                                                            checked={isChecked}
                                                                                            onChange={() => handleOptionChange(question.id, option.id, 'checkbox')}
                                                                                        />
                                                                                        <label>{option.description}</label>
                                                                                    </div>
                                                                                );
                                                                            })}




                                                                            {/* ✅ Text input question */}
                                                                            {(question?.question_type === 'input_field' && question?.is_static != 1) && (
                                                                                <div className="form_input">
                                                                                    <span className="field">
                                                                                        <input
                                                                                            type="text"
                                                                                            name={`antwort_${question?.id ?? index}`}
                                                                                            className={`login__form-input ${showResults ? (checkResults[question.id] === true ? 'border-green' : 'border-red') : ''}`}
                                                                                            placeholder=""
                                                                                            aria-label={`antwort_${question?.id ?? index}`}
                                                                                            value={typeof selected === 'string' ? selected : ''}
                                                                                            onChange={(e) =>
                                                                                                setSelectedAnswers((prev) => ({
                                                                                                    ...prev,
                                                                                                    [question.id]: e.target.value,
                                                                                                }))
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            )}


                                                                            {(question?.question_type === 'input_field' && question?.is_static == 1) && (
                                                                                <div className="form_input">
                                                                                    <span className="field">
                                                                                        <input
                                                                                            type="text"
                                                                                            name={`antwort_${question?.id ?? index}`}
                                                                                            className="login__form-input"
                                                                                            placeholder=""
                                                                                            aria-label={`antwort_${question?.id ?? index}`}
                                                                                            value={question?.value}
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}



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
                                                            const isCorrect = checkResults?.[question.id];
                                                            return (
                                                                <li key={question.id || index}>
                                                                    <div className="title-option-field">
                                                                        <h3>{question.description}</h3>
                                                                    </div>
                                                                    <div className="options-main">
                                                                        {question.options.map((option) => {
                                                                            const isSelected = selectedOption === option.id;

                                                                            let className = "option-field-main";

                                                                            if (showResults && isSelected !== undefined) {
                                                                                if (isSelected && isCorrect) {
                                                                                    className += " active green-option";
                                                                                }
                                                                                if (isSelected && isCorrect === false) {
                                                                                    className += " error";
                                                                                }
                                                                            }
                                                                            return (
                                                                                <div className={className} key={option.id}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`option-${question.id}`}
                                                                                        onChange={() => handleOptionChange(question.id, option.id, 'radio')}
                                                                                        checked={isSelected}
                                                                                        disabled={showResults}
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


                                        </>
                                    }

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
                                                        onClick={() => handleSubmitAnswers(exerciseData?.next_slug)}  // Wrap function call
                                                        disabled={
                                                            !exerciseData?.next_slug ||
                                                            exerciseData?.next_chapter_id !== exerciseData?.chapter_id
                                                        }
                                                    >
                                                        Nächste
                                                    </button>


                                                </>
                                            ) : (
                                                <button type="button" onClick={handleCheck}>Prüfen</button>
                                            )
                                        }
                                    </div>


                                </div>
                            </div>

                        </div>
                    }
                </div>
            </section>
        )
    );
}
