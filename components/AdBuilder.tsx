import React, { useState } from 'react';
import { generateAdCopy, generateAdImage } from '../services/gemini';
import { GeneratedAd, GenerationStatus, AdCopy } from '../types';
import { BANNER_SIZES, SAMPLE_PROMPTS } from '../constants';
import { Banner } from './Banner';
import { Sparkles, Loader2, Image as ImageIcon, Type, AlertCircle } from 'lucide-react';

export const AdBuilder: React.FC = () => {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<GeneratedAd | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description) return;

    setStatus(GenerationStatus.GENERATING_COPY);
    setError(null);
    setResult(null);

    try {
      // Step 1: Generate Text & Design Tokens
      const copyData = await generateAdCopy(description, url);
      setStatus(GenerationStatus.GENERATING_IMAGE);

      // Step 2: Generate Background Image
      const imageBase64 = await generateAdImage(copyData.imagePrompt);
      
      setResult({
        copy: copyData,
        imageBase64: imageBase64
      });
      setStatus(GenerationStatus.COMPLETED);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const loadSample = (sample: { desc: string, url: string }) => {
    setDescription(sample.desc);
    setUrl(sample.url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            AdGenius
          </span> AI
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Turn a simple product description into a complete, multi-format banner ad campaign in seconds using Gemini 2.5.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-12">
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                Product Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-lg border-slate-300 border p-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                placeholder="e.g. A sleek, noise-cancelling headphone with 40h battery life..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-slate-700 mb-2">
                Product URL <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="url"
                className="w-full rounded-lg border-slate-300 border p-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                placeholder="www.example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="pt-2">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">Try a sample:</p>
                <div className="flex flex-wrap gap-2">
                    {SAMPLE_PROMPTS.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => loadSample(s)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {s.desc.slice(0, 30)}...
                        </button>
                    ))}
                </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!description || status === GenerationStatus.GENERATING_COPY || status === GenerationStatus.GENERATING_IMAGE}
              className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${(!description || status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETED && status !== GenerationStatus.ERROR) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {status === GenerationStatus.GENERATING_COPY && (
                <>
                  <Type className="animate-pulse mr-2 h-5 w-5" /> Generating Copy...
                </>
              )}
              {status === GenerationStatus.GENERATING_IMAGE && (
                <>
                  <ImageIcon className="animate-pulse mr-2 h-5 w-5" /> Rendering Visuals...
                </>
              )}
              {(status === GenerationStatus.IDLE || status === GenerationStatus.COMPLETED || status === GenerationStatus.ERROR) && (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Generate Campaign
                </>
              )}
            </button>
            
            {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-center items-center min-h-[300px]">
            {status === GenerationStatus.IDLE && (
                <div className="text-center text-slate-400">
                    <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Enter details to see magic happen</p>
                </div>
            )}
            {(status === GenerationStatus.GENERATING_COPY || status === GenerationStatus.GENERATING_IMAGE) && (
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium animate-pulse">
                        {status === GenerationStatus.GENERATING_COPY ? "Writing compelling copy..." : "Designing background visuals..."}
                    </p>
                </div>
            )}
            {status === GenerationStatus.COMPLETED && result && (
                <div className="w-full space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Strategy</h3>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-400 block text-xs">Headline</span>
                                <span className="font-medium text-slate-800">{result.copy.headline}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-xs">CTA</span>
                                <span className="font-medium text-slate-800">{result.copy.cta}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-400 block text-xs">Prompt Used</span>
                                <span className="italic text-slate-600 text-xs">{result.copy.imagePrompt}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="h-6 w-6 rounded-full shadow-sm" style={{backgroundColor: result.copy.colors.primary}} title="Primary"></div>
                            <div className="h-6 w-6 rounded-full shadow-sm" style={{backgroundColor: result.copy.colors.secondary}} title="Secondary"></div>
                            <div className="h-6 w-6 rounded-full shadow-sm" style={{backgroundColor: result.copy.colors.background}} title="Background"></div>
                            <div className="h-6 w-6 rounded-full shadow-sm border border-slate-200" style={{backgroundColor: result.copy.colors.text}} title="Text"></div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {status === GenerationStatus.COMPLETED && result && (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900">Generated Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
                {BANNER_SIZES.map((size) => (
                    <div key={size.name} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <Banner 
                            size={size} 
                            data={result.copy} 
                            imageBase64={result.imageBase64} 
                        />
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};