export default function SolutionSection() {
    return (
        <div className="min-h-screen flex items-center  flex-col  justify-center  px-9 ">
        <div className="bg-transparent rounded-lg p-8 w-full flex align-top flex-row justify-between" >
        <h1 className="text-[3.2em] text-left font-bold mb-4">Les solutions multiples de DJONDJON</h1>
        <p className=" text-[1.5em]  mb-4">Lorem ipsum dolor sit amer, melchior, baltazar, ipsum</p>
        </div>
        <div className="bg-gray-300 rounded-lg  w-full h-3/4  ">
          <div className="flex p-6">
            {/* Left Section */}
            <div className=" flex flex-col  w-full gap-x-8">
            <h1 className="text-2xl text-left font-bold mb-4">Nos applis</h1>
            <p className="mb-4 text-left">Lorem ipsum dolor sit amer, melchior, baltazar, ipsum</p>
              <button className="bg-[#00bfff] w-1/2 text-left  text-white px-4 py-2  mb-4">Commencez</button>
              <div className="flex flex-col gap-2 w-4/5  items-start">
                <button className="bg-white text-gray-700 px-4 w-full  text-left py-2  shadow">Socialisation</button>
                <button className="bg-white text-gray-700 px-4 py-2  text-left w-full  shadow">Consultation</button>
                <button className="bg-white text-gray-700 px-4 py-2 text-left  w-full  shadow">PayZot</button>
                <button className="bg-white text-gray-700 px-4 py-2 text-left   w-full   shadow">Marketplace</button>
                <button className="bg-white text-gray-700 px-4 py-2 text-left   w-full  shadow">Publicites</button>
              </div>
            </div>
  
            {/* Right Section */}
            <div className="w-2/3 bg-gray-900 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }