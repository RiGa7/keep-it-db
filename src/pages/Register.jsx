import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import API_URL from "../config/api";
import logo from "../assets/logo.png"

const API = API_URL;

const SECURITY_QUESTIONS = [
    "What is your nickname?",
    "What was the name of your first pet?",
    "What city were you born in?",
    "What was the name of your first school?",
    "What is your favorite food?",
];

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        security_question: SECURITY_QUESTIONS[0],
        security_answer: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            return showToast("Passwords do not match");
        }
        if (form.password.length < 6) {
            return showToast("Password must be at least 6 characters");
        }
        if (!form.security_answer.trim()) {
            return showToast("Please provide a security answer");
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    security_question: form.security_question,
                    security_answer: form.security_answer,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");
            login(data.user, data.token);
            navigate("/");
        } catch (err) {
            showToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] px-4 py-10">
            <div className="w-full max-w-full lg:max-w-[60%]">
                {/* Logo */}
                <div className="flex w-full justify-center ">
                    <img src={logo} className="h-10 w-20" />
                </div>
                <p className="text-gray-dark text-sm text-center mt-2 mb-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
                <div className="bg-secondary/60 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 lg:p-8 shadow-md">
                    <h2 className="text-white text-lg md:text-2xl font-semibold mb-2 md:mb-4 lg:mb-6">Create an account</h2>



                    <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10">
                        {/* col - 1 */}
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="reg-name" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                    Full name
                                </label>
                                <input
                                    id="reg-name"
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="relative w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                />
                            </div>

                            <div>
                                <label htmlFor="reg-email" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                    Email address
                                </label>
                                <input
                                    id="reg-email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="reg-password" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                    Password
                                </label>
                                <input
                                    className=" w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                    id="reg-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                />
                                {showPassword ? (
                                    <VisibilityOffOutlinedIcon
                                        className="absolute top-9 right-2 text-gray cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <VisibilityOutlinedIcon
                                        className="absolute top-9 right-2 text-gray cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                            </div>

                            <div className="relative">
                                <label htmlFor="reg-confirm" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                    Confirm password
                                </label>
                                <input
                                    className="relative w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                    id="reg-confirm"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                {showPassword ? (
                                    <VisibilityOffOutlinedIcon
                                        className="absolute top-9 right-2 text-gray cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <VisibilityOutlinedIcon
                                        className="absolute top-9 right-2 text-gray cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                            </div>
                        </div>
                        {/* col -2 */}
                        <div className="space-y-2">
                            <div className="pt-1 pb-0.5">
                                <p className="text-white text-xs uppercase tracking-widest font-semibold">
                                    Account Recovery Question
                                </p>
                                <div className="border-t border-white/10 mt-1 md:my-4"></div>
                            </div>

                            <div>
                                <label htmlFor="reg-security-q" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                    Security question
                                </label>
                                <select
                                    id="reg-security-q"
                                    name="security_question"
                                    value={form.security_question}
                                    onChange={handleChange}
                                    className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                >
                                    {SECURITY_QUESTIONS.map((q) => (
                                        <option key={q} value={q} className="bg-secondary text-white">
                                            {q}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="reg-security-a" className="block text-gray text-sm mb-1 md:mb-1.5 md:font-medium">
                                    Your answer
                                </label>
                                <input
                                    id="reg-security-a"
                                    name="security_answer"
                                    type="text"
                                    required
                                    value={form.security_answer}
                                    onChange={handleChange}
                                    placeholder="Answer (case-insensitive)"
                                    className="w-full bg-primary/60 border border-white/10 text-white rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-xs md:text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                                />
                            </div>


                        </div>
                        <div className="md:col-span-2 flex flex-col items-center">
                            <button
                                id="register-submit"
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-1/2 bg-accent text-primary font-bold py-2 md:py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide mt-0 md:mt-2"
                            >
                                {loading ? "Creating account…" : "Create Account"}
                            </button>
                          
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
