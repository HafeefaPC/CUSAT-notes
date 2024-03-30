import React from 'react'

import Link from 'next/link'
import Hero from '../app/components/Hero/hero'
import Navbar from "../app/components/Navbar/navbar"
import Footer from "../app/components/Footer/footer"

const home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      {/* <Link href="/resources"><Button>Resources</Button></Link> */}
      <Footer />
    </div>
  )
}

export default home