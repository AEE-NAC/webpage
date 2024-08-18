import React from 'react';
import HeroSection from '../components/layout/HeroSection';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Engagements from '../components/layout/Engagements';
import SolutionSection from '../components/layout/SolutionSection';
import TestimonialsSection from '../components/layout/TestimonialsSection';
const LandingPage = () => {
    return (
            <>
            <div style={{backgroundImage:'url(/images/64f6b05e8e6420e45c705e65_hero-shape@1x.png)',backgroundPosition:'top right',backgroundRepeat:'no-repeat',width:'100%',height:'100%' }}>
               <Header></Header>
               <HeroSection></HeroSection>
            </div>
               <Engagements></Engagements>
               <SolutionSection></SolutionSection>
               <TestimonialsSection></TestimonialsSection>
               <Footer></Footer>
            </>
    );
};

export default LandingPage;
