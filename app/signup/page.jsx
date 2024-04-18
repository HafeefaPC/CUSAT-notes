'use client'
import React, { useState } from 'react';
import { initFirebase } from "../../firebase/firebaseApp";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation';


const SignupPage = () => {
    initFirebase();
    const auth = getAuth();
    const router = useRouter();

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

    const signupWithEmail = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log(result.user);
            router.push('/login');
            // Redirect user to a different page upon successful signup
        } catch (error) {
            setError(error.message);
        }
    };

    const signupWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result.user);
        router.push('/login');
        // Redirect user to a different page upon successful signup
    };

    return (
        <div className="min-h-screen bg-black flex  justify-center  gap-5 items-center">

            <div className=' flex flex-col gap-7 border-2 border-white p-5 rounded-xl'>
                <p className=" font-bold text-2xl">SIGNUP</p>
                <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=" Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=" Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />

                {error && <p className="text-red-500">{error}</p>}
                <div className='flex'>
                    <button type="button" onClick={signupWithEmail} className="mr-2 text-black bg-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign Up </button>
                    <button type="button" onClick={signupWithGoogle} className=' text-black bg-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'> Google</button>
                    <div className=" border-solid border-white border-t-2 pt-5"></div>
                </div>

            </div>
        </div >
    );
};

export default SignupPage;
