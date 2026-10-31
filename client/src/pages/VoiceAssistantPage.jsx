import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function VoiceAssistantPage() {
  const { user, activePlot } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: user?.language === 'en'
        ? `Vanakkam ${user?.full_name || 'Farmer'}! I am your Uzhavan Hub AI Agri-Advisor. You can ask me by voice or text about crop diseases, today's mandi prices, weather alerts, 100% drip subsidies, or call 1962 emergency animal ambulance.`
        : `வணக்கம் ${user?.full_name || 'உழவர் பெருமக்களே'}! நான் உங்கள் உழவன் ஹப் AI விவசாய ஆலோசகர். பயிர் நோய் கட்டுப்பாடு, இன்றைய மண்டி விலை, மழை முன்னறிவிப்பு அல்லது 1962 கால்நடை ஆம்புலன்ஸ் பற்றி குரல் மூலமாகவோ அல்லது தட்டச்சு செய்தோ கேட்கலாம்.`,
      category: 'welcome',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState(user?.language || 'ta');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeak = (text, lang = selectedLang === 'ta' ? 'ta-IN' : 'en-IN') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (queryText = inputText) => {
    const textToSend = queryText.trim();
    if (!textToSend) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.askAssistant({
        message: textToSend,
        language: selectedLang
      });

      const replyText = res.reply || 'Advisory engine received your request.';
      const botMsg = {
        id: 'reply_' + Date.now(),
        sender: 'assistant',
        text: replyText,
        category: res.category || 'advisory',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      if (autoSpeak) {
        handleSpeak(replyText, res.language === 'en' ? 'en-IN' : 'ta-IN');
      }
    } catch (err) {
      console.error('Assistant error', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          text: 'மன்னிக்கவும், தகவல் பெறுவதில் சிறு தாமதம் ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. You can type your query in Tamil or English below!');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'ta' ? 'ta-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech init error', err);
      setIsListening(false);
    }
  };

  const suggestedQuestions = selectedLang === 'ta' ? [
    'மண்டியில் இன்றைய பொன்னி நெல் விலை என்ன?',
    'நெற்பயிரில் இலைக் கருகல் நோய்க்கு என்ன மருந்து?',
    'நாளை மழை வருமா? உரம் போடலாமா?',
    'சொட்டு நீர்ப் பாசன மானியம் பெறுவது எப்படி?',
    'கால்நடை அவசர உதவி எண் என்ன?'
  ] : [
    'What is today\'s Ponni paddy mandi price in Thanjavur?',
    'How do I treat blast disease in my paddy field?',
    'Is rain expected tomorrow? Can I apply fertilizer?',
    'How to apply for 100% micro-irrigation subsidy?',
    'What is the animal emergency ambulance hotline?'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl shadow-inner">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Uzhavan AI Bilingual Voice Assistant</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-emerald-100 font-tamil">
              குரல்வழி விவசாய ஆலோசகர் — பேசுங்கள், தீர்வு பெறுங்கள்
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-emerald-950/60 p-1 rounded-xl border border-emerald-700/50">
            <button
              onClick={() => setSelectedLang('ta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLang === 'ta' ? 'bg-[#14532d] text-white shadow' : 'text-emerald-200'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLang === 'en' ? 'bg-[#14532d] text-white shadow' : 'text-emerald-200'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title="Auto Speak Voice Answers"
            className={`p-2 rounded-xl border transition-colors ${
              autoSpeak ? 'bg-amber-400 text-stone-900 border-amber-300' : 'bg-white/10 text-stone-300 border-white/20'
            }`}
          >
            <Icon name="{autoSpeak ? 'volume_up' : 'volume_off'}" className="text-sm" />
          </button>
        </div>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-stone-400 whitespace-nowrap">Suggested:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs text-stone-700 hover:border-[#14532d] hover:text-[#14532d] transition-all whitespace-nowrap shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-stone-50 rounded-2xl border border-stone-200 p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-[#14532d] text-white rounded-br-none'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className={`text-[10px] font-bold uppercase ${m.sender === 'user' ? 'text-emerald-200' : 'text-emerald-800'}`}>
                  {m.sender === 'user' ? (user?.full_name || 'Farmer') : 'Uzhavan Hub AI'}
                </span>
                <span className={`text-[10px] ${m.sender === 'user' ? 'text-emerald-300' : 'text-stone-400'}`}>
                  {m.timestamp}
                </span>
              </div>

              <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
                {m.text}
              </div>

              {m.sender === 'assistant' && (
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400 capitalize">Category: {m.category || 'advisory'}</span>
                  <button
                    onClick={() => handleSpeak(m.text, selectedLang === 'ta' ? 'ta-IN' : 'en-IN')}
                    className="p-1 text-stone-400 hover:text-[#14532d] rounded transition-colors"
                    title="Read Aloud"
                  >
                    <Icon name="volume_up" className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex items-center gap-2">
              <Icon name="progress_activity" className="animate-spin text-[#14532d] text-sm" />
              <span className="text-xs text-stone-500 font-medium">Uzhavan AI is analyzing agronomic datasets...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input & Mic Dock */}
      <div className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-lg flex items-center gap-3">
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-200'
              : 'bg-emerald-50 text-[#14532d] hover:bg-emerald-100 border border-emerald-200'
          }`}
          title={isListening ? 'Listening... Tap to stop' : 'Tap to speak query'}
        >
          <Icon name="{isListening ? 'mic' : 'mic_none'}" className="text-xl" />
        </button>

        <input
          type="text"
          placeholder={
            isListening
              ? 'Listening to your voice... Speak now...'
              : selectedLang === 'ta'
              ? 'உங்கள் கேள்வியை இங்கே கேட்கவும் அல்லது மைக் பட்டனை அழுத்தவும்...'
              : 'Type your farming question or tap microphone...'
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-3 border-none bg-stone-50 rounded-xl text-sm focus:ring-2 focus:ring-[#14532d] focus:bg-white"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || loading}
          className="px-5 py-3 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl font-bold text-sm shadow transition-all flex items-center gap-1.5 disabled:opacity-40"
        >
          <span>Send</span>
          <Icon name="send" className="text-sm" />
        </button>
      </div>
    </div>
  );
}
