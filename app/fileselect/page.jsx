'use client'
import React from "react";
import DeleteIcon from "../assets/images/delete.png";
import TickIcon from "../assets/images/tickmark.png";


const files = [
    { id: 1, name: "IOT sem1", url: "https://mrcet.com/downloads/digital_notes/EEE/IoT%20&%20Applications%20Digital%20Notes.pdf" },
    { id: 2, name: "DCN notes", url: "https://www.tvu.edu.in/wp-content/uploads/2020/01/DCN_Notes_Final%20(1)_compressed.pdf" },
    { id: 3, name: "MEC notes", url: "https://mrcet.com/downloads/digital_notes/EEE/BME%20DIGITAL%20NOTES.pdf" },
];

export default function Page() {
    const handleDelete = (id) => {

        console.log("Delete file with id:", id);
    };

    const handleTick = (id) => {

        console.log("Tick file with id:", id);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-500 dark:bg-gray-700  dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-gray-800 dark:text-white">FILENAME</th>
                        <th scope="col" className="px-6 py-3 text-right text-gray-800 dark:text-white">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr className="bg-gray-400 border-b dark:bg-gray-800 dark:border-gray-700" key={file.id}>

                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <h2 className="px-6 py-4">
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer dark:text-white text-black">{file.name}</a>
                                </h2>
                            </th>
                            <th scope="row" className=" flex flex-row px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white justify-end p-4">
                                <img
                                    src={DeleteIcon}
                                    alt="Delete"
                                    className="cursor-pointer mr-2"
                                    onClick={() => handleDelete(file.id)}
                                />
                                <img
                                    src={TickIcon}
                                    alt="Tick"
                                    className="cursor-pointer"
                                    onClick={() => handleTick(file.id)}
                                />
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}
