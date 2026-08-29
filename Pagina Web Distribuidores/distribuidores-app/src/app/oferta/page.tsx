"use client";

import { useState } from 'react';

const OFERTAS = [
  { id: 1, name: "1 Paquete", desc: "4 Faroles", faroles: 4, price: 30000, recommended: false },
  { id: 3, name: "2 Paquetes", desc: "8 Faroles", faroles: 8, price: 56000, recommended: true },
];

export default function OfertaPage() {
  const [selectedOffer, setSelectedOffer] = useState(3);
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
    
    let message = `¡Hola! Quiero hacer un pedido de *${offer.name} - ${offer.desc} (${offer.faroles} Faroles)*.\n\n`;
    
    if (isPlanSepare) {
      message += `💰 *Modalidad:* Plan Separe\n`;
      message += `💳 *Abono inicial:* $2,000\n`;
      message += `💵 *Total a pagar luego:* $${(finalPrice - 2000).toLocaleString('es-CO')}\n`;
    } else if (isContraEntrega) {
      message += `🚚 *Modalidad:* Pago Contra Entrega (+5%)\n`;
      message += `💵 *Total:* $${finalPrice.toLocaleString('es-CO')}\n`;
    } else {
      message += `💳 *Modalidad:* Pago Anticipado\n`;
      message += `💵 *Total:* $${finalPrice.toLocaleString('es-CO')}\n`;
    }
    
    message += `\n*Mis datos para el envío son:*\n`;
    message += `- Nombre:\n- Cédula:\n- Celular:\n- Dirección:\n- Ciudad:\n- Correo Electrónico:`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <main className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* 01 - HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-16 pt-20 pb-16 bg-[#081114]">
        {/* Background image slightly visible */}
        <div className="absolute inset-0 z-0">
          <img src="/distribuidores/media/hero_bg.jpg" alt="Fondo Faroles" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#081114]/80 via-[#081114]/90 to-[#081114]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Top Logo */}
          <div className="absolute top-0 right-0 hidden md:block">
            <img src="/distribuidores/logo.png" alt="Genius Faroles" className="w-24 h-auto" />
          </div>

          <h3 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase mb-6 font-semibold">
            FAROLES GENIUS
          </h3>
          
          <h1 className="text-6xl md:text-8xl text-[#D4AF37] font-normal leading-[0.8]" style={{fontFamily: 'var(--font-great-vibes)'}}>
            Faroles alusivos a la
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif text-white mt-4 border-b border-[#D4AF37] inline-block pb-4 mb-8" style={{fontFamily: 'var(--font-playfair)'}}>
            Virgen María
          </h2>
          
          <p className="text-gray-300 max-w-xl text-lg font-light leading-relaxed mb-16">
            Elaborados a mano en papel seda. Encendidos, se ven como el
            vitral de una iglesia. Conoce el producto, el precio y asegúralos con envío gratis.
          </p>
          
          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl border-t border-white/10 pt-8 mt-12">
            <div>
              <div className="text-[#D4AF37] font-serif text-xl md:text-2xl mb-2" style={{fontFamily: 'var(--font-playfair)'}}>$30.000–$56.000</div>
              <div className="text-gray-500 text-[10px] tracking-widest uppercase">PRECIO AL PÚBLICO</div>
            </div>
            <div>
              <div className="text-[#D4AF37] font-serif text-xl md:text-2xl mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Gratis</div>
              <div className="text-gray-500 text-[10px] tracking-widest uppercase">ENVÍO NACIONAL</div>
            </div>
            <div>
              <div className="text-[#D4AF37] font-serif text-xl md:text-2xl mb-2" style={{fontFamily: 'var(--font-playfair)'}}>8</div>
              <div className="text-gray-500 text-[10px] tracking-widest uppercase">ADVOCACIONES MARIANAS</div>
            </div>
          </div>
        </div>
      </section>


      {/* 02 - EL PRODUCTO */}
      <section className="relative py-24 px-8 md:px-16 bg-[#0B1518]">
        <div className="max-w-5xl mx-auto relative">
          
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold">01 · EL PRODUCTO</span>
          </div>

          <h2 className="text-5xl md:text-7xl text-[#D4AF37] font-normal leading-[0.8]" style={{fontFamily: 'var(--font-great-vibes)'}}>
            Hecho a mano,
          </h2>
          <h3 className="text-3xl md:text-4xl text-white mt-4 border-b border-[#D4AF37] inline-block pb-3 mb-16" style={{fontFamily: 'var(--font-playfair)'}}>
            pieza por pieza
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left: Materiales */}
            <div className="w-full md:w-1/4 space-y-8 relative z-10">
              <h4 className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold text-center md:text-left mb-6">MATERIALES</h4>
              
              <div className="border border-[#D4AF37]/30 rounded-lg p-4 text-center relative group">
                <p className="text-sm text-gray-300">Cartón de<br/>caña de azúcar</p>
                <div className="hidden md:block absolute top-1/2 -right-16 w-16 h-px bg-[#D4AF37]/50"></div>
              </div>
              
              <div className="border border-[#D4AF37]/30 rounded-lg p-4 text-center relative group">
                <p className="text-sm text-gray-300">Papel<br/>seda</p>
                <div className="hidden md:block absolute top-1/2 -right-16 w-16 h-px bg-[#D4AF37]/50"></div>
              </div>
              
              <div className="border border-[#D4AF37]/50 rounded-lg p-4 text-center relative group bg-[#D4AF37]/5">
                <p className="text-sm text-[#D4AF37]">Elaborados<br/>a mano</p>
                <div className="hidden md:block absolute top-1/2 -right-16 w-16 h-px bg-[#D4AF37]/50"></div>
              </div>
            </div>

            {/* Center Image */}
            <div className="w-full md:w-2/4 flex justify-center relative z-0">
               <img 
                 src="/distribuidores/media/Foto de la virgen de guadalupe en la noche.jpg" 
                 alt="Guadalupe" 
                 className="w-full max-w-[260px] object-cover rounded-lg drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                 onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/distribuidores/faroles/1guadalupe.png'; }}
               />
            </div>

            {/* Right: Dimensiones */}
            <div className="w-full md:w-1/4 space-y-8 relative z-10">
              <h4 className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold text-center md:text-right mb-6">DIMENSIONES</h4>
              
              <div className="border border-[#D4AF37]/30 rounded-lg p-4 text-center relative group">
                <div className="hidden md:block absolute top-1/2 -left-16 w-16 h-px bg-[#D4AF37]/50"></div>
                <p className="text-sm text-gray-300">17 cm<br/>de ancho</p>
              </div>
              
              <div className="border border-[#D4AF37]/30 rounded-lg p-4 text-center relative group">
                <div className="hidden md:block absolute top-1/2 -left-16 w-16 h-px bg-[#D4AF37]/50"></div>
                <p className="text-sm text-gray-300">35 cm<br/>de alto</p>
              </div>
              
              <div className="border border-[#D4AF37]/30 rounded-lg p-4 text-center relative group">
                <div className="hidden md:block absolute top-1/2 -left-16 w-16 h-px bg-[#D4AF37]/50"></div>
                <p className="text-sm text-gray-300">11 cm<br/>de fondo</p>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center max-w-2xl mx-auto border-t border-white/10 pt-12">
            <p className="text-gray-400 text-sm md:text-base font-light">
              El papel seda deja pasar la luz de la vela y enciende los colores. Funciona con vela
              tradicional o con luz LED a batería.
            </p>
          </div>

        </div>
      </section>

      {/* 03 - OCHO ADVOCACIONES (DARK BACKGROUND WITH NIGHT PHOTOS) */}
      <section className="py-24 px-8 md:px-16 bg-[#081114] text-white">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold">01 · EL PRODUCTO</span>
          </div>

          <h2 className="text-6xl md:text-8xl text-[#D4AF37] font-normal leading-[0.8]" style={{fontFamily: 'var(--font-great-vibes)'}}>
            Ocho
          </h2>
          <h3 className="text-4xl md:text-5xl text-white mt-2 mb-8 border-b-2 border-[#D4AF37] inline-block pb-4" style={{fontFamily: 'var(--font-playfair)'}}>
            advocaciones
          </h3>
          
          <p className="text-gray-300 max-w-lg text-sm md:text-base mb-16 leading-relaxed">
            Dos paquetes de cuatro faroles cada uno. Puedes pedir el que prefieras
            o llevar ambos para tener la colección completa iluminando tu hogar.
          </p>

          {/* PAQUETE 1 */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
               <span className="bg-[#D4AF37] text-[#081114] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em]">
                 PAQUETE 1
               </span>
               <span className="text-lg text-[#D4AF37]" style={{fontFamily: 'var(--font-playfair)'}}>Devoción y Tradición</span>
               <div className="h-px bg-white/10 flex-1 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { img: 'Virgen de la inmaculada Concepcion noche.jpg', name: 'Inmaculada\nConcepción' },
                { img: 'Foto de la virgen de guadalupe en la noche.jpg', name: 'Virgen de\nGuadalupe' },
                { img: 'Virgen de Fatima Noche.jpg', name: 'Virgen de\nFátima' },
                { img: 'Virgen del Carmen en la noche.jpg', name: 'Virgen del\nCarmen' }
              ].map((m, i) => (
                <div key={i} className="text-center group">
                  <div className="border border-white/10 rounded-xl p-1 mb-4 flex items-center justify-center shadow-lg bg-black/20 overflow-hidden relative aspect-[3/4]">
                    <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <img 
                      src={`/distribuidores/media/${m.img}`} 
                      alt={m.name.replace('\n', ' ')} 
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <p className="text-sm text-gray-300 font-serif whitespace-pre-line leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>{m.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PAQUETE 2 */}
          <div>
            <div className="flex items-center gap-4 mb-8">
               <span className="bg-[#D4AF37] text-[#081114] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em]">
                 PAQUETE 2
               </span>
               <span className="text-lg text-[#D4AF37]" style={{fontFamily: 'var(--font-playfair)'}}>Fe y Esperanza</span>
               <div className="h-px bg-white/10 flex-1 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { img: 'Virgen del sagrado Corazon.jpg', name: 'Sagrado Corazón\nde María' },
                { img: 'Virgen de la candelaria en la noche.jpg', name: 'Virgen de la\nCandelaria' },
                { img: 'Virgen de lourdes en la noche.jpg', name: 'Virgen de\nLourdes' },
                { img: 'virgen de chiquinquira en la noche.jpg', name: 'Virgen de\nChiquinquirá' }
              ].map((m, i) => (
                <div key={i} className="text-center group">
                  <div className="border border-white/10 rounded-xl p-1 mb-4 flex items-center justify-center shadow-lg bg-black/20 overflow-hidden relative aspect-[3/4]">
                    <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <img 
                      src={`/distribuidores/media/${m.img}`} 
                      alt={m.name.replace('\n', ' ')} 
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <p className="text-sm text-gray-300 font-serif whitespace-pre-line leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>{m.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 04 - PRECIO Y COMPRA (DARK) */}
      <section className="py-24 px-8 md:px-16 bg-[#0B1518] relative">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold">02 · EL PRECIO</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif text-white mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Un paquete de 4 faroles</h2>
          <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-12 border-b-2 border-[#D4AF37] inline-block pb-4" style={{fontFamily: 'var(--font-playfair)'}}>cuesta $30.000</h2>

          {/* Pricing Box */}
          <div className="border border-[#D4AF37]/50 rounded-xl p-8 md:p-12 mb-16 flex flex-col md:flex-row gap-8 items-center bg-[#D4AF37]/5 backdrop-blur-sm">
             <div className="text-5xl md:text-6xl text-[#D4AF37] font-serif" style={{fontFamily: 'var(--font-playfair)'}}>
               $56.000
             </div>
             <div className="text-gray-300 text-sm md:text-base leading-relaxed">
               Precio por la <strong>colección completa (8 faroles)</strong>.<br/>
               Llevando ambos paquetes ahorras dinero y te aseguras de tener todas las advocaciones. El envío es totalmente gratis a cualquier parte del país.
             </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-serif text-white mb-4" style={{fontFamily: 'var(--font-playfair)'}}>Selecciona tu pedido</h3>
            <p className="text-gray-400 text-sm mb-8">Elige cuántos paquetes deseas y el método de pago que prefieres.</p>
          </div>

          {/* Selection Panels */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
             <div 
               onClick={() => setSelectedOffer(1)}
               className={`border p-8 rounded-xl cursor-pointer transition-colors ${selectedOffer === 1 ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/20 hover:border-[#D4AF37]/50'}`}
             >
               <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-4 uppercase">1 PAQUETE (4 FAROLES)</div>
               <div className="text-4xl text-white font-serif mb-2" style={{fontFamily: 'var(--font-playfair)'}}>$30.000</div>
               <div className="text-gray-400 text-sm">Envío gratis incluido.</div>
             </div>

             <div 
               onClick={() => setSelectedOffer(3)}
               className={`border p-8 rounded-xl cursor-pointer transition-colors ${selectedOffer === 3 ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/20 hover:border-[#D4AF37]/50'}`}
             >
               <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-4 uppercase">2 PAQUETES (8 FAROLES)</div>
               <div className="text-4xl text-white font-serif mb-2" style={{fontFamily: 'var(--font-playfair)'}}>$56.000</div>
               <div className="text-gray-400 text-sm">Mejor precio. Envío gratis incluido.</div>
             </div>
          </div>

          {/* Payment Methods - Styled like the PDF sections */}
          <div className="space-y-8 border-t border-white/10 pt-12">
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="text-[#D4AF37] font-serif text-xl" style={{fontFamily: 'var(--font-playfair)'}}>01</div>
              <div className="flex-1 border-b border-white/10 pb-8">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" name="payment" className="w-5 h-5 accent-[#D4AF37]" checked={!isContraEntrega && !isPlanSepare} onChange={() => { setIsContraEntrega(false); setIsPlanSepare(false); }} />
                  <div>
                    <h4 className="text-lg text-white font-serif mb-1" style={{fontFamily: 'var(--font-playfair)'}}>Pago Anticipado (Nequi/Bancolombia)</h4>
                    <p className="text-gray-400 text-sm">Pagas el total ahora. Envío gratis garantizado y despacho prioritario.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="text-[#D4AF37] font-serif text-xl" style={{fontFamily: 'var(--font-playfair)'}}>02</div>
              <div className="flex-1 border-b border-white/10 pb-8">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" name="payment" className="w-5 h-5 accent-[#D4AF37]" checked={isContraEntrega} onChange={() => { setIsContraEntrega(true); setIsPlanSepare(false); }} />
                  <div>
                    <h4 className="text-lg text-white font-serif mb-1" style={{fontFamily: 'var(--font-playfair)'}}>Pago Contra Entrega</h4>
                    <p className="text-gray-400 text-sm">Pagas al recibir. Tiene un recargo del 5% sobre el valor del pedido.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="text-[#D4AF37] font-serif text-xl" style={{fontFamily: 'var(--font-playfair)'}}>03</div>
              <div className="flex-1 border-b border-white/10 pb-8">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" name="payment" className="w-5 h-5 accent-[#D4AF37]" checked={isPlanSepare} onChange={() => { setIsPlanSepare(true); setIsContraEntrega(false); }} />
                  <div>
                    <h4 className="text-lg text-white font-serif mb-1" style={{fontFamily: 'var(--font-playfair)'}}>Plan Separe</h4>
                    <p className="text-gray-400 text-sm">Abona solo $2.000 hoy para asegurar tu precio y disponibilidad.</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-between items-center bg-[#D4AF37]/10 border border-[#D4AF37]/50 rounded-xl p-8">
             <div>
                <div className="text-gray-400 text-xs tracking-widest uppercase mb-1">Total a pagar {isPlanSepare && 'hoy'}</div>
                <div className="text-4xl text-[#D4AF37] font-serif" style={{fontFamily: 'var(--font-playfair)'}}>
                  ${isPlanSepare ? '2.000' : finalPrice.toLocaleString('es-CO')}
                </div>
             </div>
             <button 
                onClick={handleWhatsApp}
                className="mt-6 md:mt-0 bg-[#D4AF37] text-[#081114] px-12 py-4 rounded font-bold tracking-widest text-sm uppercase hover:bg-white transition-colors"
             >
                Pedir por WhatsApp
             </button>
          </div>

        </div>
      </section>

    </main>
  );
}
