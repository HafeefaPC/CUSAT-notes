import React from 'react'
import { Button } from 'flowbite-react';
import Link from 'next/link'

const home = () => {
  return (
    <div>
      <Link href="/resources"><Button>Resources</Button></Link>
    </div>
  )
}

export default home