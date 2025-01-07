import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import translations from './multistep.json'; // Importez le fichier JSON

// Fonction pour changer la langue
export const changeLanguage = (lang, onLanguageChange) => {
  if (onLanguageChange) {
    onLanguageChange(lang); // Notifie le parent du changement de langue
  }
};

const MultiStepForm = ({ config, onSubmit, apiClient,language, onLanguageChange }) => {
  const { steps, icons, palettes } = config;
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [tempMultipleData, setTempMultipleData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  //const [language, setLanguage] = useState(lang); // État pour la langue courante
  const [showMultipleForm, setShowMultipleForm] = useState(false); // État pour afficher/masquer le formulaire multiple
  const formRefs = useRef([]);

  // Fonction pour obtenir la couleur de la palette
  const getColor = (key) => {
    return palettes?.[key] || getDefaultColor(key);
  };

  // Fonction pour obtenir la couleur par défaut
  const getDefaultColor = (key) => {
    const defaultColors = {
      primary: '#2563eb',
      secondary: '#22c55e',
      background: '#ffffff',
      border: '#e5e7eb',
      text: '#1f2937',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return defaultColors[key] || '#000000';
  };
  console.log(language);
  const t = (key) => translations[language][key] || key; // Fonction pour obtenir la traduction

  const addToRefs = (el) => {
    if (el && !formRefs.current.includes(el)) {
      formRefs.current.push(el);
    }
  };

  const handleTempChange = (e, fieldKey) => {
    const { name, value } = e.target;
    setTempMultipleData((prev) => ({
      ...prev,
      [fieldKey]: {
        ...(prev[fieldKey] || {}),
        [name]: value,
      },
    }));
  };

  const handleChange = (e, fieldKey) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleAddOrUpdateMultiple = (fieldKey) => {
    const newItem = tempMultipleData[fieldKey];
    if (editingIndex !== null) {
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: prev[fieldKey].map((item, index) =>
          index === editingIndex ? newItem : item
        ),
      }));
      setEditingIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: [...(prev[fieldKey] || []), newItem],
      }));
    }
    setTempMultipleData((prev) => ({ ...prev, [fieldKey]: {} }));
    setShowMultipleForm(false); // Masquer le formulaire après l'enregistrement
  };

  const handleStartEdit = (fieldKey, index) => {
    setEditingIndex(index);
    setTempMultipleData((prev) => ({
      ...prev,
      [fieldKey]: { ...formData[fieldKey][index] },
    }));
    setShowMultipleForm(true); // Afficher le formulaire pour la modification
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setTempMultipleData({});
    setShowMultipleForm(false); // Masquer le formulaire en cas d'annulation
  };

  const handleRemove = (fieldKey, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: prev[fieldKey].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (apiClient) {
        const response = await apiClient.save(formData);
        console.log('Données sauvegardées:', response);
      }
      onSubmit?.(formData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue lors de la sauvegarde');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const renderPreviewCard = (field, item, index) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl p-4 mb-3 ring-1 ring-gray-100 hover:ring-gray-200 transition-all duration-200"
        style={{ backgroundColor: getColor('background'), borderColor: getColor('border') }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-grow space-y-1.5">
            {field.previewFields?.map((previewField) => (
              <div key={previewField.key}>
                <span className="text-gray-600 text-sm">
                  {previewField.label}:
                </span>{' '}
                <span className="text-gray-900 font-medium">
                  {item[previewField.key]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 ml-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handleStartEdit(field.key, index)}
              className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              title={t('edit')}
              style={{ color: getColor('text'), backgroundColor: getColor('background') }}
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handleRemove(field.key, index)}
              className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
              title={t('delete')}
              style={{ color: getColor('text'), backgroundColor: getColor('background') }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full py-4 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: getColor('background') }}>
      <div className="max-w-4xl mx-auto">
        <div className="lg:border lg:border-gray-100 lg:rounded-2xl lg:bg-white lg:p-8" style={{ borderColor: getColor('border'), backgroundColor: getColor('background') }}>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center mb-6">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <div className="absolute inset-0 rounded-full border border-gray-100" style={{ borderColor: getColor('border') }}></div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100 stroke-current"
                    strokeWidth="2"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    initial={false}
                    animate={{
                      strokeDasharray: `${((currentStep + 1) / steps.length) * 100}, 100`
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-blue-600 stroke-current"
                    strokeWidth="2"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {icons[currentStep] &&
                      React.createElement(icons[currentStep], {
                        className: 'w-6 h-6 md:w-8 md:h-8 text-blue-600',
                      })}
                  </motion.div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <motion.h2
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl md:text-2xl font-semibold text-gray-900"
                  style={{ color: getColor('text') }}
                >
                  {steps[currentStep].title}
                </motion.h2>
                <motion.p
                  key={`subtitle-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500 mt-1"
                  style={{ color: getColor('text') }}
                >
                  {steps[currentStep].subtitle}
                </motion.p>
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    backgroundColor: index === currentStep
                      ? getColor('primary')
                      : index < currentStep
                      ? getColor('secondary')
                      : getColor('border')
                  }}
                  className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="bg-white rounded-xl" style={{ backgroundColor: getColor('background') }}>
                    {field.multiple ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900" style={{ color: getColor('text') }}>
                          {field.label}
                        </h3>

                        {!showMultipleForm && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setShowMultipleForm(true)}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                              style={{ backgroundColor: getColor('primary'), color: getColor('text') }}
                            >
                              <PlusCircle className="w-4 h-4 mr-2" />
                              {t('add')}
                            </motion.button>

                            {formData[field.key]?.length > 0 && (
                              <div className="mt-6">
                                <div className="flex items-center mb-4">
                                  <h4 className="text-base font-medium text-gray-900" style={{ color: getColor('text') }}>
                                    {field.previewTitle || t('addedItems')}
                                  </h4>
                                  <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full" style={{ backgroundColor: getColor('background'), color: getColor('text') }}>
                                    {formData[field.key].length} élément
                                    {formData[field.key].length > 1 ? 's' : ''}
                                  </span>
                                </div>
                                <AnimatePresence>
                                  {formData[field.key].map((item, index) =>
                                    renderPreviewCard(field, item, index)
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </>
                        )}

                        {showMultipleForm && (
                          <div className="bg-gray-50 rounded-xl p-4" style={{ backgroundColor: getColor('background') }}>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {field.fields.map((subField) => (
                                <div key={subField.key}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: getColor('text') }}>
                                    {subField.label}
                                  </label>
                                  {subField.type === 'select' ? (
                                    <select
                                      name={subField.key}
                                      value={tempMultipleData[field.key]?.[subField.key] || ''}
                                      onChange={(e) => handleTempChange(e, field.key)}
                                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                                      style={{ backgroundColor: getColor('background'), borderColor: getColor('border') }}
                                    >
                                      <option value="">Sélectionnez une option</option>
                                      {subField.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type={subField.type || 'text'}
                                      name={subField.key}
                                      value={tempMultipleData[field.key]?.[subField.key] || ''}
                                      onChange={(e) => handleTempChange(e, field.key)}
                                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                                      placeholder={subField.placeholder}
                                      style={{ backgroundColor: getColor('background'), borderColor: getColor('border') }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                              {editingIndex !== null && (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center"
                                  style={{ color: getColor('text'), backgroundColor: getColor('background') }}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  {t('cancel')}
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => handleAddOrUpdateMultiple(field.key)}
                                className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                                  editingIndex !== null
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                style={{ backgroundColor: editingIndex !== null ? getColor('success') : getColor('primary'), color: getColor('text') }}
                              >
                                {editingIndex !== null ? (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {t('update')}
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {t('save')}
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: getColor('text') }}>
                          {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            name={field.key}
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(e, field.key)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                            style={{ backgroundColor: getColor('background'), borderColor: getColor('border') }}
                          >
                            <option value="">Sélectionnez une option</option>
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type || 'text'}
                            name={field.key}
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(e, field.key)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                            placeholder={field.placeholder}
                            ref={addToRefs}
                            style={{ backgroundColor: getColor('background'), borderColor: getColor('border') }}
                          />
                        )}
                        {field.helperText && (
                          <p className="mt-1 text-sm text-gray-500" style={{ color: getColor('text') }}>
                            {field.helperText}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="flex justify-between pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {currentStep > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    style={{ backgroundColor: getColor('background'), color: getColor('text') }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('previous')}
                  </motion.button>
                )}
              </AnimatePresence>
              
              <motion.div className="ml-auto">
                {currentStep < steps.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    style={{ backgroundColor: getColor('primary'), color: getColor('text') }}
                  >
                    {t('next')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    style={{ backgroundColor: getColor('success'), color: getColor('text') }}
                  >
                    {t('save')}
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export {
  MultiStepForm
};