"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import axios from '@/utils/axios';
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loader/Loader"; // Assuming you have this

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/login', { email, password });
      const data = response.data;

      login(data.access_token, { email }); // you can expand this user data based on your API response

      toast.success(data.message);
      router.push("/admin");
      
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Sign In
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to sign in!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>
            Email <span className="text-error-500">*</span>
          </Label>
          <Input
            placeholder="info@gmail.com"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <div className="text-danger">{error.email}</div>}
        </div>

        <div>
          <Label>
            Password <span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <div className="text-danger">{error.password}</div>}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
              Keep me logged in
            </span>
          </div>
          <Link
            href="/reset-password"
            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button className="w-full" size="sm">
          Sign in
        </Button>
      </form>
    </div>
  );
}
