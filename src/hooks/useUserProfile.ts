// hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    profile_image: string;
  }

export default function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProfile(res.data.user))
      .catch((err) => console.error("Profile fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
}
