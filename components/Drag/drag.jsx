'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';

function UploadPage() {


    const router = useRouter();
    const { name } = router.query || { name: "" };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData((event.target));
        const file = formData.get('file')

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            setMessage(response.data.message);
            if (name) {
                router.push('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [message, setMessage] = React.useState("");

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl text-gray-500 font-bold mb-2">Upload File</h1>
                    <p className="text-gray-500">Enter the name of the file you want to upload</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter file name"
                        className="block w-full p-2 mb-4 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <input
                        type="file"
                        name="file"
                        className="block w-full p-2 mb-4 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Upload
                    </button>
                </form>
                <div className="mt-6">
                    <p className="text-gray-500">{message}</p>
                </div>
            </div>
        </div >
    );
}

export default UploadPage;