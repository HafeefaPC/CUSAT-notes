'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';// Import the useRouter hook
import { initFirebase } from "../../../firebase/firebaseApp";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
const LoginPage = () => {
    initFirebase();
    const auth = getAuth();
    const router = useRouter(); // Initialize the useRouter hook inside the functional component


    const provider = new GoogleAuthProvider();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const loginWithEmail = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log(result.user);

            localStorage.setItem('accessToken', result.user.accessToken);
            localStorage.setItem('userEmail', result.user.email);

            // Redirect to home page after successful login
            router.push('/');
        } catch (error) {
            setError(error.message);
        }
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
            console.log(result.user.accessToken, result.user.email);
            localStorage.setItem('user', result.user);
            localStorage.setItem('accessToken', result.user.accessToken);
            localStorage.setItem('userEmail', result.user.email);

            router.push('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex justify-center gap-5 items-center">
            <div className='flex flex-col gap-7 border-2 border-white p-5 rounded-xl'>
                <p className="font-bold text-2xl">LOGIN</p>
                <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=" Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="E Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                {error && <p className="text-red-500">{error}</p>}
                <div className='flex'>
                    <button type="button" onClick={loginWithEmail} className="mr-2 text-black bg-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
                    <button type="button" onClick={loginWithGoogle} className='text-black bg-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Google</button>
                    <div className="border-solid border-white border-t-2 pt-5"></div>
                </div>
            </div>
        </div >
    );
};

export default LoginPage;
