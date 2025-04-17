import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserIcon } from "@/icons";
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            {/* <ThemeProvider> */}
            {/* <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0"> */}
            <section id="logo-top">
                <div className="container">
                    <div className="align-logo-top">
                        <div className="top-logo">
                            <img src="/images/logo/spitalsgo-logo.png" alt="" />
                        </div>
                        <div className="top-socials">
                            <ul>
                                <li>
                                    <a href="#" className="facebook">
                                        <svg className="e-font-icon-svg e-fab-facebook" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="twitter">
                                        <svg className="e-font-icon-svg e-fab-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="youtube">
                                        <svg className="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section id="navigation">
                <div className="container">
                    <div className="align-navigation">
                        <header>
                            <div className="header-container">
                                <ul className="nav-links">
                                    <li><a href="#">Heim</a></li>
                                    <li><a href="#">A1</a></li>
                                    <li><a href="#">A2</a></li>
                                    <li><a href="#">B1</a></li>
                                    <li><a href="#">B2</a></li>
                                    <li><a href="#">B1 Probeprüfung</a></li>
                                    <li><a href="#">B2 Probeprüfung</a></li>
                                    <li><a href="#">Einstufungstest</a></li>
                                </ul>
                                <a href="/signin" className="login-button">
                                    <UserIcon className="icon" /> Log in
                                </a>
                            </div>
                        </header>
                    </div>
                </div>
            </section>
            {children}
            <section id="footer-main">
                <div className="container">
                    <div className="footer-align">
                        <footer>
                            <div className="footer-logo">
                                <img src="https://spitalisgo.com/wp-content/uploads/2024/11/spitalisgo-footer-logo.webp" alt="" />
                                <p>Wir unterstützen Programme, die den Menschen Aufstieg ermöglichen</p>
                                <div className="top-socials">
                                    <ul>
                                        <li>
                                            <a href="#" className="facebook">
                                                <svg className="e-font-icon-svg e-fab-facebook" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="twitter">
                                                <svg className="e-font-icon-svg e-fab-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="youtube">
                                                <svg className="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="footer-links">
                                <h3>Beliebte Übungen</h3>
                                <ul>
                                    <li>
                                        <a href="#">
                                            A1 Lesen
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            A1 Lesen
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            A1 Lesen
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            A1 Lesen
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-links">
                                <h3>Rechtliche Hinweise</h3>
                                <ul>
                                    <li>
                                        <a href="#">
                                            Kontaktieren Sie uns
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Allgemeine Geschäftsbedingungen
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            A1 Lesen
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-links">
                                <h3>Kontaktinformationen</h3>
                                <ul>
                                    <li>
                                        <a href="tel:+91 458 654 528">
                                            <svg aria-hidden="true" className="e-font-icon-svg e-fas-phone-volume" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M97.333 506.966c-129.874-129.874-129.681-340.252 0-469.933 5.698-5.698 14.527-6.632 21.263-2.422l64.817 40.513a17.187 17.187 0 0 1 6.849 20.958l-32.408 81.021a17.188 17.188 0 0 1-17.669 10.719l-55.81-5.58c-21.051 58.261-20.612 122.471 0 179.515l55.811-5.581a17.188 17.188 0 0 1 17.669 10.719l32.408 81.022a17.188 17.188 0 0 1-6.849 20.958l-64.817 40.513a17.19 17.19 0 0 1-21.264-2.422zM247.126 95.473c11.832 20.047 11.832 45.008 0 65.055-3.95 6.693-13.108 7.959-18.718 2.581l-5.975-5.726c-3.911-3.748-4.793-9.622-2.261-14.41a32.063 32.063 0 0 0 0-29.945c-2.533-4.788-1.65-10.662 2.261-14.41l5.975-5.726c5.61-5.378 14.768-4.112 18.718 2.581zm91.787-91.187c60.14 71.604 60.092 175.882 0 247.428-4.474 5.327-12.53 5.746-17.552.933l-5.798-5.557c-4.56-4.371-4.977-11.529-.93-16.379 49.687-59.538 49.646-145.933 0-205.422-4.047-4.85-3.631-12.008.93-16.379l5.798-5.557c5.022-4.813 13.078-4.394 17.552.933zm-45.972 44.941c36.05 46.322 36.108 111.149 0 157.546-4.39 5.641-12.697 6.251-17.856 1.304l-5.818-5.579c-4.4-4.219-4.998-11.095-1.285-15.931 26.536-34.564 26.534-82.572 0-117.134-3.713-4.836-3.115-11.711 1.285-15.931l5.818-5.579c5.159-4.947 13.466-4.337 17.856 1.304z"></path></svg>
                                            +91 458 654 528
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:info@spitalisgo.com">
                                            <svg aria-hidden="true" className="e-font-icon-svg e-fas-envelope-open" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V200.724a48 48 0 0 1 18.387-37.776c24.913-19.529 45.501-35.365 164.2-121.511C199.412 29.17 232.797-.347 256 .003c23.198-.354 56.596 29.172 73.413 41.433 118.687 86.137 139.303 101.995 164.2 121.512A48 48 0 0 1 512 200.724V464zm-65.666-196.605c-2.563-3.728-7.7-4.595-11.339-1.907-22.845 16.873-55.462 40.705-105.582 77.079-16.825 12.266-50.21 41.781-73.413 41.43-23.211.344-56.559-29.143-73.413-41.43-50.114-36.37-82.734-60.204-105.582-77.079-3.639-2.688-8.776-1.821-11.339 1.907l-9.072 13.196a7.998 7.998 0 0 0 1.839 10.967c22.887 16.899 55.454 40.69 105.303 76.868 20.274 14.781 56.524 47.813 92.264 47.573 35.724.242 71.961-32.771 92.263-47.573 49.85-36.179 82.418-59.97 105.303-76.868a7.998 7.998 0 0 0 1.839-10.967l-9.071-13.196z"></path></svg>
                                            info@spitalisgo.com
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">
                                            <svg aria-hidden="true" className="e-font-icon-svg e-fas-map-marker-alt" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>
                                            Postfach 16122 Collins Street West Victoria 8007 Australien
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </footer>
                    </div>
                </div>
                <div className="bottom-footer">
                    <p>© Copyright 2024
                        <strong><a href="https://spitalisgo.com/"><span><span>spitalisgo</span></span></a></strong>
                        Alle Rechte vorbehalten.
                    </p>
                </div>
            </section>
            {/* </div> */}
            {/* </ThemeProvider> */}
        </div>
    );
}
