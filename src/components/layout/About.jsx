import React from 'react';

const About = () => (
    <section id="about" className=" bg-trnsparent px-[26px]  h-screen items-center   py-12 md:py-24 lg:py-32">
    <div>
    <div className="bg-[#e45a83ff] rounded-[12px] p-6  container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <img
          src="/images/week_word.jpg"
          width="600"
          height="400"
          alt="About Image"
          className="rounded-2xl w-full object-cover"
          style={{aspectRatio:'600 / 400',objectFit:'cover'}}
        />
      </div>
      <div className="space-y-4">
        <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">About Us</div>
        <h2 className="text-3xl font-bold text-[#0f0f0fff]">Empowering Children, Transforming Lives</h2>
        <p className="text-[#0f0f0fff]">
          Children's Hope is a non-profit Christian organization dedicated to providing education, healthcare, and
          spiritual guidance to underprivileged children around the world. Our mission is to break the cycle of
          poverty and give these children a brighter future.
        </p>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Learn More
        </button>
      </div>
    </div>
    </div>
  </section>
);

export default About;
