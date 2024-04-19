"use client"

import React from 'react'

import axios from 'axios';
import Button from "../../components/Button/DownloadButton"


export async function getDownloadLink() {
  const filename = 'sem_5.pdf'; // Replace with actual filename
  try {
    const response = await axios.get('/api/telegram');
    const downloadLink = response.data.downloadLink;
    window.location.href = downloadLink;
  } catch (error) {

    console.error(error);

  }
}

const page = () => {
  return (
    <div className='p-10'>
      <Button id="Notes" onClick="/resources/n" />
      <Button id="Question Papers" onClick="/resources/q" />
    </div >
  )
}

export default page 