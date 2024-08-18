import React from 'react';

const Footer = () => {
    return (
        <footer className="min-h-2/3 w-full bg-gray-50 py-8 gap-y-4 ">
            <div className="h-full w-full gap-y-10  container px-10 flex flex-col justify-around ">
                <div className="flex  w-full flex-col md:flex-row justify-between items-center md:items-start">
                    <div className="w-full  mb-8 md:mb-0 flex flex-row justify-between">
                      <div className='flex flex-col'>
                        <h2 className="text-2xl text-left font-bold">Join our newsletter</h2>
                        <p className="text-gray-600">we'll send you nice insight once per week no spam</p>
                    </div>
                        <div className="mt-4 bg-white flex rounded-full">
                            <input 
                                type="email" 
                                placeholder="your email" 
                                className="py-2 px-4 rounded-full  focus:outline-none"
                            />
                            <button className="bg-teal-600 text-white py-2 px-4 rounded-full">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full ">
                        <div className="mb-8 md:mb-0 md:mr-16"> 
                            <img src="/images/logo@1x.png" style={{width:150,height:50}} alt="DJONDJON Logo" className="mb-4"/>
                            <p className="text-gray-600 w-2/3 text-left">Conçu pour vous, votre bien-être est la source de notre bien-être.</p>
                        </div>
                        <div className="flex flex-col md:flex-row self-end">
                            <div className="mb-8 md:mb-0 md:mr-16">
                                <h3 className="font-bold mb-4">Navigation</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>Accueil</li>
                                    <li>Produit</li>
                                    <li>Ressources</li>
                                    <li>Tarifs</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-4">Features</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>Help center</li>
                                    <li>Blog</li>
                                    <li>Privacy policy</li>
                                    <li>Terms of Service</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                <div className="flex flex-col md:flex-row justify-between w-full  items-center mt-8">
                    <p className="text-gray-600">&copy; 2024 DJONDJON All rights reserved</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-teal-600">
                            <img src="email-icon-url" alt="Email Icon" className="w-6 h-6"/>
                        </a>
                        <a href="#" className="text-teal-600">
                            <img src="whatsapp-icon-url" alt="WhatsApp Icon" className="w-6 h-6"/>
                        </a>
                        <a href="#" className="text-teal-600">
                            <img src="facebook-icon-url" alt="Facebook Icon" className="w-6 h-6"/>
                        </a>
                        <a href="#" className="text-teal-600">
                            <img src="instagram-icon-url" alt="Instagram Icon" className="w-6 h-6"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
