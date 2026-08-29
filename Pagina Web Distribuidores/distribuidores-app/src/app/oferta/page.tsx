"use client";

import { useState } from 'react';

const OFERTAS = [
  { id: 1, name: "1 Paquete", faroles: 4, price: 30000, recommended: false },
  { id: 2, name: "2 Paquetes", faroles: 8, price: 56000, recommended: true },
];

export default function OfertaPage() {
  const [selectedOffer, setSelectedOffer] = useState(2);
  const [isContraEntrega, setIsContraEntrega] = useState(false);
  const [isPlanSepare, setIsPlanSepare] = useState(false);

  const offer = OFERTAS.find((o) => o.id === selectedOffer) || OFERTAS[1];
  
  // Lógica de precios
  const basePrice = offer.price;
  let finalPrice = basePrice;
  if (isContraEntrega) {
    finalPrice = basePrice * 1.05; // +5%
  }

  const handleWhatsApp = () => {
    const phoneNumber = "573133288298";
    
    let message = `¡Hola! Quiero hacer un pedido de *${offer.name} (${offer.faroles} Faroles)*.\n\n`;
    
    if (isPlanSepare) {
      message += `💰 *Modalidad:* Plan Separe\n`;
      message += `💳 *Abono inicial:* $2,000\n`;
      message += `💵 *Total a pagar luego:* $${(finalPrice - 2000).toLocaleString('es-CO')}\n`;
    } else if (isContraEntrega) {
      message += `🚚 *Modalidad:* Pago Contra Entrega (+5%)\n`;
      message += `💵 *Total:* $${finalPrice.toLocaleString('es-CO')}\n`;
    } else {
      message += `💳 *Modalidad:* Pago Anticipado (Nequi/DaviPlata/Bancolombia)\n`;
      message += `💵 *Total:* $${finalPrice.toLocaleString('es-CO')}\n`;
    }
    
    message += `\n*Mis datos para el envío son:*\n`;
    message += `- Nombre:\n- Cédula:\n- Celular:\n- Dirección:\n- Ciudad:\n- Correo Electrónico:`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#07131B] text-white font-sans overflow-x-hidden selection:bg-[#DB0462] selection:text-white">
      {/* HEADER / HERO */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#DB0462] blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#EED332] blur-[100px]"></div>
        </div>

        <div className="flex-1 space-y-6 z-10 text-center md:text-left">
          <div className="inline-block border border-[#EED332]/40 bg-[#EED332]/10 text-[#EED332] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
            Oferta Especial Navideña
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white" style={{fontFamily: 'var(--font-playfair)'}}>
            Ilumina tu <span className="text-[#DB0462] block mt-2" style={{fontFamily: 'var(--font-great-vibes)', fontSize: '1.2em', lineHeight: '0.8'}}>Tradición</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-md mx-auto md:mx-0">
            Los auténticos faroles Genius. Cada paquete contiene 4 piezas premium de 35 cm x 17 cm, listos para tu noche de velitas.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
             <div className="flex items-center gap-2 text-gray-200">
               <span className="text-[#EED332] text-2xl">✓</span> Envíos a todo el país
             </div>
             <div className="flex items-center gap-2 text-gray-200">
               <span className="text-[#EED332] text-2xl">✓</span> Pago seguro
             </div>
          </div>
        </div>

        <div className="flex-1 w-full relative z-10 flex justify-center items-center">
          <div className="relative rounded-2xl overflow-hidden drop-shadow-[0_20px_50px_rgba(219,4,98,0.3)] hover:scale-105 transition-transform duration-500">
             <img src="/distribuidores/faroles/grupo-dos-virgenes-1-e1722462890182-1024x422.png" alt="Grupo de Faroles Navideños Genius" className="w-full max-w-lg object-contain" />
             
             {/* Envío Gratis Badge flotante */}
             <div className="absolute top-0 right-0 bg-[#EED332] text-[#07131B] font-black px-6 py-2 rounded-full transform rotate-3 shadow-lg border-2 border-white animate-bounce">
               ¡ENVÍO GRATIS!
             </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE DE MODELOS */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{fontFamily: 'var(--font-playfair)'}}>Colección <span className="text-[#DB0462]">Exclusiva</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Cada farol está diseñado con devoción y detalles únicos. Elige el paquete y recibe un surtido de nuestras mejores piezas.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { img: '1guadalupe.png', name: 'Guadalupe' },
            { img: '1Inmaculada.png', name: 'Inmaculada' },
            { img: '1milagrosa.png', name: 'Milagrosa' },
            { img: '1Fatima.png', name: 'Fátima' },
            { img: '1Candelaria.png', name: 'Candelaria' },
            { img: '1Chiquinquira.png', name: 'Chiquinquirá' }
          ].map((modelo, i) => (
            <div key={i} className="group flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] mb-4 bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden border border-white/10 group-hover:border-[#EED332]/50 transition-colors">
                <img 
                  src={`/distribuidores/faroles/${modelo.img}`} 
                  alt={`Farol ${modelo.name}`}
                  className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-white font-bold tracking-wide" style={{fontFamily: 'var(--font-playfair)'}}>{modelo.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* SELECCIÓN DE PAQUETES */}
      <section className="bg-[#0A1A24] py-20 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: 'var(--font-playfair)'}}>Elige tu paquete ideal</h2>
            <p className="text-gray-400">Selecciona cuántos paquetes deseas llevar. Recuerda, el envío es por nuestra cuenta.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {OFERTAS.map((o) => (
              <div 
                key={o.id}
                onClick={() => { setSelectedOffer(o.id); setIsPlanSepare(false); }}
                className={`relative cursor-pointer transition-all duration-300 rounded-2xl p-6 md:p-8 border-2 ${selectedOffer === o.id ? 'border-[#EED332] bg-[#EED332]/5 scale-[1.02]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
              >
                {o.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#EED332] text-[#07131B] text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full">
                    Más popular
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{o.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{o.faroles} Faroles en total</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOffer === o.id ? 'border-[#EED332]' : 'border-gray-500'}`}>
                    {selectedOffer === o.id && <div className="w-3 h-3 bg-[#EED332] rounded-full"></div>}
                  </div>
                </div>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-black text-white">${o.price.toLocaleString('es-CO')}</span>
                  <span className="text-gray-400 mb-1 line-through">${(o.price + 18500).toLocaleString('es-CO')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* OPCIONES DE PAGO Y PLAN SEPARE */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 w-full space-y-6">
              
              {/* CONTRA ENTREGA TOGGLE */}
              <div className={`p-5 rounded-xl border transition-all ${isContraEntrega && !isPlanSepare ? 'border-[#DB0462] bg-[#DB0462]/10' : 'border-white/10 bg-white/5'}`}>
                <label className="flex items-start gap-4 cursor-pointer">
                  <div className="relative flex-shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isContraEntrega} 
                      onChange={(e) => {
                        setIsContraEntrega(e.target.checked);
                        if (e.target.checked) setIsPlanSepare(false);
                      }} 
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${isContraEntrega ? 'bg-[#DB0462]' : 'bg-gray-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isContraEntrega ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">¿Pagar al recibir? (Contra Entrega)</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Paga en la puerta de tu casa. Esta opción tiene un recargo del 5% sobre el valor del paquete.
                    </p>
                  </div>
                </label>
              </div>

              {/* PLAN SEPARE TOGGLE */}
              <div className={`p-5 rounded-xl border transition-all ${isPlanSepare ? 'border-[#27B1B5] bg-[#27B1B5]/10' : 'border-white/10 bg-white/5'}`}>
                <label className="flex items-start gap-4 cursor-pointer">
                  <div className="relative flex-shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isPlanSepare} 
                      onChange={(e) => {
                        setIsPlanSepare(e.target.checked);
                        if (e.target.checked) setIsContraEntrega(false);
                      }} 
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${isPlanSepare ? 'bg-[#27B1B5]' : 'bg-gray-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPlanSepare ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Plan Separe: ¡Asegúralos hoy!</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Adquiérelos de inmediato o asegúralos con un pequeño abono de <strong>$2.000</strong> y te los recordamos otro día.
                    </p>
                  </div>
                </label>
              </div>

            </div>

            {/* TOTAL Y CTA */}
            <div className="w-full md:w-[350px] bg-[#07131B] border-t-4 border-[#EED332] rounded-2xl p-6 shadow-2xl flex-shrink-0">
               <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-4">Resumen de tu pedido</h3>
               
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-gray-300">
                   <span>{offer.name}</span>
                   <span>${basePrice.toLocaleString('es-CO')}</span>
                 </div>
                 <div className="flex justify-between text-[#EED332]">
                   <span>Envío</span>
                   <span>GRATIS</span>
                 </div>
                 {isContraEntrega && (
                   <div className="flex justify-between text-[#DB0462]">
                     <span>Recargo Contra Entrega (5%)</span>
                     <span>+${(finalPrice - basePrice).toLocaleString('es-CO')}</span>
                   </div>
                 )}
                 {isPlanSepare && (
                   <div className="flex justify-between text-[#27B1B5] border-t border-white/10 pt-3 mt-3">
                     <span>Abono hoy (Plan Separe)</span>
                     <span className="font-bold">-$2.000</span>
                   </div>
                 )}
               </div>

               <div className="border-t border-white/10 pt-4 mb-6 flex justify-between items-end">
                 <span className="text-lg text-white font-bold">{isPlanSepare ? 'Total a pagar HOY' : 'Total a pagar'}</span>
                 <span className="text-3xl font-black text-white">${isPlanSepare ? '2.000' : finalPrice.toLocaleString('es-CO')}</span>
               </div>

               <button 
                 onClick={handleWhatsApp}
                 className="w-full bg-gradient-to-r from-[#DB0462] to-[#A9034A] hover:from-[#EED332] hover:to-[#C6AD1D] hover:text-[#07131B] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
               >
                 {isPlanSepare ? 'Abonar $2.000 ahora' : 'Comprar ahora'}
               </button>
               <p className="text-xs text-center text-gray-500 mt-4">Serás redirigido a WhatsApp para finalizar tu pedido de forma segura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MEDIOS DE PAGO */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
         <h2 className="text-2xl font-bold mb-10 text-gray-300">Nuestros Medios de Pago</h2>
         <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-80">
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2">Bancolombia</div>
              <div className="text-sm text-gray-400">Cuenta de Ahorros<br/>411-613736-71</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2 text-red-500">DaviPlata</div>
              <div className="text-sm text-gray-400">Nº 314 360 1738</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2 text-[#DB0462]">Nequi</div>
              <div className="text-sm text-gray-400">Nº 313 328 8298</div>
            </div>
         </div>
      </section>
    </main>
  );
}
