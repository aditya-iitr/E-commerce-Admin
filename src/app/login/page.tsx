"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import styled from "styled-components";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1); // 1 = Input, 2 = Verify OTP
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  // 1. Handle Login
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST", body: JSON.stringify({ email: form.email, password: form.password }),
    });
    if (res.ok) router.push("/"); 
    else setError((await res.json()).message);
    setLoading(false);
  };

  // 2. Handle Register (Send OTP)
  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST", body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    if (res.ok) setStep(2);
    else setError((await res.json()).message);
    setLoading(false);
  };

  // 3. Handle Verify OTP
  const handleVerify = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/verify", {
      method: "POST", body: JSON.stringify({ email: form.email, otp: form.otp }),
    });
    if (res.ok) router.push("/"); 
    else setError((await res.json()).message);
    setLoading(false);
  };

  // Determine which function to call based on state
  const handleSubmit = (e: any) => {
    if (isRegister) {
      if (step === 1) handleRegister(e);
      else handleVerify(e);
    } else {
      handleLogin(e);
    }
  };

  // Dynamic Title Logic
  let titleMain = "Welcome,";
  let titleSub = "Log in to continue";
  
  if (isRegister) {
    if (step === 2) {
      titleMain = "Verify OTP";
      titleSub = "Check your email";
    } else {
      titleMain = "Join Us,";
      titleSub = "Sign up to start";
    }
  }

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          
          <div className="title">
            {titleMain} <br />
            <span>{titleSub}</span>
          </div>

          {/* Error Message Box */}
          {error && <div className="error-box">{error}</div>}

          {/* --- INPUT FIELDS --- */}
          
          {/* OTP FIELD (Only for Register Step 2) */}
          {isRegister && step === 2 && (
            <input 
              className="input" 
              name="otp" 
              placeholder="Enter 6-digit OTP" 
              maxLength={6} 
              onChange={handleChange} 
              required 
            />
          )}

          {/* REGISTER FIELDS (Step 1) */}
          {isRegister && step === 1 && (
            <input 
              className="input" 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange} 
              required 
            />
          )}

          {/* COMMON FIELDS (Login & Register Step 1) */}
          {(!isRegister || (isRegister && step === 1)) && (
            <>
              <input 
                className="input" 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                required 
              />
              <input 
                className="input" 
                name="password" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
              />
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button className="button-confirm" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Let's go →"}
          </button>

          {/* TOGGLE LOGIN / REGISTER */}
          <div className="toggle-text">
             {isRegister ? (
               <span onClick={() => setIsRegister(false)}>
                 Already have an account? <b>Log in</b>
               </span>
             ) : (
               <span onClick={() => setIsRegister(true)}>
                 New here? <b>Create Account</b>
               </span>
             )}
          </div>

        </form>
      </div>
    </StyledWrapper>
  );
}

// 🟢 YOUR NEW CSS STYLES (Adapted)
const StyledWrapper = styled.div`
  /* Center the form on screen */
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0; /* Light gray bg for page */
  }

  .form {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: beige;
    --main-color: black;
    --error-color: #ff4b4b;

    padding: 40px;
    background: lightblue;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    border: 3px solid var(--main-color);
    box-shadow: 8px 8px var(--main-color);
    width: 100%;
    max-width: 350px;
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 24px;
    margin-bottom: 10px;
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .input {
    width: 100%; /* Changed to 100% to fit container */
    height: 45px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 15px;
    outline: none;
    transition: all 0.1s;
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--input-focus);
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px var(--main-color);
  }

  .button-confirm {
    margin: 20px auto 0 auto;
    width: 100%;
    height: 50px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 700;
    color: var(--font-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
  }

  .button-confirm:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(4px, 4px);
  }

  .button-confirm:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Styling for the Toggle Text at bottom */
  .toggle-text {
    margin-top: 10px;
    font-size: 13px;
    color: var(--font-color);
    text-align: center;
    width: 100%;
    cursor: pointer;
  }
  
  .toggle-text b {
    text-decoration: underline;
    transition: color 0.2s;
  }

  .toggle-text b:hover {
    color: var(--input-focus);
  }

  /* Error Box Styling */
  .error-box {
    width: 100%;
    background-color: #ffe6e6;
    border: 2px solid var(--main-color);
    color: var(--error-color);
    padding: 10px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 2px 2px var(--main-color);
    text-align: center;
  }
`;