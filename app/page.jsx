import React from 'react'

import Link from 'next/link'
import Hero from '../components/Hero/hero'
import Navbar from "../components/Navbar/navbar"
import Footer from "../components/Footer/footer"

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