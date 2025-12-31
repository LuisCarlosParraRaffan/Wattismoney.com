import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const KYCUpload: React.FC = () => {
  const navigate = useNavigate();
  const [docType, setDocType] = useState<'dni' | 'passport'>('dni');
  
  // Refs for file inputs
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const residenceInputRef = useRef<HTMLInputElement>(null);

  // State for file previews/names (simulated for UI feedback)
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [residenceFile, setResidenceFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Navigate to success page
    navigate('/kyc-success');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-black dark:text-white transition-colors duration-200 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-100 dark:border-[#2d2d42] bg-white dark:bg-[#1a1a2e] px-6 lg:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">verified_user</span>
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">Conexión Segura (256-bit SSL)</span>
          </div>
          <Link to="/dashboard" className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-[#2d2d42] dark:hover:bg-[#3d3d56] text-black dark:text-white text-sm font-semibold transition-colors">
            <span className="truncate">Guardar y Salir</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Header & Progress */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-display text-2xl font-bold text-black dark:text-white">Verificación de Identidad</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Paso 2 de 4: Documentación</p>
                </div>
                <span className="text-black font-bold bg-primary px-3 py-1 rounded-full text-sm">50%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-[#2d2d42] rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#2d2d42]">
              <div className="flex gap-4">
                <div className="shrink-0 size-12 rounded-full bg-primary flex items-center justify-center text-black">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1">Valida tu Documentación</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Para cumplir con las regulaciones de la CNMV y asegurar tu inversión en energía sostenible, necesitamos verificar que eres quien dices ser. Tus datos están encriptados y seguros.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Document Type */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#2d2d42]">
              <h2 className="font-display text-lg font-bold mb-4">1. Tipo de Documento</h2>
              <div className="flex p-1 bg-gray-50 dark:bg-[#2d2d42] rounded-lg mb-6 border border-gray-100 dark:border-gray-700">
                <label className="flex-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="docType" 
                    value="dni" 
                    checked={docType === 'dni'} 
                    onChange={() => setDocType('dni')}
                    className="peer sr-only" 
                  />
                  <div className="flex items-center justify-center py-2.5 rounded-md text-sm font-bold text-gray-500 peer-checked:bg-primary peer-checked:text-black peer-checked:shadow-sm dark:peer-checked:bg-primary dark:text-gray-400 dark:peer-checked:text-black transition-all">
                    DNI / NIE
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="docType" 
                    value="passport" 
                    checked={docType === 'passport'}
                    onChange={() => setDocType('passport')}
                    className="peer sr-only" 
                  />
                  <div className="flex items-center justify-center py-2.5 rounded-md text-sm font-bold text-gray-500 peer-checked:bg-primary peer-checked:text-black peer-checked:shadow-sm dark:peer-checked:bg-primary dark:text-gray-400 dark:peer-checked:text-black transition-all">
                    Pasaporte
                  </div>
                </label>
              </div>

              {/* Upload Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Front Side */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Parte Delantera</label>
                  <div 
                    onClick={() => frontInputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-all cursor-pointer ${frontFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      {frontFile ? (
                        <>
                           <span className="material-symbols-outlined text-4xl text-green-500 mb-3">check_circle</span>
                           <p className="text-sm font-bold text-green-700 dark:text-green-400 truncate w-full">{frontFile.name}</p>
                        </>
                      ) : (
                        <>
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-3 group-hover:text-black transition-colors">cloud_upload</span>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-black"><span className="font-bold">Haz clic para subir</span> o arrastra</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">SVG, PNG, JPG (Max. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        ref={frontInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFrontFile)}
                    />
                  </div>
                </div>

                {/* Back Side */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Parte Trasera</label>
                  <div 
                    onClick={() => backInputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-all cursor-pointer ${backFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    {backFile ? (
                        <>
                           <span className="material-symbols-outlined text-4xl text-green-500 mb-3">check_circle</span>
                           <p className="text-sm font-bold text-green-700 dark:text-green-400 truncate w-full">{backFile.name}</p>
                        </>
                      ) : (
                        <>
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-3 group-hover:text-black transition-colors">cloud_upload</span>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-black"><span className="font-bold">Haz clic para subir</span> o arrastra</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">SVG, PNG, JPG (Max. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        ref={backInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setBackFile)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Proof of Residence */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#2d2d42]">
              <h2 className="font-display text-lg font-bold mb-4">2. Prueba de Residencia</h2>
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-lg mb-4 flex gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                <p className="text-sm text-blue-800 dark:text-blue-200">El documento debe tener una antigüedad menor a 3 meses. (Ej: Factura de luz, agua, internet o extracto bancario).</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-[#1a1a2e]/50">
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="size-10 rounded-lg bg-white dark:bg-[#2d2d42] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600">
                    <span className="material-symbols-outlined text-gray-500">description</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{residenceFile ? residenceFile.name : "Subir documento (PDF o IMG)"}</span>
                    <span className="text-xs text-gray-500">Max 10MB</span>
                  </div>
                </div>
                <input 
                    type="file" 
                    className="hidden" 
                    ref={residenceInputRef}
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, setResidenceFile)}
                />
                <button 
                    onClick={() => residenceInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-[#2d2d42] border border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary hover:text-black dark:hover:border-primary text-sm font-medium rounded-lg text-black transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">upload_file</span>
                  {residenceFile ? "Cambiar Archivo" : "Seleccionar Archivo"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary-hover text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                Continuar
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="sm:w-auto bg-transparent border border-gray-200 dark:border-[#2d2d42] hover:bg-gray-50 dark:hover:bg-[#2d2d42] text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Atrás
              </button>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-5 border border-gray-100 dark:border-[#2d2d42] shadow-sm sticky top-24">
              <h4 className="font-display font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Consejos de Verificación
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-green-500 text-lg shrink-0">check_circle</span>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong className="block text-black dark:text-white text-xs mb-0.5">Sin reflejos</strong>
                    Evita usar flash para que los datos sean legibles.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-green-500 text-lg shrink-0">check_circle</span>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong className="block text-black dark:text-white text-xs mb-0.5">Bordes visibles</strong>
                    Asegúrate de que las 4 esquinas del documento estén dentro de la foto.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-green-500 text-lg shrink-0">check_circle</span>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong className="block text-black dark:text-white text-xs mb-0.5">Documento Original</strong>
                    No aceptamos fotocopias ni capturas de pantalla.
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#2d2d42]">
                <p className="text-xs text-center text-gray-400 mb-3">¿Prefieres usar tu móvil?</p>
                <button className="w-full py-2 px-4 bg-gray-50 dark:bg-[#2d2d42] hover:bg-gray-100 dark:hover:bg-[#3d3d56] rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">smartphone</span>
                  Enviar enlace al móvil
                </button>
              </div>
            </div>
            <div className="text-center px-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ¿Tienes problemas? <a className="text-black dark:text-white font-bold hover:underline decoration-primary decoration-2" href="#">Contactar Soporte</a>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default KYCUpload;