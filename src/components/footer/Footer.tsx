


import React from "react";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'

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
                                                <FontAwesomeIcon icon={faFacebookF} />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="twitter">
                                                <FontAwesomeIcon icon={faTwitter} />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="youtube">
                                                <FontAwesomeIcon icon={faYoutube} />
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
