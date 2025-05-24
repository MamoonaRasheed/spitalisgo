"use client";
import React, { useRef, useState, useEffect } from "react";
import parse, { domToReact } from 'html-react-parser';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionByTask } from '@/services/taskService';
import LoadingSpinner from "@/components/loader/Loader";
import ExerciseRenderer from "@/components/common/ExerciseRenderer";
import DraggableBlock from "@/components/common/DraggableBlock";
import { checkQuestionAnswers, getResult } from '@/services/questionService';
import { getCorrectAnswersByTask } from '@/services/userService';
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
    img_url: string;
    audio_url: string;
    sort_items: [];
    drag_items: [];
    selected_answer: string[] | Record<number, number>;
    questions: Question[];
    correct_options: [];
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
    id: number;
    description: string;
}

interface allTaskData {
    tasks: Task[];
}
export default function Task() {
    const router = useRouter();
    const [taskData, setTasks] = useState<Task | null>(null);
    const [allTaskData, setAllTaskData] = useState<allTaskData>({ tasks: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);
    const [correctOptions, setCorrectOptions] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [checkResults, setCheckResults] = useState<Record<number, boolean>>({});
     const [checkDropdownResults, setCheckDropdownResults] = useState<Record<number, { option_id: number; is_correct: boolean }[]>>({});
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const containerRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const addTask = (newTask: Task) => {
        setAllTaskData(prevData => {
            // Check if task already exists by ID
            const taskExists = prevData.tasks.some(task => task.id === newTask.id);

            if (taskExists) {
                return prevData; // Do not update if already exists
            }
            if (newTask.task_type == "drag_drop" || newTask.task_type == "sorting" || newTask.task_type == "input_field") {
                return {
                    tasks: [...prevData.tasks, { ...newTask, selected_answer: [] }]
                };
            } else {
                return {
                    tasks: [...prevData.tasks, { ...newTask, selected_answer: {} }]
                };
            }

        });
    };
    function isStringArray(value: any): value is string[] {
        return Array.isArray(value) && value.every(item => typeof item === 'string');
    }
    const updateSelectedAnswer = (taskKey: string, newAnswers: string[] | Record<number, number>) => {
        setAllTaskData(prevData => {
            const updatedTasks = prevData.tasks.map(task => {
                const currentTaskKey = `task-${task.id}`;

                if (currentTaskKey !== taskKey) return task;

                let updatedSelectedAnswers: string[] | Record<number, number>;

                if (Array.isArray(newAnswers)) {
                    // Initialize with empty array or existing value if needed
                    updatedSelectedAnswers = Array.isArray(task.selected_answer)
                        ? [...task.selected_answer]
                        : [];

                    newAnswers.forEach(ans => {
                        if (!(updatedSelectedAnswers as string[]).includes(ans)) {
                            (updatedSelectedAnswers as string[]).push(ans);
                        }
                    });

                } else {
                    // Handle object merge
                    updatedSelectedAnswers = newAnswers
                }

                return { ...task, selected_answer: updatedSelectedAnswers };
            });
            return {
                ...prevData,
                tasks: updatedTasks
            };
        });
    };


    const fetchTask = async (slug: string) => {
        try {
            fetchCorrectAnswers(slug);

            if (taskData?.id !== undefined) {
                if (!slug) {
                    setIsLastQuestion(true);
                }
                console.log('taskAnswers--->slug', taskAnswers[`task-${taskData.id}`])
                if (taskData.task_type == "drag_drop" || taskData.task_type == "sorting" || taskData.task_type == "input_field") {
                    await updateSelectedAnswer(`task-${taskData.id}`, taskAnswers[`task-${taskData.id}`]);
                } else {
                    const questionIds = taskData.questions.map(q => q.id);

                    // Step 2: selectedAnswers me se sirf wo filter karo jinki key questionIds me hai
                    const filteredAnswers = Object.fromEntries(
                        Object.entries(selectedAnswers).filter(([key]) =>
                            questionIds.includes(Number(key))
                        )
                    );
                    await updateSelectedAnswer(`task-${taskData.id}`, filteredAnswers);
                }

            }
            if (typeof slug === 'string') {
                setLoading(true);
                const response = await getQuestionByTask({ slug });
                setTasks(response.data);
                addTask(response.data);
            }
        } catch (error) {
            console.error('Error fetching exercise:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTask('task-1');
    }, []);

    const fetchCorrectAnswers = async (slug: string) => {
        try {
            if (typeof slug === 'string') {
                const response = await getCorrectAnswersByTask({ slug });
                setCorrectOptions(response?.correct_options);
                setTaskAnswers(response?.selected_answers);
                setTaskAnswersDropDown(response?.selected_answers);
                setSelectedAnswers(response?.selected_answers);
            }
        } catch (error) {
            console.error('Error fetching correct answers:', error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchCorrectAnswers('task-1');
    }, []);

    useEffect(() => {
        if (Object.keys(selectedAnswers).length > 0 && taskData?.questions) {
            handleCheck();
            // setLoading(false);
        }
    }, [selectedAnswers, taskData?.questions]);


    useEffect(() => {
        console.log('selectedAnswers========>', selectedAnswers)
    }, [selectedAnswers])
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

            return {
                ...prevSelectedAnswers,
                [questionId]: optionId,
            };
        });
    };


    useEffect(() => {
        console.log(selectedAnswers, "selectedAnswers updated");
    }, [selectedAnswers]);

    const [isSubmitted, setIsSubmitted] = useState(true);

    const handleCheck = async () => {
        try {
            // dropdown, radio
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
            setCheckDropdownResults(mappedResults);
            setShowResults(true);
        } catch (error) {
            console.error('Error submitting answers:', error);
        } finally {
            // setLoading(false);
        }
    };

    const submitAll = async () => {
        try {
            const payload = {
                allTaskData
            };
            console.log("payload", payload);
            const response = await getResult(payload);
            console.log("response---->", response);
            if (response.status) {
                router.replace("/placement-test/score");
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        } finally {
            // setLoading(false);
        }
    };


    useEffect(() => {
        console.log("checkResults p", checkResults);
    }, [checkResults]);

    const [taskAnswers, setTaskAnswers] = useState<{ [slug: string]: string[] }>({});
    const [taskAnswersDropDown, setTaskAnswersDropDown] = useState<{ [questionId: number]: string | number | number[] }>({});;
    const [taskWordPositions, setTaskWordPositions] = useState<{ [slug: string]: { [word: string]: number | null } }>({});

    const slug = taskData?.slug || ''; // or taskData.id if you're using ID
    const answers = taskAnswers[slug] || [];
    const wordPositions = taskWordPositions[slug] || {};


    useEffect(() => {
        if (taskData) {
            const slug = taskData.slug || '';
            // Check if we already have saved answers
            if (!taskAnswers[slug]) {
                let totalBlanks = 0;
                taskData.questions.forEach((q) => {
                    const matches = q.description.match(/<span[^>]*id=['"]fill_in_blanks['"][^>]*>/g);
                    totalBlanks += matches ? matches.length : 0;
                });

                // Initialize for new task
                setTaskAnswers(prev => ({ ...prev, [slug]: Array(totalBlanks).fill('') }));
                setTaskWordPositions(prev => ({ ...prev, [slug]: {} }));
            }
        }
        // console.log('taskData', JSON.stringify(taskData));
    }, [taskData]);

    // Process description with inputs or drag-drop placeholders
    const processDescription = (html: string, questionIndex: number, taskType: string) => {
        let localIndex = 0;

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

                    const rawUserAnswer = taskAnswers?.[actualIndex];
                    const rawCorrectAnswer = correctOptions?.[actualIndex];

                    const userAnswer = Array.isArray(rawUserAnswer) ? rawUserAnswer[0] : rawUserAnswer || '';
                    const correctAnswer = Array.isArray(rawCorrectAnswer) ? rawCorrectAnswer[0] : rawCorrectAnswer || '';

                    const isCorrect = userAnswer.trim() === correctAnswer.trim();

                    if (taskType === 'input_field') {
                        return (
                            <div key={`input-${actualIndex}`} className="inline-block relative mx-1 group">
                                <input
                                    value={userAnswer}
                                    disabled={isSubmitted}
                                    className={`border px-2 min-w-[100px] rounded mb-2
                                ${isSubmitted
                                            ? isCorrect
                                                ? 'bg-green-200 text-green-800 border-green-500'
                                                : 'bg-red-200 text-red-800 border-red-500'
                                            : ''}`}
                                />
                                {isSubmitted && !isCorrect && (
                                    <>
                                        <span className="absolute -top-2 -right-3 text-blue-600 cursor-default text-sm z-40">🛈</span>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-white text-sm text-green-700 border border-green-500 px-2 py-1 rounded shadow whitespace-nowrap z-50">
                                            ✅ Correct: {correctAnswer}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    }

                    // DRAG & DROP
                    const word = userAnswer;
                    if (word) {
                        return (
                            <div key={`btn-${actualIndex}`} className="relative inline-block group mx-1">
                                <button
                                    disabled={isSubmitted}
                                    className={`px-2 rounded mb-2 ${isSubmitted
                                        ? isCorrect
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-red-200 text-red-800'
                                        : 'bg-blue-200'}`}
                                >
                                    {word}
                                </button>
                                {isSubmitted && !isCorrect && (
                                    <>
                                        <span className="absolute -top-2 -right-3 text-blue-600 cursor-default text-sm">🛈</span>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-white text-sm text-green-700 border border-green-500 px-2 py-1 rounded shadow whitespace-nowrap z-10">
                                            ✅ Correct: {correctAnswer}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    } else {
                        return <input key={`input-${actualIndex}`} readOnly className="border rounded px-2 mx-1 min-w-[100px] mb-2" />;
                    }
                }
            }
        });
    };


    useEffect(() => {
        console.log('allTaskData', allTaskData)
    }, [allTaskData])

    useEffect(() => {
        console.log('taskAnswers', JSON.stringify(taskAnswers))
        console.log('correctoptions', JSON.stringify(correctOptions))
    }, [taskAnswers])

    if (loading === true) {
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
                    <h1 className="main-heading">Aufgabe {taskData?.question_no}</h1>

                    <div className="mb-5 task-description" dangerouslySetInnerHTML={{ __html: taskData?.description || '' }} />

                    {taskData?.task_type === 'radio' && (
                        <>
                            {
                                taskData?.audio_url &&
                                <div className="custom-audio-wrapper" ref={containerRef}>
                                    <audio controls>
                                        <source src={`tasks/${taskData?.audio_url}`} type="audio/mpeg" />

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
                                            // Normalize selectedOption to a single string or number
                                            const rawSelected = taskAnswers[question.id];
                                            const selectedOption = Array.isArray(rawSelected) ? rawSelected[0] : rawSelected;

                                            const correctOption = correctOptions?.[question.id];

                                            return (
                                                <div key={`${question.id}-${index}`}>
                                                    <div className="title-option-field">
                                                        <h3>
                                                            <div dangerouslySetInnerHTML={{ __html: question?.description || '' }} />
                                                        </h3>
                                                    </div>
                                                    <div className="options-main">
                                                        {question.options.map((option) => {
                                                            const isSelected = String(selectedOption) === String(option.id);
                                                            const isCorrect = String(correctOption) === String(option.id);

                                                            let className = "option-field-main";

                                                            if (showResults) {
                                                                if (isCorrect) {
                                                                    className += " active green-option"; // correct option gets green border
                                                                }
                                                            }

                                                            return (
                                                                <div className={className} key={option.id}>
                                                                    <input
                                                                        type="radio"
                                                                        name={`option-${question.id}`}
                                                                        checked={isSelected}
                                                                        disabled
                                                                    />
                                                                    <label>{option.description}</label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    </ul>
                                </div>
                            </div>
                            {
                                taskData?.img_url &&
                                <Image
                                    src={`/placement-test/tasks/${taskData?.img_url}`}
                                    alt="Example Image"
                                    width={500}
                                    height={300}
                                    style={{ marginLeft: 'auto', marginTop: '20px' }}
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
                                        <source src={`tasks/${taskData?.audio_url}`} type="audio/mpeg" />

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
                                    showResults: showResults,
                                })) || []}
                                selectedAnswers={taskAnswersDropDown}
                                // onAnswerChange={handleOptionChange}
                                checkResults={checkDropdownResults}
                                isSubmitted={isSubmitted}
                                correctOption={correctOptions}
                            />

                            {
                                taskData?.img_url &&
                                <Image
                                    src={`/placement-test/tasks/${taskData?.img_url}`}
                                    alt="Example Image"
                                    width={500}
                                    height={300}
                                    style={{ marginLeft: 'auto', marginTop: '20px' }}
                                />
                            }
                        </>
                    )}

                    {taskData?.task_type === 'sorting' && (
                        <DraggableBlock
                            backendItems={taskData?.sort_items}

                            onAnswerUpdate={(sortedArray) => {
                                console.log("Sorted array for", `task-${taskData.id}`, sortedArray); // 👈 Debug here
                                setTaskAnswers(prev => ({ ...prev, [`task-${taskData.id}`]: sortedArray }));
                            }}
                        />
                    )}

                    {taskData?.task_type === 'drag_drop' && (
                        <div >
                            <div className="flex flex-wrap gap-3 ">
                                {taskData?.drag_items.map((word, idx) => (
                                    <button
                                        key={idx}
                                        className={`px-4 py-2 rounded ${wordPositions[word] !== undefined && wordPositions[word] !== null
                                            ? 'bg-green-200'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-6 items-start">
                                {/* Left side: Questions */}
                                <div className="flex-1">
                                    {taskData?.questions.map((question, idx) => (
                                        <div key={idx} className="drag_drop mt-5">
                                            {processDescription(question.description, idx, taskData.task_type)}
                                        </div>
                                    ))}
                                </div>

                                {/* Right side: Image */}
                                {taskData?.img_url && (
                                    <div className="ml-auto">
                                        <Image
                                            src={`/placement-test/tasks/${taskData.img_url}`}
                                            alt="Example Image"
                                            width={500}
                                            height={300}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {taskData?.task_type === 'input_field' &&
                        taskData?.questions.map((question, idx) => (
                            <div key={idx}>{processDescription(question.description, idx, taskData.task_type)}</div>
                        )
                        )}

                </>

                <div className="action-btns">
                    <button type="button" onClick={() => taskData?.prev_slug && fetchTask(taskData.prev_slug)}>

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
                        isLastQuestion ?
                            taskData?.id == 64 && <button type="button" onClick={submitAll}>Submit All</button> :
                            <button type="button" onClick={() => taskData?.next_slug && fetchTask(taskData?.next_slug)}>Weiter</button>
                    }
                </div>
            </div>
        </section>
    );
}
