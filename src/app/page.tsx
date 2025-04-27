"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
export default function Page() {
    const [username, setUsername] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("username");
        if (token && user) {
            setUsername(user);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername(null);
        router.push("/signin");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div id="home-page">
                <section id="main-header">
                    <div className="container">
                        <div className="align-logo-top">
                            <div className="top-logo">
                                <Image src="/assets/img/spitalsgo-logo.webp" alt="SpitalsGo Logo" width={150} height={60} />
                            </div>
                            <div className="header-links">
                                <ul>
                                    <li><a href="#"> Heim </a></li>
                                    <li><a href="#"> B1 Probeprüfung </a></li>
                                    <li><a href="#"> B2 Probeprüfung </a></li>
                                    <li><a href="#"> Einstufungstest </a></li>
                                    <li>
                                        {username ? (
                                            <div className="relative" ref={dropdownRef}>
                                                <button
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700"
                                                >
                                                    {username}
                                                </button>
                                                {dropdownOpen && (
                                                    <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                                                        <button
                                                            onClick={handleSignOut}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Sign out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <a href="/signin" className="text-sm text-gray-700 hover:underline">
                                                Einloggen
                                            </a>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="home-banner">
                    <div className="container">
                        <div className="align-banner">
                            <div className="banner-content">
                                <h1>Dein Weg zum Prüfungserfolg - mit uns an deiner Seite</h1>
                                <p>Wir bereiten dich vor - bis du bereit bist, versprachen.</p>
                                <button type="button" className="btn btn-primary">Jetzt starten</button>
                            </div>
                            <div className="banner-img">
                                <Image
                                    src="/assets/img/banner.png"
                                    alt="Banner"
                                    width={400}
                                    height={250}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services">
                    <div className="container">
                        <div className="services-boxs-align">
                            <div className="servicex-box">
                                <div className="services-box-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 512 512"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                fill="#50a667"
                                                d="M512 58.668C512 26.305 485.695 0 453.332 0H58.668C26.305 0 0 26.305 0 58.668v394.664C0 485.695 26.305 512 58.668 512h394.664C485.695 512 512 485.695 512 453.332zm0 0"
                                                opacity="1"
                                                data-original="#4caf50"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#fafafa"
                                                d="M385.75 171.586c8.34 8.34 8.34 21.82 0 30.164L247.082 340.414c-4.16 4.16-9.621 6.254-15.082 6.254s-10.922-2.094-15.082-6.254l-69.332-69.332c-8.344-8.34-8.344-21.824 0-30.164 8.34-8.344 21.82-8.344 30.164 0l54.25 54.25 123.586-123.582c8.34-8.344 21.82-8.344 30.164 0zm0 0"
                                                opacity="1"
                                                data-original="#fafafa"
                                                className=""
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <div className="services-box-content">
                                    <h3>Bestehens- garantie</h3>
                                    <p>Kostenlose Whster holung-im Fall Ago Nichtbestehens.</p>
                                </div>
                            </div>
                            <div className="servicex-box">
                                <div className="services-box-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 512 512"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                d="M256.064 0h-.128C114.784 0 0 114.816 0 256c0 56 18.048 107.904 48.736 150.048l-31.904 95.104 98.4-31.456C155.712 496.512 204 512 256.064 512 397.216 512 512 397.152 512 256S397.216 0 256.064 0z"
                                                fill="#50a667"
                                                data-original="#4caf50"
                                                opacity="1"
                                                className=""
                                            ></path>
                                            <path
                                                d="M405.024 361.504c-6.176 17.44-30.688 31.904-50.24 36.128-13.376 2.848-30.848 5.12-89.664-19.264-75.232-31.168-123.68-107.616-127.456-112.576-3.616-4.96-30.4-40.48-30.4-77.216s18.656-54.624 26.176-62.304c6.176-6.304 16.384-9.184 26.176-9.184 3.168 0 6.016.16 8.576.288 7.52.32 11.296.768 16.256 12.64 6.176 14.88 21.216 51.616 23.008 55.392 1.824 3.776 3.648 8.896 1.088 13.856-2.4 5.12-4.512 7.392-8.288 11.744-3.776 4.352-7.36 7.68-11.136 12.352-3.456 4.064-7.36 8.416-3.008 15.936 4.352 7.36 19.392 31.904 41.536 51.616 28.576 25.44 51.744 33.568 60.032 37.024 6.176 2.56 13.536 1.952 18.048-2.848 5.728-6.176 12.8-16.416 20-26.496 5.12-7.232 11.584-8.128 18.368-5.568 6.912 2.4 43.488 20.48 51.008 24.224 7.52 3.776 12.48 5.568 14.304 8.736 1.792 3.168 1.792 18.048-4.384 35.52z"
                                                fill="#fafafa"
                                                data-original="#fafafa"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <div className="services-box-content">
                                    <h3>WhatsApp- Begleitung</h3>
                                    <p>Individuelle Unterstützang per Chat</p>
                                </div>
                            </div>
                            <div className="servicex-box">
                                <div className="services-box-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 64 64"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                d="M58.99 21.63 32.71 10.52a1.626 1.626 0 0 0-1.28 0L5.02 21.59a1.68 1.68 0 0 0-.01 3.07c1.561.669 10.698 4.502 11.98 5.06l14.44 6.09a1.694 1.694 0 0 0 1.28-.01c4.64-1.958 16.614-7.02 21.07-8.91-.01 1.238.008 11.676 0 13.19-1.986.501-2.793 3.887-1.68 5.72l-1.47 6.6a.976.976 0 0 0 .43 1.05.989.989 0 0 0 1.14-.04 4.3 4.3 0 0 1 2.45-.84 4.24 4.24 0 0 1 2.61.85 1.01 1.01 0 0 0 1.56-1.08l-1.87-6.57c.962-1.65.439-4.613-1.17-5.44.009-1.527-.006-13.078 0-14.28l3.21-1.36a1.676 1.676 0 0 0 0-3.06z"
                                                fill="#fdb020"
                                                opacity="1"
                                                data-original="#000000"
                                                className=""
                                            ></path>
                                            <path
                                                d="M30.65 37.65c-1.204-.508-14.918-6.304-15.66-6.61v9.74a3.23 3.23 0 0 0 1.43 2.64 27.868 27.868 0 0 0 14.87 4.81 28.551 28.551 0 0 0 16.39-4.78 3.264 3.264 0 0 0 1.47-2.68v-9.74c-.694.301-14.483 6.122-15.66 6.62a3.727 3.727 0 0 1-2.84 0z"
                                                fill="#fdb020"
                                                opacity="1"
                                                data-original="#000000"
                                                className=""
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <div className="services-box-content">
                                    <h3>Prüfungs- simulation</h3>
                                    <p>Mit echten Prütenimen und Prüfern .</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <section id="kurse"> */}
                    {/* <div className="container">
                        <div className="section-title">
                            <h2>Kurse</h2>
                        </div>
                        <div className="kure-align">
                            <div className="kurse-box">
                                <div className="kurse-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 512 512"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                fill="#da4a54"
                                                d="M466.237 0v420.231L91.643 461.109l-45.884 5.007V45.884c0-12.671 5.13-24.147 13.434-32.451S78.972 0 91.643 0z"
                                                opacity="1"
                                                data-original="#da4a54"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#c32430"
                                                d="M91.643 0v461.109l-45.884 5.007V45.884c0-12.671 5.13-24.147 13.434-32.451S78.972 0 91.643 0z"
                                                opacity="1"
                                                data-original="#c32430"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#c32430"
                                                d="M466.241 420.235H91.642c-25.34 0-45.882 20.542-45.882 45.882 0 25.34 20.542 45.882 45.882 45.882h374.599v-25.755l-18.668-20.128 18.668-20.128z"
                                                opacity="1"
                                                data-original="#c32430"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#dfeaef"
                                                d="M91.642 486.245c-11.099 0-20.128-9.029-20.128-20.128s9.029-20.128 20.128-20.128h374.599v40.256z"
                                                opacity="1"
                                                data-original="#dfeaef"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#f4dd45"
                                                d="m210.979 99.481-33.355-34.234-33.355 34.234V0h66.71z"
                                                opacity="1"
                                                data-original="#f4dd45"
                                            ></path>
                                            <path
                                                fill="#dfeaef"
                                                d="M356.417 128.242H178.543c-17.834 0-32.291 14.457-32.291 32.291v98.531c0 17.834 14.457 32.291 32.291 32.291h177.874c17.834 0 32.291-14.457 32.291-32.291v-98.531c0-17.834-14.457-32.291-32.291-32.291z"
                                                opacity="1"
                                                data-original="#dfeaef"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#c32430"
                                                d="M356.417 299.082H178.543c-22.066 0-40.018-17.952-40.018-40.018v-98.531c0-22.065 17.952-40.017 40.018-40.017h177.874c22.066 0 40.018 17.952 40.018 40.017v98.531c0 22.066-17.952 40.018-40.018 40.018zM178.543 135.969c-13.545 0-24.565 11.02-24.565 24.564v98.531c0 13.545 11.02 24.565 24.565 24.565h177.874c13.545 0 24.565-11.02 24.565-24.565v-98.531c0-13.545-11.02-24.564-24.565-24.564z"
                                                opacity="1"
                                                data-original="#c32430"
                                                className=""
                                            ></path>
                                            <g fill="#665e66">
                                                <path
                                                    d="M340.051 197.057H194.909a7.726 7.726 0 1 1 0-15.452H340.05a7.726 7.726 0 0 1 7.726 7.726 7.724 7.724 0 0 1-7.725 7.726zM340.051 237.993H194.909a7.726 7.726 0 1 1 0-15.452H340.05a7.726 7.726 0 0 1 .001 15.452z"
                                                    fill="#665e66"
                                                    opacity="1"
                                                    data-original="#665e66"
                                                    className=""
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <div className="kurse-text">
                                    <h3>A1</h3>
                                    <p>Fiir Anfänger</p>
                                </div>
                            </div>
                            <div className="kurse-box">
                                <div className="kurse-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 512 512"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                fill="#f1b105"
                                                d="M466.237 0v420.231L91.643 461.109l-45.884 5.007V45.884c0-12.671 5.13-24.147 13.434-32.451S78.972 0 91.643 0z"
                                                opacity="1"
                                                data-original="#da4a54"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#f1b105"
                                                d="M91.643 0v461.109l-45.884 5.007V45.884c0-12.671 5.13-24.147 13.434-32.451S78.972 0 91.643 0z"
                                                opacity="1"
                                                data-original="#c32430"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#f1b105"
                                                d="M466.241 420.235H91.642c-25.34 0-45.882 20.542-45.882 45.882 0 25.34 20.542 45.882 45.882 45.882h374.599v-25.755l-18.668-20.128 18.668-20.128z"
                                                opacity="1"
                                                data-original="#c32430"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#dfeaef"
                                                d="M91.642 486.245c-11.099 0-20.128-9.029-20.128-20.128s9.029-20.128 20.128-20.128h374.599v40.256z"
                                                opacity="1"
                                                data-original="#dfeaef"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#f4dd45"
                                                d="m210.979 99.481-33.355-34.234-33.355 34.234V0h66.71z"
                                                opacity="1"
                                                data-original="#f4dd45"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#dfeaef"
                                                d="M356.417 128.242H178.543c-17.834 0-32.291 14.457-32.291 32.291v98.531c0 17.834 14.457 32.291 32.291 32.291h177.874c17.834 0 32.291-14.457 32.291-32.291v-98.531c0-17.834-14.457-32.291-32.291-32.291z"
                                                opacity="1"
                                                data-original="#dfeaef"
                                                className=""
                                            ></path>
                                            <path
                                                fill="#f1b105"
                                                d="M356.417 299.082H178.543c-22.066 0-40.018-17.952-40.018-40.018v-98.531c0-22.065 17.952-40.017 40.018-40.017h177.874c22.066 0 40.018 17.952 40.018 40.017v98.531c0 22.066-17.952 40.018-40.018 40.018zM178.543 135.969c-13.545 0-24.565 11.02-24.565 24.564v98.531c0 13.545 11.02 24.565 24.565 24.565h177.874c13.545 0 24.565-11.02 24.565-24.565v-98.531c0-13.545-11.02-24.564-24.565-24.564z"
                                                opacity="1"
                                                data-original="#c32430"
                                                className=""
                                            ></path>
                                            <g fill="#665e66">
                                                <path
                                                    d="M340.051 197.057H194.909a7.726 7.726 0 1 1 0-15.452H340.05a7.726 7.726 0 0 1 7.726 7.726 7.724 7.724 0 0 1-7.725 7.726zM340.051 237.993H194.909a7.726 7.726 0 1 1 0-15.452H340.05a7.726 7.726 0 0 1 .001 15.452z"
                                                    fill="#665e66"
                                                    opacity="1"
                                                    data-original="#665e66"
                                                    className=""
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <div className="kurse-text">
                                    <h3>A2</h3>
                                    <p>Grundiegende Kenmnese.</p>
                                </div>
                            </div>
                            <div className="kurse-box">
                                <div className="kurse-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 512 512"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                d="m114.688 284.676-73.801-73.801 178.5-178.5 73.8 73.8zm-80.7-60.801 67.7 67.7-101.5 33.8zm281.899-140.3-12.801 12.8-73.899-73.898 12.801-12.801c12.895-12.903 33.805-12.903 46.7 0l27.199 27.199c12.8 12.937 12.8 33.766 0 46.7zm0 0"
                                                fill="#218a3f"
                                                opacity="1"
                                                data-original="#000000"
                                                className=""
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <div className="kurse-text">
                                    <h3>B1</h3>
                                    <p>Fortgeschrit- tenes.Kiveau</p>
                                </div>
                            </div>
                            <div className="kurse-box">
                                <div className="kurse-icon">
                                    <svg
                                        width="512"
                                        height="512"
                                        viewBox="0 0 28 28"
                                        className=""
                                    >
                                        <g>
                                            <path
                                                fill="#63aad2"
                                                d="M14 19a5.006 5.006 0 0 1-5-5V7a5 5 0 0 1 10 0v7a5.006 5.006 0 0 1-5 5zm9-5a1 1 0 0 0-2 0 7 7 0 0 1-14 0 1 1 0 0 0-2 0 9 9 0 0 0 18 0zm-8 11v-3a1 1 0 0 0-2 0v3a1 1 0 0 0 2 0z"
                                                opacity="1"
                                                data-original="#0a0b12"
                                                className=""
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <div className="kurse-text">
                                    <h3>B2</h3>
                                    <p>Selbestrand- ige Sprach- verver-dung</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                {/* </section> */}
                <section id="home-categories">
                    <div className="container">
                        <div className="home-categories-align">
                            <div className="category-box">
                                <a href="/A1">
                                    A1
                                </a>
                            </div>
                            <div className="category-box">
                                <a href="/A2">
                                    A2
                                </a>
                            </div>
                            <div className="category-box">
                                <a href="/B1">
                                    B1
                                </a>
                            </div>
                            <div className="category-box">
                                <a href="/B2">
                                    B2
                                </a>
                            </div>
                            <div className="category-box">
                                <a href="#">
                                    <svg width="512" height="512" viewBox="0 0 64 64" enableBackground="new 0 0 512 512" className="">
                                        <g>
                                            <path d="M58.99 21.63 32.71 10.52a1.626 1.626 0 0 0-1.28 0L5.02 21.59a1.68 1.68 0 0 0-.01 3.07c1.561.669 10.698 4.502 11.98 5.06l14.44 6.09a1.694 1.694 0 0 0 1.28-.01c4.64-1.958 16.614-7.02 21.07-8.91-.01 1.238.008 11.676 0 13.19-1.986.501-2.793 3.887-1.68 5.72l-1.47 6.6a.976.976 0 0 0 .43 1.05.989.989 0 0 0 1.14-.04 4.3 4.3 0 0 1 2.45-.84 4.24 4.24 0 0 1 2.61.85 1.01 1.01 0 0 0 1.56-1.08l-1.87-6.57c.962-1.65.439-4.613-1.17-5.44.009-1.527-.006-13.078 0-14.28l3.21-1.36a1.676 1.676 0 0 0 0-3.06z" fill="#fdb020" />
                                            <path d="M30.65 37.65c-1.204-.508-14.918-6.304-15.66-6.61v9.74a3.23 3.23 0 0 0 1.43 2.64 27.868 27.868 0 0 0 14.87 4.81 28.551 28.551 0 0 0 16.39-4.78 3.264 3.264 0 0 0 1.47-2.68v-9.74c-.694.301-14.483 6.122-15.66 6.62a3.727 3.727 0 0 1-2.84 0z" fill="#fdb020" />
                                        </g>
                                    </svg>
                                </a>
                            </div>


                            <div className="category-box">
                                <a href="#">
                                    <svg width="512" height="512" viewBox="0 0 58 58" className="">
                                        <g>
                                            <g fill="none" fillRule="nonzero">
                                                <path fill="#f9eab0" d="M44 2a2.006 2.006 0 0 0-2-2H14.828a2 2 0 0 0-1.414.586L.586 13.414A2 2 0 0 0 0 14.828V56a2.006 2.006 0 0 0 2 2h40a2 2 0 0 0 2-2z" />
                                                <g fill="#cbb292">
                                                    <path d="M37 21H6a1 1 0 0 1 0-2h31a1 1 0 0 1 0 2zM29.77 26H6a1 1 0 0 1 0-2h23.77a1 1 0 0 1 0 2zM22.53 31H6a1 1 0 0 1 0-2h16.53a1 1 0 0 1 0 2zM13.52 40H6a1 1 0 0 1 0-2h7.52a1 1 0 0 1 0 2zM10.11 45H6a1 1 0 0 1 0-2h4.11a1 1 0 0 1 0 2zM15.84 50H6a1 1 0 0 1 0-2h9.84a1 1 0 0 1 0 2z" />
                                                </g>
                                                <path fill="#ffffff" d="M39 54h-5a1 1 0 0 1 0-2h4v-4a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1z" />
                                                <path fill="#cbb292" d="M39 6h-8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2zM39 10h-5a1 1 0 0 1 0-2h5a1 1 0 0 1 0 2z" />
                                                <path fill="#f3d55b" d="M14 .18V11a3 3 0 0 1-3 3H.18c.1-.22.24-.42.41-.59L13.41.59c.17-.17.37-.31.59-.41z" />
                                                <path fill="#bdc3c7" d="m57.47 22.581-2.28-3.29a3 3 0 0 0-4.17-.76l-5.76 3.98-4.11 2.84L21.56 38.9a.526.526 0 0 0-.14.12l5.67 8.19a.827.827 0 0 0 .16-.09l19.59-13.54 4.11-2.84 5.76-3.99a3 3 0 0 0 .76-4.169z" />
                                                <path fill="#ff5364" d="m56.71 26.751-5.76 3.99-5.69-8.23 5.76-3.98a3 3 0 0 1 4.17.76l2.28 3.29a3 3 0 0 1-.76 4.17z" />
                                                <path fill="#bdc3c7" d="m41.153 25.379 4.112-2.838 5.683 8.234-4.112 2.838z" />
                                                <path fill="#3b97d3" d="M46.84 33.581c-20.832 14.4-19.649 13.6-19.75 13.63l-5.67-8.19c.081-.1-1.193.8 19.73-13.67z" />
                                                <path fill="#fdd7ad" d="M27.09 47.211c-.1.061.169-.022-6.24 1.54l-3.06-4.44c3.71-5.443 3.516-5.176 3.63-5.29z" />
                                                <path fill="#464f5d" d="M20.85 48.751 16.09 49.9a1 1 0 0 1-1.06-1.54l2.76-4.05z" />
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            </div>

                        </div>
                    </div>
                </section>
                <section id="testimonials">
                    <div className="container">
                        <div className="align-testimonials testimonials">
                            <Swiper className="testiSwiper">
                                {[1, 2, 3, 4].map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="testimonial-item">
                                            <Image src="/assets/img/user.jpg" className="testimonial-img" alt="User" width={80} height={80} />
                                            <h3>Saul Goodman</h3>
                                            <h4>CEO &amp; Founder</h4>
                                            <div className="stars">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <i key={i} className="bx bxs-star"></i>
                                                ))}
                                            </div>
                                            <p>
                                                <i className="bx bxs-quote-left"></i>
                                                <span>
                                                    Proin iaculis purus consequat sem cure digni ssim donec porttitora
                                                    entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam
                                                    eget nibh et. Maecen aliquam, risus at semper.
                                                </span>
                                                <i className="bx bxs-quote-right"></i>
                                            </p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </section>

                <section id="footer-main">
                    <div className="container">
                        <div className="align-footer">
                            <footer>
                                <div className="footer-logo-align">
                                    <div className="footer-logo-img">
                                        <Image src="/assets/img/spitalsgo-logo.webp" alt="SpitalsGo Logo" width={120} height={40} />
                                        <p>Wir unterstützen Programme, die den Menschen Aufstieg ermöglichen</p>
                                    </div>
                                    <div className="top-socials">
                                        <ul>
                                            <li>
                                                <a href="#" className="facebook">
                                                    <svg className="e-font-icon-svg e-fab-facebook" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M504 256C504 119 393 8 256 8S8 119 8 256..." />
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="twitter">
                                                    <svg className="e-font-icon-svg e-fab-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M459.37 151.716c.325 4.548.325 9.097..." />
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="youtube">
                                                    <svg className="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276..." />
                                                    </svg>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </footer>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
