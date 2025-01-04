import React from 'react';

const Footer = () => {
    return (
        <>
        <footer className="py-8 px-8 bg-secondary text-white" style={{color:'#2a2c41',background:'#fcfcfc'}}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8" style={{color: '#2a2c41'}}>
          
            <div className="text-center md:text-left">
              <img src="./images/logo_1st.png" alt="Logo" className="mx-auto md:mx-0"/>
            </div>
        
            <div>
              <h3 className="font-bold mb-4 text-black">Quick links</h3>
              <ul className="space-y-2">
                <li><a className="hover:underline" href="#" rel="ugc">Accueil</a></li>
                <li><a className="hover:underline" href="#" rel="ugc">À propos</a></li>
                <li><a className="hover:underline" href="#" rel="ugc">Ministère</a></li>
              </ul>
            </div>
        
            <div>
              <h3 className="font-bold mb-4 text-black">Support</h3>
              <ul className="space-y-2">
                <li><a className="hover:underline" href="#" rel="ugc">FAQs</a></li>
                <li><a className="hover:underline" href="#" rel="ugc">Support Center</a></li>
                <li><a className="hover:underline" href="#" rel="ugc">Contactez-nous</a></li>
              </ul>
            </div>
          
            <div>
              <h3 className="font-bold mb-4 text-black">Child Evangelism Fellowship</h3>
              <p className="text-black">"Chaque enfant, chaque nation, chaque jour"</p>
            </div>
          </div>
  
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0">
            <div>
              <p className="text-black">&copy; 2024 Association pour l’Évangélisation des Enfants  </p>
            </div>
            <div className="flex space-x-4">
              <a href="#!" role="button">
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#1877f2]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </span>
              </a>
              <a href="#!" role="button">
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#c13584]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </span>
              </a>
              <a href="#!" role="button">
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#ea4335]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                </span>
              </a>
              <a href="#!" role="button">
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <style>
      </style>
      </>
    );
    }

export default Footer;
