import React, { useState, useEffect } from 'react';
import { AppView, CertificateType, Message, MedicalCase, User } from './types';
import { getTriageResponse, generateCaseSummary } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';

// --- Sub-Components (Inline for single file requirement compliance where possible) ---

const LandingPage: React.FC<{ onStart: (type: CertificateType) => void }> = ({ onStart }) => (
  <div className="space-y-12 pb-12">
    <section className="text-center space-y-6 pt-12 animate-fade-in-up">
      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
        #1 Telemedicine Platform
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
        Medical Certificate <br />
        <span className="text-blue-600">in 3 Minutes</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        No queues, no waiting. Get your valid medical certificate from a licensed doctor through our AI-powered express triage system.
      </p>
      
      <div className="flex justify-center gap-4 text-sm text-slate-500 mt-4">
        <div className="flex items-center gap-1">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Legal & Valid
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Secure Data
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          24/7 Available
        </div>
      </div>
    </section>

    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      {Object.values(CertificateType).map((type) => (
        <button
          key={type}
          onClick={() => onStart(type)}
          className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">{type}</h3>
          <p className="text-sm text-slate-500 mb-4">Get certified instantly for school, work, or gym.</p>
          <span className="text-blue-600 font-semibold text-sm flex items-center gap-1">
            Start Now 
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        </button>
      ))}
    </section>
  </div>
);

const PaymentModal: React.FC<{ onComplete: () => void, isProcessing: boolean }> = ({ onComplete, isProcessing }) => (
  <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
    <div className="bg-slate-900 p-6 text-white">
      <h2 className="text-xl font-bold">Secure Checkout</h2>
      <p className="text-slate-400 text-sm">Complete payment to send report to doctor.</p>
    </div>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <span className="text-slate-600">Consultation Fee</span>
        <span className="text-xl font-bold text-slate-900">5000 ₸</span>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Card Number</label>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
             <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
             <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent w-full focus:outline-none text-slate-700" defaultValue="4242 4242 4242 4242" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Expiry</label>
            <input type="text" placeholder="MM/YY" className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none text-slate-700" defaultValue="12/25" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">CVC</label>
            <input type="text" placeholder="123" className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none text-slate-700" defaultValue="123" />
          </div>
        </div>
      </div>

      <button 
        onClick={onComplete} 
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2"
      >
        {isProcessing ? (
           <>
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             Processing...
           </>
        ) : 'Pay 5000 ₸'}
      </button>
    </div>
  </div>
);

