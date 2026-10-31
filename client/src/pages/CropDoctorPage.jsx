import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function CropDoctorPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [cropType, setCropType] = useState('Paddy');
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5 MB limit. Please select a smaller photo.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported format. Please select JPEG, PNG, or WebP photo.');
      return;
    }

    setSelectedImage(file);
    setFileDetails({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await api.doctorScan({
        fileName: fileDetails?.name || 'leaf_scan.jpg',
        fileSize: selectedImage?.size || 1024,
        mimeType: selectedImage?.type || 'image/jpeg',
        cropType,
        symptomText
      });

      if (res.success) {
        setResult(res);
      } else {
        setError(res.error || 'Diagnosis failed.');
      }
    } catch (err) {
      setError(err.message || 'Scanning service error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
            🔬
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#003b1b]">
              AI Crop Doctor and Disease Scanner
            </h1>
            <p className="text-xs text-[#404941]">பயிர் மருத்துவர் • Pest Diagnostic & Organic Remedies</p>
          </div>
        </div>

        <p className="text-xs text-[#404941] leading-relaxed">
          Upload a high-resolution photograph of the affected plant leaf, stem, or panicle. Our symptom-based clinical engine identifies probable fungal, bacterial, or nutrient deficiencies and provides organic and standard treatments.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2">
          <Icon name="error" className="text-red-700 text-[18px]" />
          <span>{error}</span>
        </div>
      )}

      {/* UPLOAD & SYMPTOM INPUT FORM */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Left: Drag & Drop / Image File Input */}
          <div>
            <label className="block text-xs font-bold text-[#003b1b] uppercase mb-2">
              Select Leaf / Crop Photograph (Max 5 MB)
            </label>
            <div className="border-2 border-dashed border-[#c0c9be] hover:border-[#14532d] rounded-3xl p-6 text-center cursor-pointer transition-colors relative bg-[#f8f7f0]">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-2xl object-cover shadow-sm"
                  />
                  <div className="text-[11px] text-[#404941]">
                    {fileDetails.name} ({fileDetails.size})
                  </div>
                  <span className="text-[10px] font-bold text-[#003b1b] underline">Click to change photo</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Icon name="add_a_photo" className="text-[42px] text-[#404941]" />
                  <div className="text-xs font-bold text-[#0e1f15]">Click or drag & drop leaf photo here</div>
                  <div className="text-[10px] text-[#404941]">Supported formats: JPEG, PNG, WebP</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Crop Type & Visible Symptoms */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#003b1b] uppercase mb-1">Affected Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-xs focus:outline-none"
              >
                <option value="Paddy">Paddy / Rice (நெல்)</option>
                <option value="Cotton">Cotton (பருத்தி)</option>
                <option value="Banana">Banana (வாழை)</option>
                <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
                <option value="Black Gram">Black Gram (உளுந்து)</option>
                <option value="Tomato">Tomato (தக்காளி)</option>
                <option value="Maize">Maize (மக்காச்சோளம்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#003b1b] uppercase mb-1">
                Visible Symptoms / கூடுதல் அறிகுறிகள்
              </label>
              <textarea
                rows={4}
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="e.g. Spindle shaped spots with brown margins appearing after early morning dew, lower leaves turning yellow..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-xs focus:outline-none"
              ></textarea>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#003b1b] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Icon name="biotech" className="text-[18px]" />
              <span>{loading ? 'Analyzing Plant Pathology Vectors...' : 'Analyze Disease Symptoms'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* DIAGNOSTIC RESULTS DISPLAY */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider">
                  Diagnostic Result
                </span>
                <span className="text-xs font-bold text-[#14532d]">
                  {result.diagnosis.confidencePct}% Clinical Confidence
                </span>
              </div>
              <h2 className="text-xl font-black text-[#003b1b] mt-1">
                {result.diagnosis.diseaseName}
              </h2>
            </div>
            <span className="text-xs text-[#404941] max-w-xs text-right">
              {result.diagnosis.causalAgent}
            </span>
          </div>

          {/* Symptoms Identified */}
          <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/50 space-y-1">
            <span className="text-xs font-bold text-[#003b1b] uppercase">Observed Symptoms Profile:</span>
            <p className="text-xs text-[#404941] leading-relaxed">{result.diagnosis.symptoms}</p>
          </div>

          {/* Organic vs Standard Treatment Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Organic Treatment Guidance */}
            <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="eco" className="text-[#003b1b] text-[20px]" />
                <h3 className="text-xs font-bold text-[#003b1b] uppercase tracking-wider">
                  Organic & Bio-Remedies (இயற்கை மருத்துவம்)
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-[#404941]">
                {result.diagnosis.organicTreatment.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#003b1b] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standard Chemical Treatment */}
            <div className="p-5 rounded-2xl bg-[#f8f7f0] border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="vaccines" className="text-slate-700 text-[20px]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Standard Treatment Guidelines
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-[#404941]">
                {result.diagnosis.standardTreatment.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Preventive Measures & Mandatory Disclaimer */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
              <strong className="block mb-0.5">Preventive Cultural Measures:</strong>
              {result.diagnosis.preventiveMeasures}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[#404941]">
              <strong>Official Escalation Contact:</strong> {result.diagnosis.expertEscalation}
              <span className="block text-[11px] mt-1 text-slate-500 italic">
                * Note: Visual image analysis provides decision support. Confirm disease diagnosis with local agricultural extension officers before heavy chemical applications.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
