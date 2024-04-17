"use client"

import React from 'react'
import { Button } from 'flowbite-react';
import Link from 'next/link'
import axios from 'axios';


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
    <div>
      <Link href="/resources/n"><Button>Notes</Button></Link>
      <Link href="/resources/q"><Button onClick={getDownloadLink}>Question Paper</Button></Link>
    </div>
  )
}

export default page