const DoctorDashboard: React.FC<{ caseData: MedicalCase, onApprove: () => void }> = ({ caseData, onApprove }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dr. Sarah Aliyev</h2>
        <p className="text-slate-500">License ID: MD-2023-8842</p>
      </div>
      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium text-sm">
        Available
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
        <h3 className="font-bold text-blue-900">Pending Approval: {caseData.id}</h3>
        <span className="text-xs font-mono text-blue-600">{new Date().toLocaleString()}</span>
      </div>
      
      <div className="p-6 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Details</h4>
            <p className="text-lg font-medium text-slate-900">{caseData.patientName}</p>
            <p className="text-slate-600">{caseData.certificateType}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary</h4>
            <p className="text-slate-800 leading-relaxed">{caseData.summary}</p>
          </div>

          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reported Symptoms</h4>
             <p className="text-slate-600 text-sm italic">"{caseData.symptoms}"</p>
          </div>
        </div>

        <div className="space-y-6">
           <div className={`p-4 rounded-xl border ${caseData.redFlags.length > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${caseData.redFlags.length > 0 ? 'text-red-600' : 'text-green-600'}`}>Risk Assessment</h4>
              {caseData.redFlags.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {caseData.redFlags.map((flag, idx) => <li key={idx}>{flag}</li>)}
                </ul>
              ) : (
                <p className="text-green-700 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  No Red Flags Detected
                </p>
              )}
           </div>

           <div className="space-y-3 pt-6 border-t border-slate-100">
             <button 
                onClick={onApprove}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Approve & Sign
             </button>
             <button className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl transition-all">
               Request Video Call
             </button>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const PatientDashboard: React.FC<{ caseData: MedicalCase, onViewCert: () => void }> = ({ caseData, onViewCert }) => (
  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-8 text-center space-y-6">
       <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
       </div>
       <h2 className="text-3xl font-bold text-slate-900">Certificate Issued!</h2>
       <p className="text-slate-600">Your medical certificate has been approved by Dr. Sarah Aliyev and is ready for download.</p>
       
       <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200">
         <div className="grid grid-cols-2 gap-4 text-sm">
           <div>
             <span className="block text-slate-400 text-xs uppercase font-bold">Patient</span>
             <span className="font-semibold text-slate-900">{caseData.patientName}</span>
           </div>
           <div>
             <span className="block text-slate-400 text-xs uppercase font-bold">Issue Date</span>
             <span className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</span>
           </div>
           <div>
             <span className="block text-slate-400 text-xs uppercase font-bold">Type</span>
             <span className="font-semibold text-slate-900">{caseData.certificateType}</span>
           </div>
           <div>
             <span className="block text-slate-400 text-xs uppercase font-bold">Document ID</span>
             <span className="font-mono text-slate-600 text-xs">{caseData.id}</span>
           </div>
         </div>
       </div>

       <div className="flex flex-col gap-3 pt-4">
         <button onClick={onViewCert} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
           Download PDF
         </button>
         <button className="text-slate-500 hover:text-slate-800 font-medium py-2">
           Send to Email
         </button>
       </div>
    </div>
  </div>
);

