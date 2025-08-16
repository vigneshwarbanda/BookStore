import React from 'react'

const Hero = () => {
  return (
    <div className='h-[75vh] flex item-center justify-center'>
      <div className='w-3/6 lg:w-3/6 flex flex-col items-center lg:items-start'>
      <h1 className='text-6xl  font-semibold text-white'>Welcome to Bookstore</h1>
      <p className='mt-4 text-x1 text-zinc-300' > 
        We have a wide variety of books for you to choose from. Whether you're looking for fiction
      </p>
      <div>
        <button className="text-white text-2xl font-semibold border border-yellow-100 px-8 py-2 hover:bg-zinc-800 rounded-full flex justify-center items-center mx-2 my-8">
            Discover Books
        </button>
      </div>

      </div>
      <div className='w-full lg:w-3/6'>
        <img src="./homehome.jpg" alt="hero" />
      </div>
    </div>
  )
}

export default Hero
