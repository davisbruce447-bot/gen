
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageForm } from './components/ImageForm';
import { ImageDisplay } from './components/ImageDisplay';
import { ErrorMessage } from './components/ErrorMessage';
import { fetchModels, generateImage } from './services/n8nWorkflowService';
import type { StableHordeModel, FormData } from './types';

const App: React.FC = () => {
  const [models, setModels] = useState<StableHordeModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number>(0);


  useEffect(() => {
    const loadModels = async () => {
      try {
        setError(null);
        setIsLoadingModels(true);
        const fetchedModels = await fetchModels();
        const activeImageModels = fetchedModels
          .filter(model => model.type === 'image' && model.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        setModels(activeImageModels);
      } catch (err) {
        setError('Failed to fetch available models. Please try again later.');
        console.error(err);
      } finally {
        setIsLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  const handleGenerate = useCallback(async (formData: FormData) => {
    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);
    setGenerationTime(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      setGenerationTime(Date.now() - startTime);
    }, 100);

    try {
      const imageBlob = await generateImage(formData);
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('An error occurred during image generation. The workflow may have timed out or failed. Please check your inputs and try again.');
      console.error(err);
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
              Create Your Image
            </h2>
            <p className="text-gray-400">
              Describe the image you want to create, select a model, and let the AI bring your vision to life. This frontend triggers an n8n workflow that uses the Stable Horde distributed cluster.
            </p>
            <ImageForm
              models={models}
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
              isLoadingModels={isLoadingModels}
            />
            {error && <ErrorMessage message={error} />}
          </div>
          <ImageDisplay
            imageUrl={generatedImage}
            isGenerating={isGenerating}
            generationTime={generationTime}
          />
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by n8n and Stable Horde</p>
      </footer>
    </div>
  );
};

export default App;
