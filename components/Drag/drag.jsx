'use client'

import { useEffect, useState } from 'react';
import './drag.css';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';

function Drag() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No selected file');

    return (
        <main>
            <form
                action=""
                onClick={() => document.querySelector('.input-field').click()}
                className="hello"
            >
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="input-field"
                    hidden
                    onChange={({ target: { files } }) => {
                        files[0] && setFileName(files[0].name);
                        if (files) {
                            setFile(files[0]);
                        }
                    }}
                />
                {file ? (
                    <span>{fileName}</span>
                ) : (
                    <>
                        <MdCloudUpload size={60} />
                        <p>Browse Files to upload</p>
                    </>
                )}
            </form>


        </main >
    );
}

export default Drag;
