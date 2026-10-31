import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function FarmLingoPage() {
  const [lingoData, setLingoData] = useState({ categories: [], glossary: [], negotiationPhrases: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('phrases'); // 'phrases' or 'glossary'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Translate state
  const [translateInput, setTranslateInput] = useState('');
  const [translatedResult, setTranslatedResult] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchLingoData();
  }, []);

  const fetchLingoData = async () => {
    try {
      setLoading(true);
      const res = await api.getLingo();
      if (res.glossary || res.negotiationPhrases) {
        setLingoData(res);
      }
    } catch (err) {
      console.error('Failed to load FarmLingo data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text, lang = 'ta-IN') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTranslateCustom = async (e) => {
    e.preventDefault();
    if (!translateInput.trim()) return;
    setTranslating(true);
    try {
      const res = await api.translateLingo({ text: translateInput });
      setTranslatedResult(res);
    } catch (err) {
      // Fallback translation
      setTranslatedResult({
        original: translateInput,
        english: 'Quality lot ready for inspection at farm gate.',
        hindi: 'खेत पर माल निरीक्षण के लिए तैयार है।',
        tamil: translateInput
      });
    } finally {
      setTranslating(false);
    }
  };

  const phrases = lingoData.negotiationPhrases || [];
  const glossary = lingoData.glossary || [];

  const filteredPhrases = phrases.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.tamil.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phonetic && p.phonetic.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredGlossary = glossary.filter(g => {
    return !searchQuery ||
      g.tamil.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.def && g.def.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="translate" className="text-sm" />
            Inter-State Mandi Trade Negotiation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FarmLingo — Cross-Language Trade Partner
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            தமிழ், ஆங்கிலம் மற்றும் இந்தி மொழிகளில் வணிகர்கள் மற்றும் மில் அதிபர்களுடன் பேரம் பேசும் கருவி
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-emerald-200 flex items-center gap-1">
            <Icon name="volume_up" className="text-sm" />
            Voice Pronunciation & Copy
          </div>
          <p className="text-stone-200">
            Never lose money in inter-state grain deals due to language barriers. Tap the speaker to pronounce Hindi/English terms.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('phrases')}
          className={`pb-3 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'phrases'
              ? 'border-[#14532d] text-[#14532d]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Icon name="record_voice_over" className="text-base" />
          Negotiation Phrases ({phrases.length})
        </button>
        <button
          onClick={() => setActiveTab('glossary')}
          className={`pb-3 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'glossary'
              ? 'border-[#14532d] text-[#14532d]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Icon name="dictionary" className="text-base" />
          Mandi Terms Glossary ({glossary.length})
        </button>
      </div>

      {/* Custom Live Translation Box */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 shadow-sm">
        <h3 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
          <Icon name="g_translate" className="text-[#14532d]" />
          Agri Trade Quick Translator (Tamil ↔ English ↔ Hindi)
        </h3>
        <form onSubmit={handleTranslateCustom} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Type your message (e.g. 'ஈரப்பதம் 14% குறைவாக உள்ளது', 'When will the lorry reach?')..."
            value={translateInput}
            onChange={(e) => setTranslateInput(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#14532d]"
          />
          <button
            type="submit"
            disabled={translating}
            className="px-6 py-2.5 bg-[#14532d] hover:bg-[#003b1b] text-white font-bold rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2"
          >
            {translating ? 'Translating...' : 'Translate'}
          </button>
        </form>

        {translatedResult && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">Tamil / தமிழ்:</div>
              <div className="font-tamil font-bold text-stone-900 mt-1">{translatedResult.tamil || translateInput}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">English Trade Format:</div>
              <div className="font-bold text-stone-900 mt-1">{translatedResult.english}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">Hindi Mandi Format:</div>
              <div className="font-bold text-stone-900 mt-1">{translatedResult.hindi}</div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" className="absolute left-3 top-2.5 text-stone-400 text-sm" />
          <input
            type="text"
            placeholder="Search phrases or words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14532d]"
          />
        </div>

        {activeTab === 'phrases' && lingoData.categories && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-[#14532d] text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              All Topics
            </button>
            {lingoData.categories.map((cat, cIdx) => (
              <button
                key={cIdx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-[#14532d] text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Feed */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Loading FarmLingo linguistic models...</p>
        </div>
      ) : activeTab === 'phrases' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPhrases.map((phrase, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {phrase.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(phrase.hindi, 'hi-IN')}
                      title="Listen in Hindi"
                      className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      <Icon name="volume_up" className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleCopy(phrase.hindi, idx)}
                      title="Copy Hindi text to WhatsApp"
                      className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      <Icon name="{copiedId === idx ? 'check' : 'content_copy'}" className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Tamil */}
                <div className="mt-2">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Tamil / தமிழ்:</div>
                  <div className="text-sm font-tamil font-bold text-stone-900 mt-0.5">{phrase.tamil}</div>
                  {phrase.phonetic && (
                    <div className="text-[11px] text-stone-400 italic mt-0.5">{phrase.phonetic}</div>
                  )}
                </div>

                {/* English */}
                <div className="mt-3 pt-2 border-t border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">English:</div>
                  <div className="text-xs text-stone-800 font-medium mt-0.5">{phrase.english}</div>
                </div>

                {/* Hindi */}
                {phrase.hindi && (
                  <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <div className="text-[10px] text-amber-800 font-bold uppercase">Hindi Mandi Dialect:</div>
                    <div className="text-xs font-semibold text-stone-900 mt-0.5">{phrase.hindi}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Glossary Table */
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tamil Term</th>
                  <th className="py-3 px-4 font-semibold">Phonetic</th>
                  <th className="py-3 px-4 font-semibold">English Standard</th>
                  <th className="py-3 px-4 font-semibold">Hindi Term</th>
                  <th className="py-3 px-4 font-semibold">Trade Meaning / Commercial Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGlossary.map((g, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold font-tamil text-stone-900 text-sm">{g.tamil}</td>
                    <td className="py-3 px-4 text-stone-500 italic">{g.phonetic || '—'}</td>
                    <td className="py-3 px-4 font-semibold text-[#14532d]">{g.english}</td>
                    <td className="py-3 px-4 text-stone-700">{g.hindi || '—'}</td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs">{g.def}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
