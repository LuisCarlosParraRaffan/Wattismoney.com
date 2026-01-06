'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { WattismoneyLogo } from '@/components/Icons';
import { SignupBgLayer1, SignupBgLayer2 } from '@/components/AppImages';

const Login: React.FC = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.error) {
                    setError('Credenciales inválidas. Por favor verifica tus datos.');
                } else if (result?.ok) {
                    // Login exitoso, redirigir al Dashboard
                    router.push('/dashboard');
                    router.refresh(); // Actualizar componentes de servidor
                }
            } catch (err) {
                setError('Ocurrió un error inesperado al iniciar sesión.');
                console.error(err);
            }
        });
    };

    return (
        <div className="flex min-h-screen w-full font-display bg-white text-slate-900 antialiased">
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-32 bg-white transition-colors duration-300">

                {/* Header Logo */}
                <div className="mb-10 flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                    </Link>
                </div>

                <div className="w-full max-w-[480px] mx-auto lg:mx-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 mb-3">
                            Iniciar sesión
                        </h1>
                        <p className="text-slate-500 text-base font-normal">
                            Bienvenido de nuevo. Ingresa tus credenciales para acceder a tu portafolio.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button type="button" className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-colors">
                            <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJrI3Wcu-q69tbFIzKdAJcLtvA_iajmK4JCmPCcem2IDpYH61Lo5TMYlRTSSF-iH6LhxAfhVxPGXfcCqBghNmmP_R167YvjQJU9AWPs22YRuFuwLSSDAPWu12PeeZolagY6IgWYtBJ7EaCb5MF25ki2SVv_qo8IhU47asrHzk0H9V0TnCkEahwcer9lpZiV0poC9OqsOAB3x6N4_0Qe4QaNz9NT3hnwWHU9z-8PWZivZNUmchjKVdYrqNqQgAEPUItxPnr704cfns" />
                            <span className="text-sm font-semibold text-slate-700">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px] text-slate-900">ios</span>
                            <span className="text-sm font-semibold text-slate-700">Apple</span>
                        </button>
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium uppercase">O iniciar sesión con correo</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-900">Correo electrónico</span>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input w-full rounded-xl border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm outline-none"
                                placeholder="nombre@ejemplo.com"
                                required
                            />
                        </label>
                        <label className="flex flex-col gap-1.5 relative">
                            <span className="text-sm font-medium text-slate-900">Contraseña</span>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input w-full rounded-xl border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm pr-12 outline-none"
                                    placeholder="Ingresa tu contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                </button>
                            </div>
                        </label>

                        <div className="flex items-center justify-between mt-1">
                            <label className="flex items-start gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="peer size-5 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-primary/50 focus:ring-2 bg-white"
                                    />
                                </div>
                                <span className="text-sm text-slate-600 font-normal leading-tight pt-0.5 group-hover:text-slate-900 transition-colors">Recordarme</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm font-bold text-slate-900 hover:underline decoration-primary decoration-2 hover:bg-primary/20 transition-colors">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary hover:bg-primary-hover transition-colors h-12 px-4 text-black text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">{isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-600">
                            ¿No tienes una cuenta? <Link className="text-slate-900 font-bold underline decoration-primary decoration-2 hover:bg-primary/20 transition-colors" href="/signup">Crear cuenta</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Image Background */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <SignupBgLayer1 />
                <SignupBgLayer2 />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/30"></div>
                <div className="relative z-10 flex h-full w-full flex-col justify-between p-20 text-white">
                    <div className="flex justify-end"></div>
                    <div className="flex flex-col gap-6 max-w-lg">
                        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(238,255,0,0.3)]">
                            <span className="material-symbols-outlined text-[32px] text-black">eco</span>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight tracking-tight">
                            Invierte en el futuro de la energía limpia.
                        </h2>
                        <div className="flex flex-col gap-4 text-lg text-white/90 font-light">
                            <p>Únete a más de 50,000 inversores que están cambiando el mundo mientras hacen crecer su capital.</p>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-3xl font-bold text-primary">12%</p>
                                <p className="text-sm opacity-80 uppercase tracking-wider">Retorno Promedio</p>
                            </div>
                            <div className="w-px bg-white/20 h-full mx-4"></div>
                            <div className="flex flex-col gap-1">
                                <p className="text-3xl font-bold text-primary">+500</p>
                                <p className="text-sm opacity-80 uppercase tracking-wider">Proyectos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
