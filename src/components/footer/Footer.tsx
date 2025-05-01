


import React from "react";
import Image from 'next/image';
export default function MainFooter() {
    return (
        <div>
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
    );
}
