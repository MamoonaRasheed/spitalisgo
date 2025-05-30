"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
export default function MainHeader() {
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
    localStorage.removeItem("user");
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

  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (menuVisible) {
      document.body.classList.add('menu-show');
    } else {
      document.body.classList.remove('menu-show');
    }
  }, [menuVisible]);

    const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };

  

  return (
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
                      <li><a href="/"> Heim </a></li>
                      <li><a href="#"> B1 Probeprüfung </a></li>
                      <li><a href="#"> B2 Probeprüfung </a></li>
                      <li><a href="/placement-test"> Einstufungstest </a></li>
                      <li className="login-button">
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
              <div className="mobile-nav-toggler" onClick={toggleMenu}>
                <i className="bx bx-menu"></i>
              </div>
          </div>
      </div>
      <div className="overlay-menu" onClick={toggleMenu}></div>
    </section>
  );
}
