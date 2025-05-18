"use client";
import React, { useRef, useState, useEffect } from "react";
import parse, { domToReact } from 'html-react-parser';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionByTask } from '@/services/taskService';
import LoadingSpinner from "@/components/loader/Loader";
import ExerciseRenderer from "@/components/common/ExerciseRenderer";
import DraggableBlock from "@/components/common/DraggableBlock";
import { checkQuestionAnswers } from '@/services/questionService';
import { createRoot, Root } from 'react-dom/client';
import { PlayIcon, PauseIcon, MuteIcon, UnmuteIcon } from "@/icons";
import Image from 'next/image';
interface Task {
    id: number;
    question_no: number;
    task_type: string,
    title: string;
    slug: string;
    description: string;
    question_description: string;
    img_url: string,
    audio_url: string,
    sort_items: [],
    drag_items: [],
    questions: Question[];
    prev_slug: string;
    next_slug: string;
}
interface Question {
    id: number;
    description: string;
    options: Option[];
    // correct_option: number;
    question_type: string;
    is_static: number;
    value: string;
}
interface Option {
    id: number,
    description: string;
}
export default function Task() {
    const params = useParams();
    const router = useRouter();
    const { slug } = params;
    const [taskData, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchExercise = async () => {
            try {
                if (typeof slug === 'string') {
                    const response = await getQuestionByTask({ slug });
                    setTask(response.data);
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
    const [showResults, setShowResults] = useState(false);
    const [checkResults, setCheckResults] = useState<Record<number, boolean>>({});
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | number[] | string>>({});
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
    }, [taskData?.description, showResults]);



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
                question_answers: taskData?.questions
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

    const [answers, setAnswers] = useState<string[]>(Array(50).fill(''));
    const [wordPositions, setWordPositions] = useState<{ [word: string]: number | null }>({});


    const handleWordClick = (word: string) => {
        const currentIndex = wordPositions[word];
        if (currentIndex !== undefined && currentIndex !== null) {
            const updatedAnswers = [...answers];
            updatedAnswers[currentIndex] = '';

            setAnswers(updatedAnswers);
            setWordPositions((prev) => ({ ...prev, [word]: null }));
        } else {
            const nextEmptyIndex = answers.findIndex((ans) => ans === '');
            if (nextEmptyIndex !== -1) {
                const updatedAnswers = [...answers];
                updatedAnswers[nextEmptyIndex] = word;

                setAnswers(updatedAnswers);
                setWordPositions((prev) => ({ ...prev, [word]: nextEmptyIndex }));
            }
        }
    };


    const handleWordRemove = (index: number) => {
        const updatedAnswers = [...answers];
        const removedWord = updatedAnswers[index];

        updatedAnswers[index] = '';

        const updatedPositions = { ...wordPositions };
        if (removedWord) updatedPositions[removedWord] = null;

        setAnswers(updatedAnswers);
        setWordPositions(updatedPositions);
    };



    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];

        // Clear existing word mapping
        const newWordPositions = { ...wordPositions };
        const oldWord = newAnswers[index];
        if (oldWord && newWordPositions[oldWord] === index) {
            newWordPositions[oldWord] = null;
        }

        newAnswers[index] = value;
        setAnswers(newAnswers);
        setWordPositions(newWordPositions);
    };
    const processDescription = (html: string, questionIndex: number) => {
        let localIndex = 0;

        // Count all previous blanks to get a base index offset
        const getPlaceholderOffset = () => {
            let offset = 0;
            for (let i = 0; i < questionIndex; i++) {
                const questionHtml = taskData?.questions[i]?.description || '';
                const matches = questionHtml.match(/<span[^>]*id=['"]fill_in_blanks['"][^>]*>/g);
                offset += matches ? matches.length : 0;
            }
            return offset;
        };

        const baseIndex = getPlaceholderOffset();

        return parse(html, {
            replace: (domNode: any) => {
                if (
                    domNode.name === 'span' &&
                    domNode.attribs &&
                    domNode.attribs.id === 'fill_in_blanks'
                ) {
                    const actualIndex = baseIndex + localIndex;
                    localIndex++;

                    const word = answers[actualIndex];

                    return word ? (
                        <button
                            key={`btn-${actualIndex}`}
                            onClick={() => handleWordRemove(actualIndex)}
                            className="bg-blue-200 px-2 mx-1 rounded"
                        >
                            {word}
                        </button>
                    ) : (
                        <input
                            key={`input-${actualIndex}`}
                            readOnly
                            className="border px-2 mx-1 min-w-[100px]"
                        />
                    );
                }
            },
        });
    };




    if (taskData === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <section className="header-space section-space">
            <div className="container">
                <>
                    <h1>Aufgabe {taskData?.question_no}</h1>
                    <div dangerouslySetInnerHTML={{ __html: taskData?.description || '' }} />

                    {taskData?.task_type === 'radio' && (
                        <>
                            {
                                taskData?.audio_url &&
                                <div className="custom-audio-wrapper" ref={containerRef}>
                                    <audio controls>
                                        <source src={taskData?.audio_url} type="audio/mpeg" />
                                    </audio>
                                    <div className="audio-player" ref={containerRef}>
                                        <span className="play-btn">
                                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 17.3336V6.66698C5 5.78742 5 5.34715 5.18509 5.08691C5.34664 4.85977 5.59564 4.71064 5.87207 4.67499C6.18868 4.63415 6.57701 4.84126 7.35254 5.25487L17.3525 10.5882L17.3562 10.5898C18.2132 11.0469 18.642 11.2756 18.7826 11.5803C18.9053 11.8462 18.9053 12.1531 18.7826 12.4189C18.6418 12.7241 18.212 12.9537 17.3525 13.4121L7.35254 18.7454C6.57645 19.1593 6.1888 19.3657 5.87207 19.3248C5.59564 19.2891 5.34664 19.1401 5.18509 18.9129C5 18.6527 5 18.2132 5 17.3336Z" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            </svg>
                                        </span>
                                        <span className="time current-time">0:00</span>
                                        <div className="progress-bar-container_a">
                                            <div className="progress-bar_a"></div>
                                        </div>
                                        <span className="time duration">0:00</span>
                                        <span className="mute-btn">
                                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.82 4.68652C19.8191 5.61821 20.6167 6.74472 21.1636 7.99657C21.7105 9.24842 21.9952 10.5991 21.9999 11.9652C22.0047 13.3313 21.7295 14.6838 21.1914 15.9395C20.6532 17.1951 19.8635 18.3272 18.8709 19.2658M16.092 7.61194C16.6915 8.17095 17.17 8.84686 17.4982 9.59797C17.8263 10.3491 17.9971 11.1595 18 11.9791C18.0028 12.7988 17.8377 13.6103 17.5148 14.3637C17.1919 15.1171 16.7181 15.7963 16.1225 16.3595M7.4803 15.4069L9.15553 17.48C10.0288 18.5607 10.4655 19.1011 10.848 19.1599C11.1792 19.2108 11.5138 19.0925 11.7394 18.8448C12 18.5586 12 17.8638 12 16.4744V7.52572C12 6.13627 12 5.44155 11.7394 5.15536C11.5138 4.90761 11.1792 4.78929 10.848 4.84021C10.4655 4.89904 10.0288 5.43939 9.15553 6.52009L7.4803 8.59319C7.30388 8.81151 7.21567 8.92067 7.10652 8.99922C7.00982 9.06881 6.90147 9.12056 6.78656 9.15204C6.65687 9.18756 6.51652 9.18756 6.23583 9.18756H4.8125C4.0563 9.18756 3.6782 9.18756 3.37264 9.2885C2.77131 9.48716 2.2996 9.95887 2.10094 10.5602C2 10.8658 2 11.2439 2 12.0001C2 12.7563 2 13.1344 2.10094 13.4399C2.2996 14.0413 2.77131 14.513 3.37264 14.7116C3.6782 14.8126 4.0563 14.8126 4.8125 14.8126H6.23583C6.51652 14.8126 6.65687 14.8126 6.78656 14.8481C6.90147 14.8796 7.00982 14.9313 7.10652 15.0009C7.21567 15.0794 7.30388 15.1886 7.4803 15.4069Z" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            }
                            <div className="option-fields">
                                <div className="option-fields-align">
                                    <ul>
                                        {taskData?.questions.map((question, index) => {
                                            const selectedOption = selectedAnswers[question.id];
                                            const isCorrect = checkResults?.[question.id];
                                            return (
                                                <>
                                                    <div className="title-option-field">
                                                        <h3> <div dangerouslySetInnerHTML={{ __html: question?.description || '' }} /></h3>
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
                                                </>
                                            );
                                        })}


                                    </ul>
                                </div>
                            </div>
                            {
                                taskData?.img_url &&
                                <Image
                                    src={`/placement-test/${taskData?.img_url}`}
                                    alt="Example Image"
                                    width={500}
                                    height={300}
                                />
                            }
                        </>
                    )}

                    {taskData?.task_type === 'dropdown' && (
                        <>
                            {
                                taskData?.audio_url &&
                                <div className="custom-audio-wrapper" ref={containerRef}>
                                    <audio controls>
                                        <source src={taskData?.audio_url} type="audio/mpeg" />
                                    </audio>
                                    <div className="audio-player" ref={containerRef}>
                                        <span className="play-btn">
                                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 17.3336V6.66698C5 5.78742 5 5.34715 5.18509 5.08691C5.34664 4.85977 5.59564 4.71064 5.87207 4.67499C6.18868 4.63415 6.57701 4.84126 7.35254 5.25487L17.3525 10.5882L17.3562 10.5898C18.2132 11.0469 18.642 11.2756 18.7826 11.5803C18.9053 11.8462 18.9053 12.1531 18.7826 12.4189C18.6418 12.7241 18.212 12.9537 17.3525 13.4121L7.35254 18.7454C6.57645 19.1593 6.1888 19.3657 5.87207 19.3248C5.59564 19.2891 5.34664 19.1401 5.18509 18.9129C5 18.6527 5 18.2132 5 17.3336Z" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            </svg>
                                        </span>
                                        <span className="time current-time">0:00</span>
                                        <div className="progress-bar-container_a">
                                            <div className="progress-bar_a"></div>
                                        </div>
                                        <span className="time duration">0:00</span>
                                        <span className="mute-btn">
                                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.82 4.68652C19.8191 5.61821 20.6167 6.74472 21.1636 7.99657C21.7105 9.24842 21.9952 10.5991 21.9999 11.9652C22.0047 13.3313 21.7295 14.6838 21.1914 15.9395C20.6532 17.1951 19.8635 18.3272 18.8709 19.2658M16.092 7.61194C16.6915 8.17095 17.17 8.84686 17.4982 9.59797C17.8263 10.3491 17.9971 11.1595 18 11.9791C18.0028 12.7988 17.8377 13.6103 17.5148 14.3637C17.1919 15.1171 16.7181 15.7963 16.1225 16.3595M7.4803 15.4069L9.15553 17.48C10.0288 18.5607 10.4655 19.1011 10.848 19.1599C11.1792 19.2108 11.5138 19.0925 11.7394 18.8448C12 18.5586 12 17.8638 12 16.4744V7.52572C12 6.13627 12 5.44155 11.7394 5.15536C11.5138 4.90761 11.1792 4.78929 10.848 4.84021C10.4655 4.89904 10.0288 5.43939 9.15553 6.52009L7.4803 8.59319C7.30388 8.81151 7.21567 8.92067 7.10652 8.99922C7.00982 9.06881 6.90147 9.12056 6.78656 9.15204C6.65687 9.18756 6.51652 9.18756 6.23583 9.18756H4.8125C4.0563 9.18756 3.6782 9.18756 3.37264 9.2885C2.77131 9.48716 2.2996 9.95887 2.10094 10.5602C2 10.8658 2 11.2439 2 12.0001C2 12.7563 2 13.1344 2.10094 13.4399C2.2996 14.0413 2.77131 14.513 3.37264 14.7116C3.6782 14.8126 4.0563 14.8126 4.8125 14.8126H6.23583C6.51652 14.8126 6.65687 14.8126 6.78656 14.8481C6.90147 14.8796 7.00982 14.9313 7.10652 15.0009C7.21567 15.0794 7.30388 15.1886 7.4803 15.4069Z" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            }

                            <ExerciseRenderer
                                question_description={taskData?.question_description || ''}
                                questions={taskData?.questions?.map(q => ({
                                    question_id: q.id,
                                    description: q.description,
                                    options: Array.isArray(q.options) ? q.options.map(opt => opt.description) : [],
                                    option_q: Array.isArray(q.options) ? q.options.map(opt => ({
                                        id: opt.id, description: opt.description
                                    })) : [],
                                    // correct_option: q.correct_option,
                                    showResults: showResults,
                                })) || []}
                                selectedAnswers={selectedAnswers}
                                onAnswerChange={handleOptionChange}
                                checkResults={checkResults} // Fixed: Pass checkResults directly, not as an object
                            />
                            {
                                taskData?.img_url &&
                                <Image
                                    src={`/placement-test/${taskData?.img_url}`}
                                    alt="Example Image"
                                    width={500}
                                    height={300}
                                />
                            }
                        </>
                    )}

                    {taskData?.task_type === 'drag_drop' && (
                        <>
                            <div className="flex flex-wrap gap-3">
                                {taskData?.drag_items.map((word, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleWordClick(word)}
                                        className={`px-4 py-2 rounded ${wordPositions[word] !== undefined && wordPositions[word] !== null
                                            ? 'bg-green-200'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>


                            {taskData?.questions.map((question, idx) => (
                                <div key={idx}>{processDescription(question.description, idx)}</div>
                            ))}

                            {taskData?.img_url && (
                                <Image
                                    src={`/placement-test/${taskData?.img_url}`}
                                    alt="Example Image"
                                    width={500}
                                    height={300}
                                />
                            )}
                        </>
                    )}


                    {taskData?.task_type === 'sorting' && (
                        <DraggableBlock backendItems={taskData?.sort_items} />
                    )}

                    {taskData?.task_type === 'input_field' && (
                        taskData?.questions.map((question, idx) => (
                            <div key={idx}>{processDescription(question.description, idx)}</div>
                        ))
                    )}

                </>



                <div className="action-btns">
                    <button type="button" onClick={() => router.push(`${taskData?.prev_slug}`)}>
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
                    <button type="button" onClick={() => router.push(`${taskData?.next_slug}`)}>Weiter</button>

                </div>
            </div>
        </section>
    );
}