const VerificationView: React.FC<{ caseData: MedicalCase }> = ({ caseData }) => (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border-t-8 border-blue-600 my-10 print:shadow-none print:border-none">
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">MEDFAST</h1>
                    <p className="text-sm text-slate-500">Medical Verification System</p>
                </div>
                <div className="text-right">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                        VALID DOCUMENT
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="border-b border-slate-100 pb-6">
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Doctor's Statement</p>
                    <p className="text-slate-800 italic">"This serves to certify that the patient named below was examined via MedFast Telehealth and requires the stated medical consideration."</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Patient Name</p>
                        <p className="text-lg font-semibold text-slate-900">{caseData.patientName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Date of Issue</p>
                        <p className="text-lg font-semibold text-slate-900">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-slate-400 font-bold uppercase">Reason / Type</p>
                        <p className="text-lg font-semibold text-slate-900">{caseData.certificateType}</p>
                    </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-slate-100 mt-6">
                    <div className="space-y-1">
                        <p className="font-signature text-2xl text-blue-800 font-bold">Dr. S. Aliyev</p>
                        <p className="text-xs text-slate-500">License MD-2023-8842</p>
                    </div>
                    <div className="w-24 h-24 bg-white border border-slate-200 p-1">
                        {/* Mock QR Code */}
                        <div className="w-full h-full bg-slate-900 pattern-dots"></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 px-8 py-4 text-xs text-slate-400 text-center border-t border-slate-100">
            Verify online at medfast.kz/verify/{caseData.id} • Generated securely via MedFast AI
        </div>
    </div>
)

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [userRole, setUserRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  
  // Triage State
  const [activeCertType, setActiveCertType] = useState<CertificateType | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Case State
  const [currentCase, setCurrentCase] = useState<MedicalCase | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleStartTriage = (type: CertificateType) => {
    setActiveCertType(type);
    const initialMessage: Message = {
      id: 'system-1',
      role: 'model',
      text: `Hello, I'm MedFast AI. I see you're looking for a ${type}. To begin, could you please describe your main symptoms or the reason for this request?`,
      timestamp: new Date()
    };
    setChatHistory([initialMessage]);
    setView(AppView.TRIAGE);
  };

  const handleSendMessage = async (text: string) => {
    if (!activeCertType) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Call Gemini
    const aiResponseText = await getTriageResponse([...chatHistory, userMsg], text, activeCertType);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleFinishTriage = async () => {
    if (!activeCertType) return;
    
    // In a real app, we show a loading spinner here while AI summarizes
    const summaryData = await generateCaseSummary(chatHistory, activeCertType);
    
    const newCase: MedicalCase = {
      id: `MF-${Math.floor(Math.random() * 10000)}`,
      patientName: "John Doe", // Mock user
      certificateType: activeCertType,
      symptoms: chatHistory.filter(m => m.role === 'user').map(m => m.text).join(' '),
      summary: summaryData.summary,
      redFlags: summaryData.redFlags,
      status: 'PENDING_PAYMENT',
      createdAt: new Date()
    };

    setCurrentCase(newCase);
    setView(AppView.PAYMENT);
  };

  const handlePaymentComplete = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
        setIsProcessingPayment(false);
        if (currentCase) {
            const updated = { ...currentCase, status: 'PENDING_DOCTOR' as const };
            setCurrentCase(updated);
            // Auto switch to Doctor view for demo purposes if role allows, otherwise wait screen
            // For this demo, we assume the user might want to see the "other side"
            setView(AppView.DOCTOR_DASHBOARD);
            setUserRole('DOCTOR'); // Auto switch role for demo flow
        }
    }, 2000);
  };

  const handleDoctorApprove = () => {
    if(currentCase) {
        const updated = { ...currentCase, status: 'APPROVED' as const, doctorName: 'Dr. Sarah Aliyev', issuedAt: new Date() };
        setCurrentCase(updated);
        // Switch back to patient view
        setUserRole('PATIENT');
        setView(AppView.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
             className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer"
             onClick={() => setView(AppView.LANDING)}
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            MedFast
          </div>
          
          <div className="flex items-center gap-4">
             {userRole === 'PATIENT' && view !== AppView.LANDING && (
                 <div className="hidden md:flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${view === AppView.TRIAGE ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                    {view === AppView.TRIAGE ? 'AI Consultation' : 'Dashboard'}
                 </div>
             )}
             <button className="p-2 rounded-full hover:bg-slate-100 relative">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
             <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src={`https://picsum.photos/seed/${userRole}/200`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
        
        {view === AppView.LANDING && (
            <LandingPage onStart={handleStartTriage} />
        )}

        {view === AppView.TRIAGE && (
            <div className="max-w-2xl mx-auto">
                <ChatInterface 
                    messages={chatHistory} 
                    onSendMessage={handleSendMessage}
                    isTyping={isTyping}
                    onFinish={handleFinishTriage}
                />
            </div>
        )}

        {view === AppView.PAYMENT && (
            <div className="pt-10">
                <PaymentModal onComplete={handlePaymentComplete} isProcessing={isProcessingPayment} />
            </div>
        )}

        {view === AppView.DOCTOR_DASHBOARD && currentCase && (
            <DoctorDashboard caseData={currentCase} onApprove={handleDoctorApprove} />
        )}

        {view === AppView.DASHBOARD && currentCase && (
            <PatientDashboard caseData={currentCase} onViewCert={() => setView(AppView.VERIFY)} />
        )}

        {view === AppView.VERIFY && currentCase && (
            <VerificationView caseData={currentCase} />
        )}

      </main>

      {/* Footer / Dev Tools */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
         <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
             <p>© 2024 MedFast Inc. All rights reserved.</p>
             <div className="flex items-center gap-4 mt-4 md:mt-0">
                 <button 
                    onClick={() => {
                        const newRole = userRole === 'PATIENT' ? 'DOCTOR' : 'PATIENT';
                        setUserRole(newRole);
                        setView(newRole === 'DOCTOR' ? AppView.DOCTOR_DASHBOARD : AppView.LANDING);
                    }}
                    className="text-xs bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors"
                 >
                    Switch Role: <strong>{userRole}</strong>
                 </button>
                 <a href="#" className="hover:text-blue-600">Privacy</a>
                 <a href="#" className="hover:text-blue-600">Terms</a>
                 <a href="#" className="hover:text-blue-600">Support</a>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
