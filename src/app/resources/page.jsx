"use client"

import React from 'react'
import { Button } from 'flowbite-react';
import Link from 'next/link'
import axios from 'axios';

export async function downloadNotes() {
  try {
    const response = await axios.get('/api/telegram');
    const downloadLink = response.data.downloadLink;
    window.location.href = downloadLink;
  } catch (error) {
    console.error(error);
    // Handle error gracefully, e.g., display an error message to the user
  }
}

const page = () => {
  return (
    <div>
      <Link href="/resources/notes"><Button>Notes</Button></Link>
      <Link href="/resources/questions"><Button onClick={downloadNotes}>Question Paper</Button></Link>
    </div>
  )
}

export default page