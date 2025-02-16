import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Staff = () => {
    const staffMembers = {
        Direction: {
            'Directeur Général': ['John Doe'],
            'Directeur Adjoint': ['Jane Smith']
        },
        Administration: {
            'Ressources Humaines': ['Alice Johnson', 'Bob Wilson'],
            'Comptabilité': ['Carol Brown', 'David Miller']
        },
        'Équipe Technique': {
            'Chef de Projet': ['Eve Anderson'],
            'Développeurs': ['Frank Thomas', 'Grace Lee', 'Henry Clark'],
            'Designers': ['Ivy White', 'Jack Robinson']
        }
    };

    const renderStaffTree = (data) => {
        return (
            <div className="w-full max-w-4xl mx-auto">
                {Object.entries(data).map(([department, positions]) => (
                    <div key={department} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{department}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(positions).map(([position, members]) => (
                                <div key={position} className="bg-white rounded-lg shadow-md p-4">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{position}</h3>
                                    <ul className="space-y-2">
                                        {members.map((member) => (
                                            <li key={member} className="text-gray-600">{member}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 mt-11">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Notre Équipe</h1>
                {renderStaffTree(staffMembers)}
            </main>
            <Footer />
        </div>
    );
};

export default Staff;
