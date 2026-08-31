'use client';
import { useState, useEffect, useRef } from 'react';
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
    <main className="min-h-screen text-white font-sans bg-black selection:bg-[#D4AF37] selection:text-black pb-20">
      
      {/* ProgressBar Fija */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-900 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] transition-all duration-700 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      {/* =========================================
          ACTO 1: LA HISTORIA (MUY VISUAL)
      ========================================= */}
      {step === 1 && (
        <div className="animate-in fade-in duration-1000">
          
          {/* Hero Section con Video de Fondo */}
          <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
            >
              <source src="/distribuidores/media/hero_video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black"></div>
            
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
              <span className="inline-block py-1 px-3 rounded-full border border-[#D4AF37] text-[#D4AF37] text-sm uppercase tracking-widest mb-6 backdrop-blur-sm bg-black/30">
                Lanzamiento Colección 2026
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>
                Ilumina tu <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37]">
                  7 de Diciembre
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto mb-12 drop-shadow-lg">
                Faroles premium con sistema "Luz Táctil", resistentes a la brisa y diseñados para unir a la familia.
              </p>
              <button 
                onClick={handleNextStep}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-black text-black uppercase transition-all duration-300 ease-in-out bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full hover:scale-105 shadow-[0_0_40px_rgba(212,175,55,0.6)]"
              >
                <span>Armar mi pedido interactivo</span>
                <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </section>

          {/* Características muy visuales */}
          <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
              <div className="order-2 md:order-1 relative h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src="/distribuidores/media/medidas_correctas.png" alt="Tamaño perfecto" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <p className="text-xl text-white font-medium">Tamaño ideal: 23cm de alto x 12.5cm de ancho</p>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37]">Presencia Imponente</h2>
                <p className="text-gray-300 text-xl leading-relaxed">
                  No son los típicos faroles pequeños. Su diseño estructural de <strong>23 centímetros</strong> garantiza que tu hogar resalte desde lejos, manteniendo la vela segura y estable.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37]">Calidad Premium</h2>
                <p className="text-gray-300 text-xl leading-relaxed">
                  Fabricados en <strong>Cartón Microcorrugado</strong> de alta resistencia. Con diseños únicos impresos en <strong>Papel Pergamino</strong> que avivan los colores cuando se enciende la luz.
                </p>
                <button 
                  onClick={handleNextStep}
                  className="mt-8 text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 text-xl font-bold hover:text-white hover:border-white transition-colors"
                >
                  Ver los diseños disponibles →
                </button>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src="/distribuidores/media/farol_caracteristicas.png" alt="Características" fill className="object-cover" />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================
          ACTO 2: EL CONFIGURADOR (GAMIFICACIÓN)
      ========================================= */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto px-6 pt-20">
          
          <div className="flex items-center justify-between mb-8">
            <button onClick={handlePrevStep} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
              <span className="text-2xl">←</span> <span className="hidden md:inline font-medium">Volver a detalles</span>
            </button>
            <div className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold border border-[#D4AF37]/30 px-4 py-1.5 rounded-full bg-[#D4AF37]/5">
              Paso 1 de 2: Selección
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Arma tu <span className="text-[#D4AF37]">Colección</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Cada paquete incluye 4 faroles armables. Combínalos como quieras. <br/>
              <strong className="text-white">¡A mayor cantidad, menor es el precio por paquete!</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            
            {/* Tarjeta Tradicional */}
            <div className="bg-[#111]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col group">
              <div className="w-full h-72 relative mb-8 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                <Image src="/distribuidores/media/paquete1-alpha.png" alt="Tradicional" fill className="object-contain drop-shadow-2xl relative z-10 scale-95 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Colección Tradicional</h3>
              <p className="text-gray-400 text-lg mb-8 flex-grow">Diseños clásicos navideños (Pesebre, Velas, Campanas) con siluetas hermosas.</p>
              
              <div className="flex items-center justify-between bg-black/50 p-3 rounded-full border border-white/10">
                <span className="pl-6 text-gray-400 font-medium">Cantidad:</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQtyTradicional(Math.max(0, qtyTradicional - 1))} className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-2xl hover:bg-white hover:text-black transition-colors">-</button>
                  <span className="text-3xl font-black w-10 text-center">{qtyTradicional}</span>
                  <button onClick={() => setQtyTradicional(qtyTradicional + 1)} className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black flex items-center justify-center text-2xl hover:scale-105 transition-transform">+</button>
                </div>
              </div>
            </div>

            {/* Tarjeta Vitral */}
            <div className="bg-[#111]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col group">
              <div className="w-full h-72 relative mb-8 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                <Image src="/distribuidores/media/paquete2-alpha.png" alt="Vitral" fill className="object-contain drop-shadow-2xl relative z-10 scale-95 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Colección Vitral</h3>
              <p className="text-gray-400 text-lg mb-8 flex-grow">Inspirados en los vitrales de las iglesias con colores súper vibrantes y modernos.</p>
              
              <div className="flex items-center justify-between bg-black/50 p-3 rounded-full border border-white/10">
                <span className="pl-6 text-gray-400 font-medium">Cantidad:</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQtyVitral(Math.max(0, qtyVitral - 1))} className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-2xl hover:bg-white hover:text-black transition-colors">-</button>
                  <span className="text-3xl font-black w-10 text-center">{qtyVitral}</span>
                  <button onClick={() => setQtyVitral(qtyVitral + 1)} className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black flex items-center justify-center text-2xl hover:scale-105 transition-transform">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Consola de Precios Fija/Flotante o Inferior */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/30 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden mb-12">
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 text-lg uppercase tracking-widest font-bold">Total Paquetes</span>
                  <span className="text-4xl font-black text-white">{totalQty}</span>
                </div>
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[#D4AF37] text-lg uppercase tracking-widest font-bold">Precio Unitario</span>
                  <span className="text-4xl font-black text-[#D4AF37]">${unitPrice.toLocaleString('es-CO')}</span>
                </div>

                {nextDiscount && (
                  <div className="bg-[#D4AF37]/10 text-[#D4AF37] py-3 px-5 rounded-2xl text-base border border-[#D4AF37]/20 flex items-start gap-3">
                    <span className="text-xl">🎁</span>
                    <p>
                      Agrega <strong>{nextDiscount.target - totalQty} paquete{nextDiscount.target - totalQty > 1 ? 's' : ''} más</strong> y el precio unitario bajará a <strong>${nextDiscount.newPrice.toLocaleString('es-CO')}</strong>.
                    </p>
                  </div>
                )}
                {!nextDiscount && totalQty > 0 && (
                   <div className="bg-green-500/10 text-green-400 py-3 px-5 rounded-2xl text-base border border-green-500/20 flex items-start gap-3">
                    <span className="text-xl">🏆</span>
                    <p>¡Felicidades! Has alcanzado el precio unitario máximo de descuento.</p>
                  </div>
                )}
              </div>

              <div className="border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8 flex flex-col justify-center">
                <span className="text-gray-400 block mb-2 text-center md:text-left text-lg">Subtotal a Pagar</span>
                <span className="text-5xl md:text-6xl font-black text-white text-center md:text-left mb-8">${subtotal.toLocaleString('es-CO')}</span>
                
                <button 
                  onClick={handleNextStep}
                  disabled={totalQty === 0}
                  className={`w-full py-6 rounded-2xl font-black text-2xl uppercase transition-all flex items-center justify-center gap-4 ${totalQty > 0 ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                >
                  <span>Siguiente Paso</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          ACTO 3: EL CIERRE (PAGO Y ENVÍO)
      ========================================= */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-700 max-w-6xl mx-auto px-6 pt-20">
          
          <div className="flex items-center justify-between mb-8">
            <button onClick={handlePrevStep} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
              <span className="text-2xl">←</span> <span className="hidden md:inline font-medium">Volver a los paquetes</span>
            </button>
            <div className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold border border-[#D4AF37]/30 px-4 py-1.5 rounded-full bg-[#D4AF37]/5">
              Paso 2 de 2: Confirmación
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif text-white mb-12" style={{ fontFamily: 'var(--font-playfair)' }}>
            Último paso, <span className="text-[#D4AF37]">tus datos.</span>
          </h2>

          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* Formulario (Izquierda) */}
            <div className="lg:col-span-3 space-y-10">
              
              {/* 1. Modalidad de Pago */}
              <div className="bg-[#111]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-[#D4AF37] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Elige cómo pagar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={() => setPaymentMethod('anticipado')} className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'anticipado' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 bg-black hover:border-gray-600'}`}>
                    <div className="font-bold text-white mb-2 text-lg">Anticipado</div>
                    <div className="text-sm text-gray-400 leading-tight">Nequi, Daviplata o Bancolombia</div>
                  </button>
                  <button onClick={() => setPaymentMethod('contraentrega')} className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'contraentrega' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 bg-black hover:border-gray-600'}`}>
                    <div className="font-bold text-white mb-2 text-lg">Contra Entrega</div>
                    <div className="text-sm text-gray-400 leading-tight">Pagas en casa (+5% recargo logístico)</div>
                  </button>
                  <button onClick={() => setPaymentMethod('separe')} className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'separe' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 bg-black hover:border-gray-600'}`}>
                    <div className="font-bold text-white mb-2 text-lg">Plan Separe</div>
                    <div className="text-sm text-gray-400 leading-tight">Abona $2.000 COP hoy</div>
                  </button>
                </div>
              </div>

              {/* 2. Datos de Envío */}
              <div className="bg-[#111]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-[#D4AF37] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  ¿A dónde lo enviamos?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" placeholder="Nombre completo *" className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                  <input type="text" placeholder="Cédula (Opcional)" className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
                  <input type="tel" placeholder="WhatsApp / Teléfono *" className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                  <input type="text" placeholder="Departamento *" className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})} />
                  <input type="text" placeholder="Municipio *" className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.municipio} onChange={e => setFormData({...formData, municipio: e.target.value})} />
                  <input type="text" placeholder="Dirección exacta *" className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                  <div className="md:col-span-2">
                    <input type="text" placeholder="Detalles de la casa (Ej: Casa rejas blancas, Barrio...)" className="w-full bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:bg-black transition-colors" value={formData.detalles} onChange={e => setFormData({...formData, detalles: e.target.value})} />
                  </div>
                </div>
              </div>

              {paymentMethod === 'separe' && (
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 p-8 rounded-[2rem] border border-[#D4AF37]/40">
                  <h3 className="text-[#D4AF37] text-xl font-bold mb-3">Condiciones del Plan Separe</h3>
                  <p className="text-base text-gray-200 mb-6">Abona $2.000 COP hoy para asegurar tu inventario para la temporada alta. El saldo restante lo pagas antes del envío.</p>
                  <label className="text-sm text-[#D4AF37] block mb-3 font-medium uppercase tracking-wider">¿Cuándo deseas que te enviemos un recordatorio de pago?</label>
                  <input type="date" className="w-full bg-black/80 border border-[#D4AF37]/50 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" value={fechaRecordatorio} onChange={e => setFechaRecordatorio(e.target.value)} />
                </div>
              )}
            </div>

            {/* Resumen y Botón Final (Derecha) */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-8 rounded-[2.5rem] border border-[#D4AF37]/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Tu Pedido</h3>
                
                <div className="space-y-5 mb-10 text-gray-300 text-lg">
                  {qtyTradicional > 0 && (
                    <div className="flex justify-between">
                      <span>{qtyTradicional}x Tradicional</span>
                      <span>${(qtyTradicional * unitPrice).toLocaleString('es-CO')}</span>
                    </div>
                  )}
                  {qtyVitral > 0 && (
                    <div className="flex justify-between">
                      <span>{qtyVitral}x Vitral</span>
                      <span>${(qtyVitral * unitPrice).toLocaleString('es-CO')}</span>
                    </div>
                  )}
                  {paymentMethod === 'contraentrega' && (
                    <div className="flex justify-between text-yellow-500 border-t border-white/5 pt-4 mt-2">
                      <span>Recargo Logístico (5%)</span>
                      <span>+ ${(Math.round(subtotal * 0.05)).toLocaleString('es-CO')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#25D366] font-bold border-t border-white/5 pt-4 mt-2">
                    <span>Envío Nacional</span>
                    <span>GRATIS</span>
                  </div>
                </div>

                <div className="border-t border-[#D4AF37]/30 pt-8 mb-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Total a Pagar</span>
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFDF00]">${finalPrice.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <button 
                  onClick={submitFormToWhatsApp}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-8 py-6 rounded-2xl font-black text-xl uppercase transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] flex justify-center items-center gap-3"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.573-10.564 5.824 0 10.564 4.74 10.564 10.564 0 5.827-4.74 10.567-10.564 10.567z"/></svg>
                  <span>Enviar Pedido</span>
                </button>
                <p className="text-sm text-gray-400 text-center mt-6">
                  Al hacer clic, se abrirá WhatsApp con los detalles de tu pedido para coordinar de forma segura.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
