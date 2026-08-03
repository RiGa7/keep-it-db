import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import { useToast } from "../context/ToastContext";

// Step 1 = enter email, Step 2 = answer question, Step 3 = set new password, Step 4 = success
export default function ForgotPassword() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // Step 1: fetch the security question for this email
    const handleGetQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password/question`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to find account");
            setQuestion(data.security_question);
            setStep(2);
        } catch (err) {
            showToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2 + 3: verify answer + reset password
    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) return showToast("Passwords do not match");
        if (newPassword.length < 6) return showToast("Password must be at least 6 characters");

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, security_answer: answer, new_password: newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Reset failed");
            setStep(4);
        } catch (err) {
            showToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-accent tracking-tight">Keep-It</h1>
                    <p className="text-gray-dark mt-2 text-sm">Account recovery</p>
                </div>

                <div className="bg-secondary/60 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 lg:p-8 shadow-md">

                    {/* Step indicator */}
                    {step < 4 && (
                        <div className="flex mb-6">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= s ? "bg-accent" : "bg-white/10"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Step 1: Enter email ── */}
                    {step === 1 && (
                        <>
                            <h2 className="text-white text-2xl font-semibold mb-2">Forgot password?</h2>
                            <p className="text-gray-dark text-sm mb-6">
                                Enter your email and we&apos;ll ask your security question.
                            </p>
                            <form onSubmit={handleGetQuestion} className="space-y-5">
                                <div>
                                    <label htmlFor="fp-email" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                        Email address
                                    </label>
                                    <input
                                        id="fp-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                    />
                                </div>
                                <button
                                    id="fp-continue"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent text-primary font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                                >
                                    {loading ? "Looking up…" : "Continue"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ── Step 2 + 3: Answer question + new password ── */}
                    {(step === 2 || step === 3) && (
                        <>
                            <h2 className="text-white text-2xl font-semibold mb-2">Verify identity</h2>
                            <p className="text-gray-dark text-sm mb-6">
                                Answer your security question and set a new password.
                            </p>

                            <form onSubmit={handleReset} className="space-y-4">
                                {/* Security question */}
                                <div className="bg-primary/40 border border-white/10 rounded-xl px-4 py-3">
                                    <p className="text-gray-dark text-xs mb-1 uppercase tracking-wide">Your security question</p>
                                    <p className="text-white text-sm font-medium">{question}</p>
                                </div>

                                <div>
                                    <label htmlFor="fp-answer" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                        Your answer
                                    </label>
                                    <input
                                        id="fp-answer"
                                        type="text"
                                        required
                                        value={answer}
                                        onChange={(e) => { setAnswer(e.target.value); setStep(2); }}
                                        placeholder="Answer (case-insensitive)"
                                        className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fp-new-pw" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                        New password
                                    </label>
                                    <input
                                        id="fp-new-pw"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setStep(3); }}
                                        placeholder="Min. 6 characters"
                                        className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fp-confirm-pw" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                        Confirm new password
                                    </label>
                                    <input
                                        id="fp-confirm-pw"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                    />
                                </div>

                                <button
                                    id="fp-reset"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent text-primary font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                                >
                                    {loading ? "Resetting…" : "Reset Password"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ── Step 4: Success ── */}
                    {step === 4 && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-white text-2xl font-semibold mb-2">Password reset!</h2>
                            <p className="text-gray-dark text-sm mb-6">
                                Your password has been updated. You can now sign in.
                            </p>
                            <button
                                id="fp-go-login"
                                onClick={() => navigate("/login")}
                                className="w-full bg-accent text-primary font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-sm"
                            >
                                Go to Sign In
                            </button>
                        </div>
                    )}

                    {step !== 4 && (
                        <p className="text-gray-dark text-sm text-center mt-6">
                            Remember your password?{" "}
                            <Link to="/login" className="text-accent hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
