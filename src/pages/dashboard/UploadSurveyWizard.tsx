import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useYieldSurvey } from '../../context/YieldSurveyContext';
import type { SurveyPhase } from '../../context/YieldSurveyContext';
import { UploadCloud, FileText, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

const mockExtractedData = {
  farmerCount: 4,
  totalArea: 12.5,
  totalYield: 18.2,
  rows: [
    { id: 'F-1021', name: 'Tashi Tshering', aadhaar: 'XXXX-XXXX-4321', village: 'Rinchenpong', cropArea: 3.5, estYield: 5.2, actYield: 5.8 },
    { id: 'F-1022', name: 'Sunita Chettri', aadhaar: 'XXXX-XXXX-9876', village: 'Kaluk', cropArea: 2.0, estYield: 2.8, actYield: 2.5 },
    { id: 'F-1023', name: 'Phurba Tamang', aadhaar: 'XXXX-XXXX-1122', village: 'Rinchenpong', cropArea: 4.5, estYield: 7.0, actYield: 7.1 },
    { id: 'F-1024', name: 'Nima Sherpa', aadhaar: 'XXXX-XXXX-5566', village: 'Hee-Bermiok', cropArea: 2.5, estYield: 3.5, actYield: 3.5 },
  ]
};

const UploadSurveyWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addSurvey } = useYieldSurvey();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    year: '2026',
    season: 'Kharif',
    phase: 'Phase 1 - Estimated' as SurveyPhase,
    crop: 'Large Cardamom',
    growerGroup: 'Geyzing Farmers Group',
  });
  
  const [certFile, setCertFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [extractedGrid, setExtractedGrid] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step === 2 && !certFile) {
      alert(`Please upload the mandatory ${formData.phase === 'Phase 1 - Estimated' ? 'Scoped Certificate' : 'Transaction Certificate'}`);
      return;
    }
    if (step === 3 && !extractedGrid) {
      alert("Please upload and validate the Survey Excel sheet.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSimulateExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
      setIsSimulatingUpload(true);
      // Simulate network delay and parsing
      setTimeout(() => {
        setIsSimulatingUpload(false);
        setExtractedGrid(mockExtractedData);
      }, 1500);
    }
  };

  const handleSubmit = () => {
    const newSurvey = addSurvey({
      serviceProviderName: user?.name || 'ICS Provider',
      year: formData.year,
      season: formData.season,
      phase: formData.phase,
      crop: formData.crop,
      growerGroups: [formData.growerGroup],
      farmerCount: extractedGrid.farmerCount,
      certFileName: certFile?.name || 'certificate.pdf',
      excelData: extractedGrid.rows,
      totalArea: extractedGrid.totalArea,
      totalYield: formData.phase === 'Phase 1 - Estimated' 
        ? extractedGrid.rows.reduce((sum: number, r: any) => sum + r.estYield, 0)
        : extractedGrid.rows.reduce((sum: number, r: any) => sum + r.actYield, 0),
    });
    navigate('/dashboard/survey-success', { state: { id: newSurvey.id } });
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Yield Survey Data</h1>
        <p className="text-sm text-gray-500">Official data collection gateway for Sikkim Organic Farmers</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[
            { num: 1, label: 'Metadata' },
            { num: 2, label: 'Certificate' },
            { num: 3, label: 'Data Upload' },
            { num: 4, label: 'Summary' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center bg-white px-2">
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors", 
                step >= s.num ? "bg-primary text-white ring-4 ring-green-50" : "bg-gray-100 text-gray-400 border-2 border-gray-200"
              )}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={clsx("mt-2 text-xs font-semibold", step >= s.num ? "text-gray-900" : "text-gray-400")}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="flex-1 p-6 sm:p-8">
          
          {/* STEP 1: METADATA */}
          {step === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Survey Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Survey Year</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                    <option>2025</option>
                    <option>2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Season</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})}>
                    <option>Kharif</option>
                    <option>Rabi</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Survey Phase</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={formData.phase} onChange={e => setFormData({...formData, phase: e.target.value as SurveyPhase})}>
                    <option>Phase 1 - Estimated</option>
                    <option>Phase 2 - Actual</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Phase 1 requires Scoped Certificate. Phase 2 requires Transaction Certificate.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Crop / Product</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})}>
                    <option>Large Cardamom</option>
                    <option>Ginger</option>
                    <option>Turmeric</option>
                    <option>Buckwheat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grower Group</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={formData.growerGroup} onChange={e => setFormData({...formData, growerGroup: e.target.value})}>
                    <option>Geyzing Farmers Group</option>
                    <option>Mangan Organic Coop</option>
                    <option>Namchi Spice Producers</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CERTIFICATE UPLOAD */}
          {step === 2 && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Certificate Upload</h3>
              <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Because you selected <strong>{formData.phase}</strong>, you are legally required to upload a valid <strong>{formData.phase === 'Phase 1 - Estimated' ? 'Scoped Certificate' : 'Transaction Certificate'}</strong> issued by the Sikkim Certification Body before submitting farmer data.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Certificate <span className="text-red-500">*</span></label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${!certFile ? 'border-gray-300 hover:bg-gray-50 cursor-pointer' : 'border-green-300 bg-green-50'}`} onClick={() => !certFile && fileInputRef.current?.click()}>
                  <div className="space-y-1 text-center">
                    {!certFile ? (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <span className="font-medium text-primary hover:text-primary-dark">Upload a file</span>
                          <input type="file" className="sr-only" ref={fileInputRef} accept=".pdf" onChange={(e) => { if(e.target.files) setCertFile(e.target.files[0]) }} />
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm font-medium text-gray-900 mt-2">{certFile.name}</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setCertFile(null); }} className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium">Remove File</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EXCEL DATA UPLOAD */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-900">Survey Data Upload</h3>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Download Official Excel Template</a>
              </div>

              {!extractedGrid && !isSimulatingUpload && (
                <div className="max-w-3xl mx-auto">
                  <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => excelInputRef.current?.click()}>
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <div className="text-lg font-medium text-gray-900">Upload Filled Survey Excel Sheet</div>
                      <p className="text-sm text-gray-500 mb-4">Ensure column headers exactly match the template</p>
                      <span className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm">Browse Files</span>
                      <input type="file" className="sr-only" ref={excelInputRef} accept=".xlsx,.xls,.csv" onChange={handleSimulateExcelUpload} />
                    </div>
                  </div>
                </div>
              )}

              {isSimulatingUpload && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium animate-pulse">Parsing and validating {excelFile?.name}...</p>
                </div>
              )}

              {extractedGrid && !isSimulatingUpload && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <h4 className="font-bold text-green-900">Validation Successful</h4>
                        <p className="text-sm text-green-700">Extracted {extractedGrid.rows.length} valid farmer records. Zero errors found.</p>
                      </div>
                    </div>
                    <button onClick={() => setExtractedGrid(null)} className="text-sm font-medium text-gray-600 hover:text-gray-900">Re-upload File</button>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Farmer ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aadhaar</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Village</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Crop Area (Ha)</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. Yield (MT)</th>
                          {formData.phase === 'Phase 2 - Actual' && (
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Act. Yield (MT)</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {extractedGrid.rows.map((r: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{r.aadhaar}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{r.village}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.cropArea}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.estYield}</td>
                            {formData.phase === 'Phase 2 - Actual' && (
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 font-bold">{r.actYield}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUMMARY & VARIANCE */}
          {step === 4 && extractedGrid && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Review & Submit</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Farmers Surveyed</p>
                  <p className="text-2xl font-bold text-gray-900">{extractedGrid.farmerCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Organic Area</p>
                  <p className="text-2xl font-bold text-gray-900">{extractedGrid.totalArea} Ha</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">Total Estimated Yield</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {extractedGrid.rows.reduce((s: number, r: any) => s + r.estYield, 0).toFixed(1)} MT
                  </p>
                </div>
                {formData.phase === 'Phase 2 - Actual' && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Total Actual Yield</p>
                    <p className="text-2xl font-bold text-green-900">
                      {extractedGrid.rows.reduce((s: number, r: any) => s + r.actYield, 0).toFixed(1)} MT
                    </p>
                  </div>
                )}
              </div>

              {formData.phase === 'Phase 2 - Actual' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Variance Analytics</h4>
                    <p className="text-sm text-gray-500">Comparison against Phase 1 estimates</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-bold text-green-700 text-lg">+4.4% Variance (Increase)</span>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 space-y-2">
                <p><strong>Survey Metadata:</strong> {formData.year} {formData.season} | {formData.crop} | {formData.growerGroup}</p>
                <p><strong>Attached Certificate:</strong> {certFile?.name} <span className="text-green-600 font-medium">(Verified)</span></p>
              </div>

            </div>
          )}

        </div>
        
        {/* Navigation Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => step > 1 ? setStep(prev => prev - 1) : navigate(-1)} 
            className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {step === 1 ? 'Cancel' : <><ChevronLeft className="w-4 h-4 mr-1"/> Back</>}
          </button>
          
          <div className="flex space-x-3">
            {step === 4 && (
              <button type="button" className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Save Draft
              </button>
            )}
            <button 
              type="button" 
              onClick={step === 4 ? handleSubmit : handleNext} 
              className="flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              {step === 4 ? 'Submit for Approval' : <>Next <ChevronRight className="w-4 h-4 ml-1"/></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSurveyWizard;
