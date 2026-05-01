"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        UserId: "",
        UserPassword: "",
    });
    const [errors, setErrors] = useState({ UserId: "", UserPassword: "" });
    const [loginError, setLoginError] = useState("");
    const { mutate: login, isPending } = useLogin();
    const dispatch = useDispatch();
    const router = useRouter();

    const validateForm = () => {
        const newErrors = { UserId: "", UserPassword: "" };
        let isValid = true;

        if (!form.UserId.trim()) {
            newErrors.UserId = "Username is required";
            isValid = false;
        }

        if (!form.UserPassword) {
            newErrors.UserPassword = "Password is required";
            isValid = false;
        } else if (form.UserPassword.length < 4) {
            newErrors.UserPassword = "Password must be at least 4 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        setLoginError("");

        if (!validateForm()) {
            return;
        }

        login(form, {
            onSuccess: (res) => {
                dispatch(
                    setCredentials({
                        token: res.token,
                        user: res.userId,
                        userData: res,
                    }),
                );
                if (res.roleName === "1") {
                    router.push("/dashboard/clinic");
                } else {
                    router.push("/dashboard/admin");
                }
            },
            onError: (err) => {
                setLoginError(
                    err.response?.data?.message ||
                        "Login failed. Please check your credentials.",
                );
            },
        });
    };

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
        if (loginError) {
            setLoginError("");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-medivardaan-teal/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-medivardaan-blue/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            <Card className="w-full max-w-md border-border bg-card shadow-2xl backdrop-blur-sm relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="space-y-4 pb-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative group">
                            <div className="absolute bg-gradient-to-r from-medivardaan-teal to-medivardaan-blue rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <Image
                                src="/medivardaan-logo-transparent-2.png"
                                width={150}
                                height={100}
                                alt="MediVardaan Logo"
                                className="relative object-fit rounded-2xl dark:hidden"
                            />

                            <Image
                                src="medivardaan-logo-transparent-2.png"
                                width={280}
                                height={200}
                                alt="MediVardaan Logo"
                                className="hidden relative object-fit rounded-2xl dark:inline-block"
                            />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-medivardaan-teal to-medivardaan-blue bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            Sign in to access your MediVardaan account
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={handleSignIn} className="space-y-5">
                        {/* Error Alert */}
                        {loginError && (
                            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive animate-in slide-in-from-top-2 duration-300">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{loginError}</p>
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="username"
                                className="text-sm font-medium text-foreground"
                            >
                                Username
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <User size={18} />
                                </div>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className={`pl-10 h-11 bg-background border-input focus:bg-background focus:border-medivardaan-teal focus:ring-2 focus:ring-medivardaan-teal/20 transition-all ${
                                        errors.UserId
                                            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                            : ""
                                    }`}
                                    value={form.UserId}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "UserId",
                                            e.target.value,
                                        )
                                    }
                                    disabled={isPending}
                                />
                            </div>
                            {errors.UserId && (
                                <p className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                                    <AlertCircle size={14} />
                                    {errors.UserId}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-foreground"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock size={18} />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`pl-10 pr-10 h-11 bg-background border-input focus:bg-background focus:border-medivardaan-teal focus:ring-2 focus:ring-medivardaan-teal/20 transition-all ${
                                        errors.UserPassword
                                            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                            : ""
                                    }`}
                                    value={form.UserPassword}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "UserPassword",
                                            e.target.value,
                                        )
                                    }
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-medivardaan-teal"
                                    disabled={isPending}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.UserPassword && (
                                <p className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                                    <AlertCircle size={14} />
                                    {errors.UserPassword}
                                </p>
                            )}
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-medivardaan-teal hover:bg-medivardaan-teal-dark text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-[background-color,box-shadow,transform] duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Spinner />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="pt-4 text-center border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Secure healthcare management platform
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
