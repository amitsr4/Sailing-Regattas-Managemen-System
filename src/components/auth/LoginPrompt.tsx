// @deno-types="@types/react"
import React, { useState } from "react";
import { useDB } from "@goatdb/goatdb/react";
import { Lock, Mail, Ship } from "lucide-react";
import { kSchemeSailorProfile } from "../../../schema.ts";

interface LoginPromptProps {
  onSignupClick: () => void;
}

export function LoginPrompt({ onSignupClick }: LoginPromptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const db = useDB();

  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      const devUserId = crypto.randomUUID();
      await db.load(`/sys/users/${devUserId}`, kSchemeSailorProfile, {
        id: devUserId,
        name: "Test User",
        type: "seriesOrganizer",
        role: "admin",
        mobile: "0527501111",
        location: "Tel Aviv",
        participatingEvents: new Set<string>(),
        ownedBoats: new Set<string>(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      localStorage.setItem("devUserId", devUserId);
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <Ship className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900 mt-6">Welcome Back</h2>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <button
        onClick={handleDevLogin}
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isLoading
          ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mx-auto" />
          )
          : (
            "Login as Test User"
          )}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSignupClick}
          className="text-blue-600 hover:text-blue-500"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
