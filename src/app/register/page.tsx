"use client";
import React, { useState } from "react";
import { TextField, Button, Checkbox, colors } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrivacyPolicy from "@/components/PrivacyPolicy/PrivacyPolicy";
import PrivacyPolicyContainer from "@/components/PrivacyPolicy/PrivacyPolicyContainer";

import userRegister from "@/libs/userRegister";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [acceptTOS, setAccept] = useState(false);

  const [viewTOS, setView] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !telephone || !password) {
      setErrorMsg("Please fill in all fields (กรุณากรอกข้อมูลให้ครบ)");
      return;
    }

    if (!acceptTOS) {
      setErrorMsg("Please agree to our Privacy Policy");
      return;
    }

    try {
      await userRegister({
        name,
        email,
        telephone,
        password,
      });

      alert("Successfully registered!");
      router.push("/api/auth/signin");
    } catch (error: any) {
      console.error("Register Error:", error);
      setErrorMsg(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md border border-slate-200">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join us and start booking your dream hotels!
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <TextField
            variant="outlined"
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <TextField
            variant="outlined"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <TextField
            variant="outlined"
            label="Telephone Number"
            fullWidth
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <TextField
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <p className="text-sm">
            <Checkbox
              checked={acceptTOS}
              onChange={(_, checked) => setAccept(checked)}
              color="default"
            />
            I agree to the{" "}
            <span
              className="text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
              onClick={() => setView(true)}
            >
              {"Privacy Policy"}
            </span>
          </p>

          <Button
            type="submit"
            variant="contained"
            className="bg-sky-600 hover:bg-sky-700 text-white w-full py-3.5 text-base font-bold rounded-xl shadow-none transition-all mt-4 normal-case"
          >
            Sign Up
          </Button>
        </form>

        <div>
          <div
            className="mt-3 text-center text-xs text-slate-500"
            style={{ color: acceptTOS ? "#64748b" : "red" }}
          >
            By creating an account, you agree to our Privacy Policy.
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-sky-600 hover:text-sky-800 font-bold transition-colors"
          >
            Sign In here
          </Link>
        </div>
      </div>

      {/*TOS*/}
      <PrivacyPolicyContainer
        isOpen={viewTOS}
        onClose={() => setView(false)}
        onAccept={() => {
          setAccept(true);
          setView(false);
          console.log(acceptTOS);
        }}
      >
        <PrivacyPolicy />
      </PrivacyPolicyContainer>
    </main>
  );
}
