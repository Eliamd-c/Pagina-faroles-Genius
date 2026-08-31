'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type PaymentMethod = 'anticipado' | 'contraentrega' | 'separe';

export default function OfertaV2() {
  const [step, setStep] = useState(1);
  const [qtyTradicional, setQtyTradicional] = useState(0);
  const [qtyVitral, setQtyVitral] = useState(0);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('anticipado');
  const [fechaRecordatorio, setFechaRecordatorio] = useState('');
  const [formData, setFormData] = useState({
    nombre: '', cedula: '', telefono: '', 
    departamento: '', municipio: '', direccion: '', detalles: ''
  });

  const totalQty = qtyTradicional + qtyVitral;
  
  const getUnitPrice = (qty: number) => {
    if (qty === 1) return 30000;
    if (qty === 2) return 28000;
    if (qty === 3) return 26000;
    if (qty === 4) return 25000;
    if (qty >= 5 && qty <= 7) return 24000;
    if (qty >= 8 && qty <= 10) return 22000;
    if (qty === 11) return 21000;
    if (qty >= 12) return 20000;
    return 30000;
  };

  const unitPrice = totalQty > 0 ? getUnitPrice(totalQty) : 30000;
  const subtotal = totalQty * unitPrice;
  const finalPrice = paymentMethod === 'contraentrega' ? Math.round(subtotal * 1.05) : subtotal;

  const getNextDiscountTarget = (qty: number) => {
    if (qty < 2) return { target: 2, newPrice: 28000 };
    if (qty === 2) return { target: 3, newPrice: 26000 };
    if (qty === 3) return { target: 4, newPrice: 25000 };
    if (qty === 4) return { target: 5, newPrice: 24000 };
    if (qty >= 5 && qty < 8) return { target: 8, newPrice: 22000 };
    if (qty >= 8 && qty < 11) return { target: 11, newPrice: 21000 };
    if (qty === 11) return { target: 12, newPrice: 20000 };
    return null;
  };

  const nextDiscount = getNextDiscountTarget(totalQty);

  const handleNextStep = () => {
    if (step === 2 && totalQty === 0) {
      alert("Por favor selecciona al menos 1 paquete para continuar.");
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitFormToWhatsApp = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: finalPrice,
        currency: 'COP',
        content_name: `Tradicional:${qtyTradicional}|Vitral:${qtyVitral}`,
        content_category: paymentMethod
      });
    }

    const phoneNumber = "573133288298";
    let finalMessage = `¡Hola! Quiero hacer un pedido interactivo.\n\n`;
    finalMessage += `*📦 Mi Selección (Envío Gratis):*\n`;
    if (qtyTradicional > 0) finalMessage += `- ${qtyTradicional}x Colección Tradicional\n`;
    if (qtyVitral > 0) finalMessage += `- ${qtyVitral}x Colección Vitral\n`;
    
    finalMessage += `\n*💵 Modalidad de Pago:* ${paymentMethod === 'anticipado' ? 'Anticipado (De contado)' : paymentMethod === 'contraentrega' ? 'Contra Entrega' : 'Plan Separe'}\n`;
    finalMessage += `*💰 Total a Pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    
    if (paymentMethod === 'separe') {
      finalMessage += `*🔔 Recordatorio de Pago:* ${fechaRecordatorio}\n`;
    }
    
    finalMessage += `\n*Datos de Envío:*\n`;
    finalMessage += `- Nombre: ${formData.nombre}\n`;
    if (formData.cedula) finalMessage += `- Cédula: ${formData.cedula}\n`;
    finalMessage += `- Teléfono: ${formData.telefono}\n`;
    finalMessage += `- Departamento: ${formData.departamento}\n`;
    finalMessage += `- Municipio: ${formData.municipio}\n`;
    finalMessage += `- Dirección: ${formData.direccion}\n`;
    if (formData.detalles) finalMessage += `- Detalles: ${formData.detalles}\n`;

    const encodedMessage = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="bg-black text-white font-sans min-h-[100dvh] w-full overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-white/10 md:shadow-2xl relative">
      
      {/* APP TOP BAR */}
      <header className="fixed top-0 left-0 w-full z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-gradient-to-b from-black/90 to-transparent pt-4 pb-6 px-5 pointer-events-none">
        <div className="flex gap-2 justify-center items-center h-2 w-full max-w-[200px] mx-auto">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-12 bg-[#D4AF37]' : step > i ? 'w-4 bg-[#D4AF37]/50' : 'w-4 bg-white/20'}`} />
          ))}
        </div>
      </header>

      {/* =========================================
          ACTO 1: SPLASH SCREEN / APP HERO (100dvh)
      ========================================= */}
      {step === 1 && (
        <div className="animate-in fade-in duration-500 h-[100dvh] flex flex-col relative">
          {/* Vertical Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover opacity-80"
            >
              {/* Using the vertical video for mobile */}
              <source src="/distribuidores/media/video vertical poner vela sub titulos(1).mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          </div>

          <div className="relative z-10 flex flex-col justify-end flex-grow pb-32 px-6">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 w-fit">
              Colección 2026
            </span>
            <h1 className="text-5xl font-serif text-white leading-tight mb-4 drop-shadow-xl" style={{ fontFamily: 'var(--font-playfair)' }}>
              La tradición <br/>
              <span className="text-[#D4AF37]">que no se apaga.</span>
            </h1>
            <p className="text-gray-300 text-lg font-light mb-6">
              Faroles premium resistentes a la brisa. Envío gratis a nivel nacional.
            </p>
          </div>

          {/* Sticky Bottom Action */}
          <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 p-5 pb-8 bg-gradient-to-t from-black via-black to-transparent z-50">
            <button 
              onClick={handleNextStep}
              className="w-full bg-[#D4AF37] text-black h-14 rounded-full font-black text-lg uppercase shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>Configurar mi pedido</span>
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          ACTO 2: TIENDA / CONFIGURADOR APP
      ========================================= */}
      {step === 2 && (
        <div className="animate-in slide-in-from-right-4 duration-300 min-h-[100dvh] pb-48 pt-16 px-5 bg-[#0a0a0a]">
          
          <button onClick={handlePrevStep} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-6 active:scale-90 transition-transform">
            <span className="text-xl">←</span>
          </button>

          <h2 className="text-3xl font-serif text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Arma tus paquetes</h2>
          <p className="text-gray-400 text-sm mb-8">4 faroles por paquete. ¡Combínalos para bajar el precio unitario!</p>

          <div className="space-y-6">
            
            {/* Card Tradicional */}
            <div className="bg-[#151515] rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-24 h-24 bg-black rounded-2xl p-2 shrink-0 border border-white/5 flex items-center justify-center relative">
                  <Image src="/distribuidores/media/paquete1-alpha.png" alt="Tradicional" fill className="object-contain p-2 drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Tradicional</h3>
                  <p className="text-xs text-gray-400 leading-tight">Siluetas clásicas: Pesebre, Velas, Campanas.</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/50 rounded-2xl p-2 border border-white/5 relative z-10">
                <span className="text-sm font-medium text-gray-400 ml-3">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQtyTradicional(Math.max(0, qtyTradicional - 1))} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold active:bg-white/20 transition-colors">-</button>
                  <span className="text-2xl font-black w-8 text-center">{qtyTradicional}</span>
                  <button onClick={() => setQtyTradicional(qtyTradicional + 1)} className="w-12 h-12 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center text-2xl font-bold active:scale-95 transition-transform">+</button>
                </div>
              </div>
            </div>

            {/* Card Vitral */}
            <div className="bg-[#151515] rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-24 h-24 bg-black rounded-2xl p-2 shrink-0 border border-white/5 flex items-center justify-center relative">
                  <Image src="/distribuidores/media/paquete2-alpha.png" alt="Vitral" fill className="object-contain p-2 drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Vitral</h3>
                  <p className="text-xs text-gray-400 leading-tight">Colores vibrantes estilo iglesia.</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/50 rounded-2xl p-2 border border-white/5 relative z-10">
                <span className="text-sm font-medium text-gray-400 ml-3">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQtyVitral(Math.max(0, qtyVitral - 1))} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold active:bg-white/20 transition-colors">-</button>
                  <span className="text-2xl font-black w-8 text-center">{qtyVitral}</span>
                  <button onClick={() => setQtyVitral(qtyVitral + 1)} className="w-12 h-12 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center text-2xl font-bold active:scale-95 transition-transform">+</button>
                </div>
              </div>
            </div>

            {/* Smart Pricing Alert */}
            {nextDiscount && (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-lg">🎁</span>
                <p className="text-sm text-[#D4AF37] font-medium leading-snug">
                  Agrega {nextDiscount.target - totalQty} más para bajar el precio a ${nextDiscount.newPrice.toLocaleString('es-CO')}
                </p>
              </div>
            )}
          </div>

          {/* Sticky Bottom Summary/Action */}
          <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-[#111] rounded-t-3xl border-t border-white/10 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{totalQty} Paquetes a ${unitPrice/1000}k c/u</p>
                <p className="text-3xl font-black text-white">${subtotal.toLocaleString('es-CO')}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 text-xs font-bold uppercase mb-1">Envío Nacional</p>
                <p className="text-xl font-bold text-white">GRATIS</p>
              </div>
            </div>

            <button 
              onClick={handleNextStep}
              disabled={totalQty === 0}
              className={`w-full h-14 rounded-2xl font-black text-lg uppercase flex items-center justify-center gap-2 transition-all ${totalQty > 0 ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)] active:scale-95' : 'bg-gray-800 text-gray-500 opacity-50'}`}
            >
              <span>Continuar</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          ACTO 3: CHECKOUT (APP FORM)
      ========================================= */}
      {step === 3 && (
        <div className="animate-in slide-in-from-right-4 duration-300 min-h-[100dvh] pb-48 pt-16 px-5 bg-[#0a0a0a]">
          
          <button onClick={handlePrevStep} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-6 active:scale-90 transition-transform">
            <span className="text-xl">←</span>
          </button>

          <h2 className="text-3xl font-serif text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Datos de Envío</h2>

          <div className="space-y-8">
            
            {/* Segmented Control for Payment */}
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">1. Método de Pago</p>
              <div className="bg-[#151515] p-1.5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                {[
                  { id: 'anticipado', label: 'Anticipado', desc: 'Transferencia sin recargo' },
                  { id: 'contraentrega', label: 'Contra Entrega', desc: '+5% recargo en casa' },
                  { id: 'separe', label: 'Plan Separe', desc: 'Abona $2.000 hoy' }
                ].map(method => (
                  <button 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex flex-col text-left p-3 rounded-xl transition-all ${paymentMethod === method.id ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-transparent text-gray-400'}`}
                  >
                    <span className="font-bold text-base">{method.label}</span>
                    <span className={`text-xs ${paymentMethod === method.id ? 'text-black/70' : 'text-gray-500'}`}>{method.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">2. Dirección de Entrega</p>
              <div className="space-y-3">
                <input type="text" placeholder="Nombre completo" className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 h-14 text-white text-base focus:outline-none focus:border-[#D4AF37] transition-colors" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                <input type="tel" placeholder="Teléfono / WhatsApp" className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 h-14 text-white text-base focus:outline-none focus:border-[#D4AF37] transition-colors" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                
                <div className="flex gap-3">
                  <input type="text" placeholder="Depto" className="w-1/2 bg-[#151515] border border-white/5 rounded-2xl px-5 h-14 text-white text-base focus:outline-none focus:border-[#D4AF37] transition-colors" value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})} />
                  <input type="text" placeholder="Ciudad" className="w-1/2 bg-[#151515] border border-white/5 rounded-2xl px-5 h-14 text-white text-base focus:outline-none focus:border-[#D4AF37] transition-colors" value={formData.municipio} onChange={e => setFormData({...formData, municipio: e.target.value})} />
                </div>
                
                <input type="text" placeholder="Dirección exacta" className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 h-14 text-white text-base focus:outline-none focus:border-[#D4AF37] transition-colors" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                <textarea placeholder="Detalles (Ej: Rejas blancas)" rows={2} className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 py-4 text-white text-base focus:outline-none focus:border-[#D4AF37] transition-colors resize-none" value={formData.detalles} onChange={e => setFormData({...formData, detalles: e.target.value})} />
              </div>
            </div>

            {paymentMethod === 'separe' && (
              <div className="bg-[#D4AF37]/10 p-5 rounded-2xl border border-[#D4AF37]/30">
                <p className="text-sm text-[#D4AF37] mb-3">Selecciona cuándo te recordamos el saldo:</p>
                <input type="date" className="w-full bg-black/50 border border-[#D4AF37] rounded-xl px-4 h-12 text-white focus:outline-none appearance-none" value={fechaRecordatorio} onChange={e => setFechaRecordatorio(e.target.value)} />
              </div>
            )}
            
          </div>

          {/* Sticky Bottom Send Button */}
          <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-[#111] rounded-t-3xl border-t border-white/10 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total a Pagar</span>
              <span className="text-3xl font-black text-[#D4AF37]">${finalPrice.toLocaleString('es-CO')}</span>
            </div>

            <button 
              onClick={submitFormToWhatsApp}
              className="w-full h-14 bg-[#25D366] text-white rounded-2xl font-black text-lg uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_4px_15px_rgba(37,211,102,0.3)]"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.573-10.564 5.824 0 10.564 4.74 10.564 10.564 0 5.827-4.74 10.567-10.564 10.567z"/></svg>
              <span>Pedir por WhatsApp</span>
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
