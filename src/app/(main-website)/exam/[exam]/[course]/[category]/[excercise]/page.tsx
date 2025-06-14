"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from 'next/navigation';
import { getQuestionsByExcercises, submitAnswers } from '@/services/excerciseService';
import { checkQuestionAnswers } from '@/services/questionService';
import { createRoot, Root } from 'react-dom/client';
import { PlayIcon, PauseIcon, MuteIcon, UnmuteIcon } from "@/icons";
import ExerciseRenderer from "@/components/common/ExerciseRenderer";
import LoadingSpinner from "@/components/loader/Loader";
import { toast } from 'react-toastify';
interface Option {
    id: number,
    description: string;
    is_correct?: boolean;
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
    const pathname = usePathname();
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
                    console.log("response of exercise data in use effect=-=-=-=-=-=-00=-=-", response.data);
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
    const [showResults, setShowResults] = useState(false);
    const [checkResults, setCheckResults] = useState<Record<number, boolean>>({});
    const [checkDropdownResults, setCheckDropdownResults] = useState<Record<number, { option_id: number; is_correct: boolean }[]>>({});


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
            if (target.closest('.progress-bar-container_a')) {
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
    }, [exerciseData?.description, showResults]);

    useEffect(() => {
        console.log('exerciseData------>', exerciseData);
    }, [exerciseData])

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
            root.render(<PlayIcon />);
        } else {
            audioRef.current.pause();
            root.render(<PauseIcon />);

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

        root.render(audioRef.current.muted ? <UnmuteIcon /> : <MuteIcon />);
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

            console.log("exerciseData in handle check--------", exerciseData);
            console.log("payload in handle check--------", payload);

            const response = await checkQuestionAnswers(payload);
            const { correct_answers } = response.data;

            if (exerciseData?.excercise_type === 'dropdown') {
                const mappedResults = correct_answers.reduce(
                    (acc: Record<number, { option_id: number, is_correct: boolean }[]>, item: any) => {
                        // Ensure we always use the array format, even if the response gives us a boolean
                        acc[item.question_id] = Array.isArray(item.answers)
                            ? item.answers
                            : [{ option_id: selectedAnswers[item.question_id], is_correct: item.is_correct }];
                        return acc;
                    },
                    {}
                );
                setCheckDropdownResults(mappedResults);
            }
            else {
                const mappedResults = correct_answers.reduce(
                    (acc: Record<number, boolean>, item: any) => {
                        acc[item.question_id] = item.is_correct;
                        return acc;
                    },
                    {}
                );
                setCheckResults(mappedResults);
            }

            setShowResults(true);
            handleSubmitAnswers()
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


    const handleSubmitAnswers = async () => {
        try {
            setLoading(true);
            const hasAnswers = Object.keys(selectedAnswers).length > 0;
            console.log("handleSubmitAnswers--- hasAnswers", selectedAnswers, hasAnswers);

            if (hasAnswers) {
                const payload = {
                    exerciseId: exerciseData?.id || '',
                    answers: selectedAnswers,
                };

                const result = await submitAnswers(payload);
                console.log('Answers submitted:', result);
            } else if (exerciseData) {
                console.log("No answers to submit for this exercise.");
                const payload = {
                    exerciseId: exerciseData?.id || '',
                    answers: {},
                };
                const result = await submitAnswers(payload);
            }
        } catch (error: any) {
            console.error('Error submitting answers:', error?.message || error);
            toast.error(error?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };



    const goToPrevious = () => {
        if (exerciseData?.prev_slug) {
            router.push(`${exerciseData.prev_slug}`);
        } else {
            // Remove the last segment from the current URL
            const segments = pathname.split('/');
            segments.pop(); // remove the last segment
            const parentPath = segments.join('/') || '/'; // fallback to root if empty
            router.push(parentPath);
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
                        <>
                            <div className="deutsch-b1-horen">
                                <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description || '' }} />
                            </div>
                            <div className="action-btns flex flex-wrap gap-2 items-center justify-start">

                                {/* WhatsApp Button */}



                                <button type="button" onClick={goToPrevious}>
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

                                {showResults ? (
                                    <>
                                        <button type="button" onClick={handleReset}>Zurücksetzen</button>
                                        <button
                                            type="button" onClick={() => router.push(exerciseData?.next_slug || '/')}
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
                                )}
                                <a
                                    href={`https://wa.me/491234567890?text=Ich arbeite an der Übung: ${encodeURIComponent(exerciseData?.title || '')}. Hilf mir dabei.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm md:text-base transition duration-200 h-10"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20.52 3.48A11.92 11.92 0 0012 .01 12 12 0 000 12a11.89 11.89 0 001.66 6L0 24l6.4-1.68A12 12 0 1012 .01a11.9 11.9 0 008.52 3.47zM12 22a10.16 10.16 0 01-5.21-1.43l-.37-.22-3.81 1 .99-3.7-.24-.38A9.93 9.93 0 012.05 12 9.94 9.94 0 1112 22zm5.46-7.3c-.3-.15-1.75-.86-2.02-.96s-.47-.15-.67.15-.77.96-.94 1.15-.35.22-.65.07a8.26 8.26 0 01-2.43-1.5 9.22 9.22 0 01-1.71-2.12c-.18-.3 0-.46.13-.6s.3-.34.45-.51.2-.3.3-.5.05-.38-.02-.53-.66-1.58-.9-2.17-.5-.5-.67-.5h-.56c-.2 0-.53.08-.8.38a3.35 3.35 0 00-1.03 2.5 5.88 5.88 0 001.24 2.47 13.49 13.49 0 005.26 4.72c.73.3 1.3.47 1.75.6a4.19 4.19 0 001.92.12 3.2 3.2 0 002.1-1.5 2.6 2.6 0 00.18-1.5c-.07-.13-.25-.2-.54-.35z" />
                                    </svg>
                                    WhatsApp
                                </a>

                            </div>
                        </>
                        :
                        <div className="align-detailed-boxes">
                            <div className="title-detailed-boxes">
                                <h2>{exerciseData?.title}</h2>
                            </div>

                            <div className="listing-detailed-boxes">
                                <div className="detailed-box-main">
                                    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description || '' }} />

                                    {/* <div ref={containerRef} dangerouslySetInnerHTML={{ __html: exerciseData?.description || '' }} /> */}
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
                                                isSubmitted={false}
                                                checkResults={checkDropdownResults}
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
                                                                    const questionResult = checkResults[question.id];

                                                                    return (
                                                                        <div key={index} className="list__ unset-input">
                                                                            <p className="label text p2_semibold">{question?.description}</p>

                                                                            {/* Checkbox question (multiple options) */}
                                                                            {question?.question_type === 'radio' && question.options.map((option, idx) => {
                                                                                // For checkbox questions, selectedAnswers stores an array of selected option IDs
                                                                                const isSelected = Array.isArray(selected)
                                                                                    ? selected.includes(option.id)
                                                                                    : false;

                                                                                // Determine if this selected option is correct
                                                                                let isCorrect = false;
                                                                                if (showResults && isSelected && questionResult) {
                                                                                    if (Array.isArray(questionResult)) {
                                                                                        const answerInfo = questionResult.find(a => a.option_id === option.id);
                                                                                        isCorrect = answerInfo?.is_correct ?? false;
                                                                                    } else {
                                                                                        // If questionResult is boolean, it applies to the entire question
                                                                                        isCorrect = questionResult;
                                                                                    }
                                                                                }

                                                                                return (
                                                                                    <div
                                                                                        key={idx}
                                                                                        className={`option-field-main ${showResults && isSelected
                                                                                            ? (isCorrect ? 'border-green' : 'error')
                                                                                            : ''
                                                                                            }`}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            name={`option_${question.id}_${option.id}`}
                                                                                            checked={isSelected}
                                                                                            onChange={() => handleOptionChange(question.id, option.id, 'checkbox')}
                                                                                            disabled={showResults}
                                                                                        />
                                                                                        <label>{option.description}</label>
                                                                                    </div>
                                                                                );
                                                                            })}

                                                                            {/* Rest of your code for text inputs remains the same */}
                                                                            {question?.question_type === 'input_field' && question?.is_static != 1 && (
                                                                                <div className="form_input">
                                                                                    <span className="field">
                                                                                        <input
                                                                                            type="text"
                                                                                            name={`antwort_${question?.id ?? index}`}
                                                                                            className={`login__form-input ${showResults
                                                                                                ? (questionResult === true
                                                                                                    ? 'border-green'
                                                                                                    : 'border-red')
                                                                                                : ''
                                                                                                }`}
                                                                                            placeholder=""
                                                                                            aria-label={`antwort_${question?.id ?? index}`}
                                                                                            value={typeof selected === 'string' ? selected : ''}
                                                                                            onChange={(e) =>
                                                                                                setSelectedAnswers((prev) => ({
                                                                                                    ...prev,
                                                                                                    [question.id]: e.target.value,
                                                                                                }))
                                                                                            }
                                                                                            disabled={showResults}
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {question?.question_type === 'input_field' && question?.is_static == 1 && (
                                                                                <div className="form_input">
                                                                                    <span className="field">
                                                                                        <input
                                                                                            type="text"
                                                                                            name={`antwort_${question?.id ?? index}`}
                                                                                            className="login__form-input"
                                                                                            placeholder=""
                                                                                            aria-label={`antwort_${question?.id ?? index}`}
                                                                                            value={question?.value}
                                                                                            readOnly
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
                                                            if (question?.question_type === 'notebook') {
                                                                return (
                                                                    <div className="notizen" key={`notebook-${question.id || index}`}>
                                                                        <div dangerouslySetInnerHTML={{ __html: question?.description || '' }} />
                                                                        <div className="uebung_text">
                                                                            <input
                                                                                type="text"
                                                                                name="antwort"
                                                                                className={`${showResults ? (checkResults[question.id] ? 'border-green' : 'border-red') : ''}`}
                                                                                onChange={(e) =>
                                                                                    setSelectedAnswers((prev) => ({
                                                                                        ...prev,
                                                                                        [question.id]: e.target.value,
                                                                                    }))
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            } else {
                                                                const selectedOption = selectedAnswers[question.id];
                                                                const isCorrect = checkResults[question.id];

                                                                return (
                                                                    <li key={question.id || index}>
                                                                        <div className="title-option-field">
                                                                            <h3>{question.description}</h3>
                                                                        </div>
                                                                        <div className="options-main">
                                                                            {question.options.map((option) => {
                                                                                const isSelected = selectedOption === option.id;
                                                                                let className = "option-field-main";

                                                                                if (showResults) {
                                                                                    if (isSelected) {
                                                                                        className += isCorrect ? " active green-option" : " error";
                                                                                    }
                                                                                    // Optional: highlight correct answer if not selected
                                                                                    else if (isCorrect && option.is_correct) {
                                                                                        className += " green-option";
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
                                                            }
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </>
                                    }

                                    <div className="action-btns flex flex-wrap gap-2 items-center justify-start">




                                        <button type="button" onClick={goToPrevious}>
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

                                        {showResults ? (
                                            <>
                                                <button type="button" onClick={handleReset}>Zurücksetzen</button>
                                                <button
                                                    type="button" onClick={() => router.push(exerciseData?.next_slug || '/')}
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
                                        )}

                                        {/* WhatsApp Button */}
                                        <a
                                            href={`https://wa.me/491234567890?text=Ich arbeite an der Übung: ${encodeURIComponent(exerciseData?.title || '')}. Hilf mir dabei.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm md:text-base transition duration-200 h-10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M20.52 3.48A11.92 11.92 0 0012 .01 12 12 0 000 12a11.89 11.89 0 001.66 6L0 24l6.4-1.68A12 12 0 1012 .01a11.9 11.9 0 008.52 3.47zM12 22a10.16 10.16 0 01-5.21-1.43l-.37-.22-3.81 1 .99-3.7-.24-.38A9.93 9.93 0 012.05 12 9.94 9.94 0 1112 22zm5.46-7.3c-.3-.15-1.75-.86-2.02-.96s-.47-.15-.67.15-.77.96-.94 1.15-.35.22-.65.07a8.26 8.26 0 01-2.43-1.5 9.22 9.22 0 01-1.71-2.12c-.18-.3 0-.46.13-.6s.3-.34.45-.51.2-.3.3-.5.05-.38-.02-.53-.66-1.58-.9-2.17-.5-.5-.67-.5h-.56c-.2 0-.53.08-.8.38a3.35 3.35 0 00-1.03 2.5 5.88 5.88 0 001.24 2.47 13.49 13.49 0 005.26 4.72c.73.3 1.3.47 1.75.6a4.19 4.19 0 001.92.12 3.2 3.2 0 002.1-1.5 2.6 2.6 0 00.18-1.5c-.07-.13-.25-.2-.54-.35z" />
                                            </svg>
                                            WhatsApp
                                        </a>
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
