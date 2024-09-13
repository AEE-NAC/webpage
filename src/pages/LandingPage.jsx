import React from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Ministries from '../components/layout/ministries';
import About from '../components/layout/About';
import Carousel from '../components/layout/carousel';
import WeeklyWord from '../components/layout/weekly';
import Blog from '../components/layout/Blog';
const LandingPage = () => {
    return (
            <>
               <Header></Header>
               <div className='flex h-full mb-[250px]'>
               <Carousel></Carousel>
               <div className=' px-12 h-[200px] rounded-[12px] bg-transparent  left-0 w-[200] absolute top-[220px]'>
                <h1 className='p-2 rounded-[12px] mb-3 bg-white' >Lorem ipsum Dolor amer </h1>
                <p className='p-3 rounded-[12px] bg-white w-1/3 relative left-0'>Lorem ipsum dolor sit amer </p>
               </div>
               </div>
               <About></About>
               <Ministries></Ministries>
               <WeeklyWord></WeeklyWord>
               <Blog></Blog>
               <Footer></Footer>
            </>
    );
};

export default LandingPage;
