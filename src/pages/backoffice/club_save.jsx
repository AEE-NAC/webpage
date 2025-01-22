import React, { useState } from 'react';
import { PlusCircle, Edit2, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/layout/Header';

const ClubSave = () => {
    const [clubs, setClubs] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        type: '',
        totalCount: 0,
        girlsCount: 0,
        boysCount: 0,
        convertedGirls: 0,
        convertedBoys: 0,
        location: '',
        city: ''
    });

    const clubTypes = ['Sport', 'Culture', 'Education', 'Social'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedClubs = [...clubs];
            updatedClubs[editingIndex] = formData;
            setClubs(updatedClubs);
            setEditingIndex(null);
        } else {
            setClubs(prev => [...prev, formData]);
        }
        setFormData({
            type: '',
            totalCount: 0,
            girlsCount: 0,
            boysCount: 0,
            convertedGirls: 0,
            convertedBoys: 0,
            location: '',
            city: ''
        });
        setIsFormVisible(false);
    };

    const handleEdit = (index) => {
        setFormData(clubs[index]);
        setEditingIndex(index);
        setIsFormVisible(true);
    };

    const handleDelete = (index) => {
        const updatedClubs = clubs.filter((_, i) => i !== index);
        setClubs(updatedClubs);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                    onClick={() => setIsFormVisible(!isFormVisible)}
                >
                    <PlusCircle size={20} />
                    {isFormVisible ? 'Hide Form' : 'Add New Club'}
                </motion.button>

                <AnimatePresence>
                    {isFormVisible && (
                        <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSubmit}
                            className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-100"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Club Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select a type</option>
                                        {clubTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Effectif Total</label>
                                    <input
                                        type="number"
                                        name="totalCount"
                                        value={formData.totalCount}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre de Filles</label>
                                    <input
                                        type="number"
                                        name="girlsCount"
                                        value={formData.girlsCount}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre de Garçons</label>
                                    <input
                                        type="number"
                                        name="boysCount"
                                        value={formData.boysCount}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Filles Converties</label>
                                    <input
                                        type="number"
                                        name="convertedGirls"
                                        value={formData.convertedGirls}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Garçons Convertis</label>
                                    <input
                                        type="number"
                                        name="convertedBoys"
                                        value={formData.convertedBoys}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Save size={20} />
                                        {editingIndex !== null ? 'Update Club' : 'Save Club'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {clubs.map((club, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">{club.type} Club</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-600">Location: {club.location}</p>
                                <p className="text-gray-600">Effectif Total: {club.totalCount}</p>
                                <div className="flex justify-between">
                                    <span className="text-blue-500">Filles: {club.girlsCount}</span>
                                    <span className="text-blue-500">Garçons: {club.boysCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-500">Filles Converties: {club.convertedGirls}</span>
                                    <span className="text-green-500">Garçons Convertis: {club.convertedBoys}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClubSave;