import React from "react";
import Image from 'next/image';
export default function MainHeader() {
  return (
    <div>
      <section id="main-header">
        <div className="container">
          <div className="align-logo-top">
            <div className="top-logo">
              <a href="/">
                <Image src="/assets/img/spitalsgo-logo.webp" alt="SpitalsGo Logo" width={150} height={60} />
              </a>
            </div>
            <div className="header-links">
              <ul>
                <li><a href="#"> Heim </a></li>
                <li><a href="#"> B1 Probeprüfung </a></li>
                <li><a href="#"> B2 Probeprüfung </a></li>
                <li><a href="#"> Einstufungstest </a></li>
                <li>
                  <a href="/signin" className="text-sm text-gray-700 hover:underline">
                    Einloggen
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
