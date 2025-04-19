"use client";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import axios from '@/utils/axios';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('/login', { email, password });
      const data = response.data;

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.user.name);
      toast.success(data.message);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unexpected error occurred', err);
      }
    }
    
  };

  return (
    <section id="auth-main">
      <div className="container">
        <div className="auth-align">
          <div className="auth-text">
            <h2>Login</h2>
            <p>To continue using the website, you must register or log in for free.</p>
          </div>
          <div className="auth-fields">
            <form onSubmit={handleSubmit}>
              <div className="auth-fields">
                <label htmlFor="email">E-mail address</label>
                <div className="input-field-align">
                  <input
                    type="email"
                    id="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
              </div>

              <div className="auth-fields">
                <label htmlFor="password">Password</label>
                <div className="input-field-align">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="icon-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeIcon />
                    ) : (
                      <EyeCloseIcon />
                    )}
                  </div>
                </div>
                {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                <div className="forget-page-link">
                  <Link href="/forget">Forgot your password?</Link>
                </div>
                <div className="submit-btn">
                  <button type="submit">Login</button>
                </div>
              </div>
            </form>

            <div className="already-account">
              <p>Or</p>
              <p>If you do not have an account yet,</p>
            </div>
            <div className="register-btn">
              <Link href="/signup" className="btn btn-outline">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
