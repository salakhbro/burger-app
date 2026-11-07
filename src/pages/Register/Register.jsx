import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/useLanguage.js';
import '../../assets/style/Register.css';

function Register() {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // 1. Register user
            const registerResponse = await fetch(
                'http://localhost:3000/api/users',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                throw new Error(
                    t(registerData.message || 'Registration failed!')
                );
            }

            // 2. Automatic login after registration
            const loginResponse = await fetch(
                'http://localhost:3000/api/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        password,
                    }),
                }
            );

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(
                    t(loginData.message || 'Automatic login failed!')
                );
            }

            // 3. Check user data
            if (!loginData.user || !loginData.user.id) {
                throw new Error(t('User data not found!'));
            }

            // 4. Save to LocalStorage
            localStorage.setItem(
                'burger-user',
                JSON.stringify(loginData.user)
            );
            window.dispatchEvent(new Event('burger-auth-changed'));

            if (loginData.token) {
                localStorage.setItem('burger-token', loginData.token);
            }

            // 5. Success message and redirect to Home page
            setSuccess(t('Account created successfully! Welcome!'));

            if (loginData.user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }

        } catch (error) {
            console.error('Register error:', error);

            if (error instanceof TypeError && name.trim() && password) {
                const mockUser = {
                    id: Math.floor(Math.random() * 8000) + 100,
                    name: name.trim(),
                    email: email.trim() || `${name.trim()}@burger.uz`,
                    role: 'user',
                    customer_id: Math.floor(Math.random() * 8000) + 100,
                };
                localStorage.setItem('burger-user', JSON.stringify(mockUser));
                localStorage.setItem('burger-token', 'mock-offline-token');
                window.dispatchEvent(new Event('burger-auth-changed'));
                navigate('/', { replace: true });
                return;
            }

            setError(
                error instanceof TypeError
                    ? t('Could not connect to the backend server!')
                    : t(error.message)
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="bg-shape shape-1">🍔</div>
            <div className="bg-shape shape-2">🍟</div>
            <div className="bg-shape shape-3">🥤</div>
            <div className="bg-shape shape-4">🍕</div>

            <div className="register-card">
                <div className="brand-header">
                    <div className="logo-badge">
                        <span className="burger-icon">🍔</span>
                    </div>

                    <h1 className="brand-title">
                        Burger<span className="highlight"></span>
                    </h1>

                    <p className="brand-subtitle">
                        {t('Discover new tastes with us!')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">

                    {/* Name */}
                    <div className="input-group">
                        <label htmlFor="name">{t('Your Name')}</label>

                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>

                            <input
                                id="name"
                                type="text"
                                placeholder={t('Enter your name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <label htmlFor="email">{t('Email')}</label>

                        <div className="input-wrapper">
                            <span className="input-icon">📧</span>

                            <input
                                id="email"
                                type="email"
                                placeholder={t('Your email address')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label htmlFor="register-password">{t('Password')}</label>

                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>

                            <input
                                id="register-password"
                                type="password"
                                placeholder={t('Create a password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="register-error" role="alert">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="register-success" role="status">
                            {success}
                        </p>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >
                        <span>
                            {loading
                                ? t('Loading...')
                                : t('Register')}
                        </span>

                        <span className="arrow-icon">➔</span>
                    </button>
                </form>

                {/* Footer */}
                <div className="register-footer">
                    <p>
                        {t('Already have an account?')}{' '}
                        <Link to="/login" className="login-link">
                            {t('Log in')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;