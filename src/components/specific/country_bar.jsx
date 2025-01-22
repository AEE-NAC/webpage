const CountryBar = ({ countries }) => {
    return (
        <div className="w-full bg-gray-100 p-2 flex items-center justify-center shadow-sm">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                {countries?.map((country, index) => (
                    <div
                        key={index}
                        className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap transition-colors duration-200"
                    >
                        {country}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryBar;