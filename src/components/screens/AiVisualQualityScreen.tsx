import React, { useState } from 'react';
import { QualityCheckResult, AppLanguage } from '../../types';
import { MOCK_QUALITY_ANALYSIS, ASSETS } from '../../data/mockData';

interface AiVisualQualityScreenProps {
  language: AppLanguage;
  onNavigate: (screen: any) => void;
}

export const AiVisualQualityScreen: React.FC<AiVisualQualityScreenProps> = ({
  language,
  onNavigate
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<QualityCheckResult>(MOCK_QUALITY_ANALYSIS);
  const [activeImage, setActiveImage] = useState<string>(ASSETS.visualInspectionTomatoes);

  const handleSimulateScan = (cropType: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (cropType === 'Chilli') {
        setActiveImage(ASSETS.chilliPreset);
        setAnalysisResult({
          id: `qc-${Date.now()}`,
          cropName: 'Bhut Jolokia King Chilli',
          batchCode: 'C004',
          timestamp: 'Just Now',
          qualityGrade: 'WARNING',
          spoilageRiskScore: 16,
          freshnessScore: 84,
          defects: {
            rottenDetected: false,
            colorDegradation: true,
            fungalGrowth: false,
            physicalDamage: true,
            details: 'Minor tip browning and 5% calyx dehydration noticed. Recommend dispatch within 24 hours.'
          },
          recommendation: 'Sell soon. Good marketable pungency, but humidity fluctuations can accelerate skin wrinkles.',
          imageUrl: ASSETS.chilliPreset
        });
      } else if (cropType === 'Cabbage') {
        setActiveImage(ASSETS.cabbagePreset);
        setAnalysisResult({
          id: `qc-${Date.now()}`,
          cropName: 'Cabbage & Brassica',
          batchCode: 'C210',
          timestamp: 'Just Now',
          qualityGrade: 'GOOD',
          spoilageRiskScore: 2,
          freshnessScore: 94,
          defects: {
            rottenDetected: false,
            colorDegradation: false,
            fungalGrowth: false,
            physicalDamage: false,
            details: 'Firm heads with intact outer wrapper leaves. Zero black rot or caterpillar damage.'
          },
          recommendation: 'Grade A export quality. Safe to store for up to 18 days under 0-2°C cold storage.',
          imageUrl: ASSETS.cabbagePreset
        });
      } else {
        setActiveImage(ASSETS.crateTomatoesInColdRoom);
        setAnalysisResult(MOCK_QUALITY_ANALYSIS);
      }
    }, 1200);
  };

  const isGood = analysisResult.qualityGrade === 'GOOD';
  const isWarning = analysisResult.qualityGrade === 'WARNING';
  const isCritical = analysisResult.qualityGrade === 'CRITICAL';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5">
      {/* Header Banner */}
      <section className="w-full bg-[#121212] rounded-[2rem] border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-[#121212] to-[#121212]">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">
            Computer Vision Spoilage Detection
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            AI Visual Quality Check
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Automated defect detection, rot inspection & shelf-life grading
          </span>
        </div>

        <div className="flex gap-2">
          {['Tomato', 'Cabbage', 'Chilli'].map((crop) => (
            <button
              key={crop}
              onClick={() => {
                setSelectedCrop(crop);
                handleSimulateScan(crop);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </section>

      {/* Main Inspection View & AI Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Visual Camera / Scan Canvas */}
        <div className="bg-[#121212] rounded-[2.5rem] border border-white/10 p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Visual Sensor Feed
            </span>
            <span className="text-xs font-mono text-emerald-400">Batch #{analysisResult.batchCode}</span>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-emerald-500/20 bg-black flex items-center justify-center group">
            <img
              src={activeImage}
              alt="Visual crop inspection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* AI Bounding Boxes Overlay */}
            <div className="absolute inset-0 p-6 pointer-events-none flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="border-2 border-emerald-400/80 bg-emerald-950/40 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-emerald-300">
                  Target: {analysisResult.cropName} (Conf: 98.6%)
                </div>
                <div className="border border-white/20 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-white/70">
                  {analysisResult.timestamp}
                </div>
              </div>

              {/* Scanning crosshairs effect when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                  <div className="w-full h-1 bg-emerald-400 shadow-lg shadow-emerald-400 animate-bounce" />
                </div>
              )}

              <div className="self-end border-2 border-emerald-400/80 bg-emerald-950/60 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-mono text-emerald-300">
                Freshness: {analysisResult.freshnessScore}%
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            disabled={isAnalyzing}
            onClick={() => handleSimulateScan(selectedCrop)}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">
              {isAnalyzing ? 'sync' : 'photo_camera'}
            </span>
            <span>{isAnalyzing ? 'Analyzing AI Model...' : 'Take New Inspection Photo'}</span>
          </button>
        </div>

        {/* Diagnostic Results Card */}
        <div className="bg-[#121212] rounded-[2.5rem] border border-white/10 p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            {/* Overall Rating Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 block">
                  AI Quality Classification
                </span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    isGood ? 'text-emerald-400' : isWarning ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  GRADE: {analysisResult.qualityGrade}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-white/40 block">Spoilage Risk</span>
                <span className="text-xl font-bold text-white font-mono">
                  {analysisResult.spoilageRiskScore}% Risk
                </span>
              </div>
            </div>

            {/* 4 Core Defect Tests */}
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-wider">
                Defect Breakdown
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* Rotten / Softening */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-white/80 font-medium">Rotten Produce</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>None</span>
                  </span>
                </div>

                {/* Color Changes */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-white/80 font-medium">Color Uniformity</span>
                  <span
                    className={`text-xs font-mono font-bold flex items-center gap-1 ${
                      analysisResult.defects.colorDegradation ? 'text-yellow-400' : 'text-emerald-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {analysisResult.defects.colorDegradation ? 'warning' : 'check_circle'}
                    </span>
                    <span>{analysisResult.defects.colorDegradation ? 'Minor' : 'Optimal'}</span>
                  </span>
                </div>

                {/* Fungal Mold */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-white/80 font-medium">Fungal Mold</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>0% Clean</span>
                  </span>
                </div>

                {/* Physical Damage */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-white/80 font-medium">Physical Damage</span>
                  <span
                    className={`text-xs font-mono font-bold flex items-center gap-1 ${
                      analysisResult.defects.physicalDamage ? 'text-yellow-400' : 'text-emerald-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {analysisResult.defects.physicalDamage ? 'info' : 'check_circle'}
                    </span>
                    <span>{analysisResult.defects.physicalDamage ? 'Slight' : 'Intact'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* AI Actionable Guidance for Farmers */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
                <span>Farmer Guidance & Storage Advice</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                {analysisResult.recommendation}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-white/40 font-mono">CROPIQ Vision v1.8 Edge</span>
            <button
              onClick={() => onNavigate('market')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center gap-1"
            >
              <span>Check Market Rates</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
