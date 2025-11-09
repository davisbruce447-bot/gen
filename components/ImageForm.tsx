import React, { useState } from 'react';
import type { StableHordeModel, FormData } from '../types';

interface ImageFormProps {
  models: StableHordeModel[];
  onSubmit: (formData: FormData) => void;
  isGenerating: boolean;
  isLoadingModels: boolean;
}

export const ImageForm: React.FC<ImageFormProps> = ({
  models,
  onSubmit,
  isGenerating,
  isLoadingModels,
}) => {
  const [prompt, setPrompt] = useState('A beautiful watercolor painting of a majestic fox in a vibrant autumn forest');
  const [email, setEmail] = useState('');
  const [selectedModel, setSelectedModel] = useState('Deliberate');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if(validationError) {
      setEmailError(validationError);
      return;
    }
    setEmailError('');
    onSubmit({ Prompt: prompt, email, Model: selectedModel });
  };

  const isDisabled = isGenerating || isLoadingModels;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g., A robot holding a red skateboard"
          required
          disabled={isDisabled}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Your Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
             setEmail(e.target.value);
             if (emailError) setEmailError(validateEmail(e.target.value));
          }}
          className={`w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition ${emailError ? 'border-red-500' : ''}`}
          placeholder="Enter your email to receive the image"
          required
          disabled={isDisabled}
        />
        {emailError && <p className="mt-2 text-sm text-red-500">{emailError}</p>}
      </div>
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
          Model
        </label>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          disabled={isDisabled}
        >
          <option value="Deliberate">Deliberate</option>
          <option value="AbsoluteReality">AbsoluteReality</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isDisabled}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
  );
};
