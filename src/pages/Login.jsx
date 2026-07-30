import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import API_URL from "../config/api";

const API = API_URL;

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");
            login(data.user, data.token);
            navigate("/");
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
                    <p className="text-gray-dark mt-2 text-sm">Your personal note space</p>
                </div>

                <div className="bg-secondary/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-md">
                    <h2 className="text-white text-2xl font-semibold mb-6">Welcome back</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="login-email" className="block text-gray text-sm mb-1.5 font-medium">
                                Email address
                            </label>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full bg-primary/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
                            />
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="login-password" className="text-gray text-sm font-medium">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-accent text-xs hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="login-password"
                                name="password"
                                type={(showPassword) ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder={(showPassword) ? "Enter a strong password" : "••••••••"}
                                className="w-full bg-primary/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-dark"
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

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-primary font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    <p className="text-gray-dark text-sm text-center mt-6">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-accent hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
