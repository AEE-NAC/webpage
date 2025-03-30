import { Link } from 'react-router-dom';

const CountryBar = ({ countries }) => {
    return (
        <div className="w-full bg-[#981a3c] p-1 flex items-center justify-center shadow-sm">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            <Link to={'https://cefcanada.org/'} className="px-4 py-1 text-sm text-[#fff] hover:text-[#fff] cursor-pointer whitespace-nowrap transition-colors duration-200">
                <span className="text-[#fff] text-sm font-bold">Canada</span>
            </Link>
                {countries?.map((country, index) => (
                    <Link
                        key={index}
                        to={`/country/${country.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-4 py-1 text-sm text-[#fff] hover:text-[#fff] cursor-pointer whitespace-nowrap transition-colors duration-200"
                    >
                        <span className="text-[#fff] text-sm font-bold">{country}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CountryBar;