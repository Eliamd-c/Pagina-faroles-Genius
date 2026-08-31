'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type PaymentMethod = 'anticipado' | 'contraentrega' | 'separe';

export default function OfertaV2() {
  const [step, setStep] = useState(1);
  
  // State for package configurator
  const [qtyTradicional, setQtyTradicional] = useState(0);
  const [qtyVitral, setQtyVitral] = useState(0);
  
  // State for checkout
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('anticipado');
  const [fechaRecordatorio, setFechaRecordatorio] = useState('');
  const [formData, setFormData] = useState({
    nombre: '', cedula: '', telefono: '', 
    departamento: '', municipio: '', direccion: '', detalles: ''
  });

  // Pricing Logic
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
    return 30000; // Default
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

  // Handlers
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
    <main className="min-h-screen text-white font-sans bg-[#0a0a0a] selection:bg-[#D4AF37] selection:text-black">
      
      {/* ProgressBar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-[#D4AF37] transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 min-h-screen flex flex-col justify-center">
        
        {/* =========================================
            ACTO 1: LA HISTORIA
        ========================================= */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Ilumina tu 7 de Diciembre
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Descubre los faroles diseñados para no apagarse. Materiales premium, colores vivos y una tradición que une a la familia.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                <div className="text-3xl mb-4">🌬️</div>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2">Resistentes a la brisa</h3>
                <p className="text-gray-400">Diseño cerrado que protege la vela para que no tengas que estar encendiéndola cada 5 minutos.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2">Papel Pergamino</h3>
                <p className="text-gray-400">Colores súper vivos que resaltan la iluminación creando un ambiente cálido y espectacular.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                <div className="text-3xl mb-4">🚚</div>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2">Envío Gratis</h3>
                <p className="text-gray-400">Aprovecha nuestra promoción de lanzamiento con envíos totalmente gratis a nivel nacional.</p>
              </div>
            </div>

            <div className="pt-12">
              <button 
                onClick={handleNextStep}
                className="bg-[#D4AF37] text-black px-12 py-5 rounded-full font-black text-xl uppercase transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 hover:bg-white"
              >
                Armar mi paquete 👉
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            ACTO 2: EL CONFIGURADOR (GAMIFICACIÓN)
        ========================================= */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={handlePrevStep} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2">
              ← Volver
            </button>

            <h2 className="text-3xl md:text-5xl font-serif text-[#D4AF37] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              ¿Cuántos paquetes necesitas?
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Cada paquete incluye 4 faroles armables. ¡Entre más lleves, más baja el precio unitario!
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Colección Tradicional */}
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center">
                <div className="w-full h-48 bg-gray-800 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                  <Image src="/distribuidores/media/caja_tradicional.png" alt="Tradicional" fill className="object-contain p-4" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Colección Tradicional</h3>
                <p className="text-gray-400 text-center mb-8">Diseños clásicos navideños con siluetas hermosas.</p>
                
                <div className="flex items-center gap-6 bg-black p-2 rounded-full border border-white/20">
                  <button 
                    onClick={() => setQtyTradicional(Math.max(0, qtyTradicional - 1))}
                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl hover:bg-white hover:text-black transition-colors"
                  >-</button>
                  <span className="text-2xl font-black w-8 text-center">{qtyTradicional}</span>
                  <button 
                    onClick={() => setQtyTradicional(qtyTradicional + 1)}
                    className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xl hover:bg-white transition-colors"
                  >+</button>
                </div>
              </div>

              {/* Colección Vitral */}
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center">
                <div className="w-full h-48 bg-gray-800 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                  <Image src="/distribuidores/media/caja_vitral.png" alt="Vitral" fill className="object-contain p-4" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Colección Vitral</h3>
                <p className="text-gray-400 text-center mb-8">Efecto vitral de iglesia con colores súper vibrantes.</p>
                
                <div className="flex items-center gap-6 bg-black p-2 rounded-full border border-white/20">
                  <button 
                    onClick={() => setQtyVitral(Math.max(0, qtyVitral - 1))}
                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl hover:bg-white hover:text-black transition-colors"
                  >-</button>
                  <span className="text-2xl font-black w-8 text-center">{qtyVitral}</span>
                  <button 
                    onClick={() => setQtyVitral(qtyVitral + 1)}
                    className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xl hover:bg-white transition-colors"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Barra de Progreso de Descuento */}
            <div className="bg-[#111] border border-[#D4AF37]/30 rounded-2xl p-6 text-center mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-800"></div>
              
              <div className="flex justify-between items-end mb-4">
                <div className="text-left">
                  <div className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-1">Total Paquetes</div>
                  <div className="text-3xl font-black text-white">{totalQty}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold mb-1">Precio Unitario</div>
                  <div className="text-3xl font-black text-[#D4AF37]">${unitPrice.toLocaleString('es-CO')}</div>
                </div>
              </div>

              {nextDiscount && (
                <div className="bg-[#D4AF37]/10 text-[#D4AF37] py-3 px-4 rounded-xl text-sm md:text-base border border-[#D4AF37]/20">
                  🎁 ¡Agrega <strong>{nextDiscount.target - totalQty} paquete{nextDiscount.target - totalQty > 1 ? 's' : ''} más</strong> para que el precio unitario baje a <strong>${nextDiscount.newPrice.toLocaleString('es-CO')}</strong>!
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-8">
              <div className="text-center md:text-left">
                <span className="text-gray-400 block mb-1">Total a Pagar (Envío Gratis)</span>
                <span className="text-4xl font-black text-white">${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <button 
                onClick={handleNextStep}
                disabled={totalQty === 0}
                className={`px-12 py-5 rounded-full font-black text-xl uppercase transition-all flex items-center gap-3 ${totalQty > 0 ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                <span>Continuar</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            ACTO 3: EL CIERRE (PAGO Y ENVÍO)
        ========================================= */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={handlePrevStep} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2">
              ← Volver
            </button>

            <h2 className="text-3xl md:text-5xl font-serif text-[#D4AF37] mb-12" style={{ fontFamily: 'var(--font-playfair)' }}>
              Último paso, tus datos.
            </h2>

            <div className="grid lg:grid-cols-5 gap-12">
              
              {/* Formulario (Izquierda) */}
              <div className="lg:col-span-3 space-y-8">
                
                {/* 1. Modalidad de Pago */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">1. Modalidad de pago</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => setPaymentMethod('anticipado')} className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'anticipado' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 hover:border-gray-600'}`}>
                      <div className="font-bold text-white mb-1">Pago Anticipado</div>
                      <div className="text-xs text-gray-400">Transferencia Nequi, Daviplata o Bancolombia</div>
                    </button>
                    <button onClick={() => setPaymentMethod('contraentrega')} className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'contraentrega' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 hover:border-gray-600'}`}>
                      <div className="font-bold text-white mb-1">Contra Entrega</div>
                      <div className="text-xs text-gray-400">Pagas en efectivo al recibir (+5% recargo logístico)</div>
                    </button>
                    <button onClick={() => setPaymentMethod('separe')} className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'separe' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 hover:border-gray-600'}`}>
                      <div className="font-bold text-white mb-1">Plan Separe</div>
                      <div className="text-xs text-gray-400">Congela el precio abonando $2.000 COP hoy</div>
                    </button>
                  </div>
                </div>

                {/* 2. Datos de Envío */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">2. ¿A dónde lo enviamos?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nombre completo *" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                    <input type="text" placeholder="Cédula (Opcional)" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
                    <input type="tel" placeholder="WhatsApp / Teléfono *" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                    <input type="text" placeholder="Departamento *" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})} />
                    <input type="text" placeholder="Municipio *" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.municipio} onChange={e => setFormData({...formData, municipio: e.target.value})} />
                    <input type="text" placeholder="Dirección exacta *" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                    <div className="md:col-span-2">
                      <input type="text" placeholder="Detalles de la casa (Ej: Casa rejas blancas, Barrio...)" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={formData.detalles} onChange={e => setFormData({...formData, detalles: e.target.value})} />
                    </div>
                  </div>
                </div>

                {paymentMethod === 'separe' && (
                  <div className="bg-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/30">
                    <h3 className="text-[#D4AF37] font-bold mb-2">Condiciones del Plan Separe</h3>
                    <p className="text-sm text-gray-300 mb-4">Abona $2.000 hoy para asegurar el inventario de temporada alta. El saldo restante lo pagas antes del envío.</p>
                    <label className="text-sm text-gray-400 block mb-2">¿Cuándo deseas que te enviemos un recordatorio de pago?</label>
                    <input type="date" className="w-full bg-black border border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" value={fechaRecordatorio} onChange={e => setFechaRecordatorio(e.target.value)} />
                  </div>
                )}
              </div>

              {/* Resumen y Botón Final (Derecha) */}
              <div className="lg:col-span-2">
                <div className="sticky top-8 bg-[#111] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6">Resumen de tu compra</h3>
                  
                  <div className="space-y-4 mb-8 text-gray-300">
                    <div className="flex justify-between">
                      <span>{totalQty}x Paquetes</span>
                      <span>${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    {paymentMethod === 'contraentrega' && (
                      <div className="flex justify-between text-yellow-500/80 text-sm">
                        <span>Recargo Contra Entrega (5%)</span>
                        <span>+ ${(Math.round(subtotal * 0.05)).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-green-400">
                      <span>Envío Nacional</span>
                      <span>¡GRATIS!</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-400 uppercase tracking-wider text-sm font-bold">Total a Pagar</span>
                      <span className="text-4xl font-black text-[#D4AF37]">${finalPrice.toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={submitFormToWhatsApp}
                    className="w-full bg-[#D4AF37] text-black px-8 py-5 rounded-xl font-black text-lg uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 hover:bg-white flex justify-center items-center gap-3"
                  >
                    <span>Finalizar Compra</span>
                    <span className="text-2xl">📱</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Al hacer clic, se abrirá WhatsApp con los detalles de tu pedido para coordinar de forma segura.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
