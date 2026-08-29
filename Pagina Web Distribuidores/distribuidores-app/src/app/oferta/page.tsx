"use client";

import { useState } from 'react';

const OFERTAS = [
  { id: 1, name: "Paquete 1", desc: "Devoción y Tradición", faroles: 4, price: 30000, recommended: false },
  { id: 2, name: "Paquete 2", desc: "Fe y Esperanza", faroles: 4, price: 30000, recommended: false },
  { id: 3, name: "Ambos Paquetes", desc: "Surtido Completo (8 Faroles)", faroles: 8, price: 56000, recommended: true },
];

export default function OfertaPage() {
  const [selectedOffer, setSelectedOffer] = useState(3);
  const [isContraEntrega, setIsContraEntrega] = useState(false);
  const [isPlanSepare, setIsPlanSepare] = useState(false);

  const offer = OFERTAS.find((o) => o.id === selectedOffer) || OFERTAS[2];
  
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
      message += `💳 *Modalidad:* Pago Anticipado (Nequi/DaviPlata/Bancolombia)\n`;
      message += `💵 *Total:* $${finalPrice.toLocaleString('es-CO')}\n`;
    }
    
    message += `\n*Mis datos para el envío son:*\n`;
    message += `- Nombre:\n- Cédula:\n- Celular:\n- Dirección:\n- Ciudad:\n- Correo Electrónico:`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#04090C] text-white font-sans overflow-x-hidden selection:bg-[#C6AD1D] selection:text-black">
      
      {/* 01 - HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
            poster="/distribuidores/media/hero_bg.jpg"
          >
            <source src="/distribuidores/media/hero_video.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#04090C]/20 via-[#04090C]/50 to-[#04090C]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 mt-16">
          <div className="mb-8">
            <img src="/distribuidores/logo.png" alt="Genius Farole Logo" className="w-32 md:w-48 mx-auto drop-shadow-2xl" />
          </div>
          
          <h2 className="text-sm md:text-md uppercase tracking-[0.3em] text-[#C6AD1D] font-medium mb-4">
            Faroles Genius
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-tight text-[#C6AD1D] drop-shadow-lg" style={{fontFamily: 'var(--font-great-vibes)'}}>
            Faroles alusivos a la <br/>
            <span className="text-white block mt-2" style={{fontFamily: 'var(--font-playfair)', fontWeight: 700}}>Virgen María</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mt-8 leading-relaxed border-l-2 border-[#C6AD1D] pl-6 text-left">
            Elaborados a mano en papel seda. Encendidos, se ven como el vitral de una iglesia. Conoce el producto, el precio y asegúralos con envío gratis.
          </p>
          
          <div className="pt-12 animate-bounce opacity-70">
            <span className="text-sm uppercase tracking-widest text-[#C6AD1D]">Descubre más</span>
            <div className="w-px h-16 bg-[#C6AD1D] mx-auto mt-4"></div>
          </div>
        </div>
      </section>


      {/* 02 - EL PRODUCTO (DETALLES Y MATERIALES) */}
      <section className="relative py-24 px-6 md:px-12 bg-[#04090C]">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[#C6AD1D] tracking-widest text-sm">01 · EL PRODUCTO</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            
            {/* MATERIALES */}
            <div className="space-y-6 order-2 lg:order-1 text-center lg:text-right">
              <h3 className="text-[#C6AD1D] tracking-widest text-sm mb-8 font-bold">MATERIALES</h3>
              
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#C6AD1D]/50 transition-colors">
                <p className="font-medium">Cartón de <br/>caña de azúcar</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#C6AD1D]/50 transition-colors">
                <p className="font-medium">Papel <br/>seda</p>
              </div>
              <div className="p-6 rounded-xl border border-[#C6AD1D]/30 bg-[#C6AD1D]/5 backdrop-blur-sm hover:border-[#C6AD1D]/80 transition-colors">
                <p className="font-medium text-[#C6AD1D]">Elaborados <br/>a mano</p>
              </div>
            </div>

            {/* IMAGEN CENTRAL */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl text-[#C6AD1D] mb-2" style={{fontFamily: 'var(--font-great-vibes)'}}>Hecho a mano,</h2>
              <h3 className="text-3xl md:text-4xl font-normal text-white mb-12" style={{fontFamily: 'var(--font-playfair)'}}>pieza por pieza</h3>
              
              <div className="relative group perspective-1000">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#C6AD1D] opacity-20 blur-[60px] rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
                <img src="/distribuidores/media/Foto de la virgen de guadalupe en la noche.jpg" alt="Virgen de Guadalupe Iluminada" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/distribuidores/faroles/1guadalupe.png'; }} className="relative z-10 w-full max-w-[280px] drop-shadow-2xl object-cover rounded-xl border border-white/5" />
              </div>
            </div>

            {/* DIMENSIONES */}
            <div className="space-y-6 order-3 lg:order-3 text-center lg:text-left">
              <h3 className="text-[#C6AD1D] tracking-widest text-sm mb-8 font-bold">DIMENSIONES</h3>
              
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#C6AD1D]/50 transition-colors">
                <p className="font-medium">17 cm <br/><span className="text-gray-400 text-sm">de ancho</span></p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#C6AD1D]/50 transition-colors">
                <p className="font-medium">35 cm <br/><span className="text-gray-400 text-sm">de alto</span></p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#C6AD1D]/50 transition-colors">
                <p className="font-medium">11 cm <br/><span className="text-gray-400 text-sm">de fondo</span></p>
              </div>
            </div>

          </div>

          <div className="mt-20 text-center max-w-3xl mx-auto border-t border-white/10 pt-12">
            <p className="text-gray-300 text-lg md:text-xl font-light">
              El papel seda deja pasar la luz de la vela y enciende los colores. Funciona con vela tradicional o con luz LED a batería.
            </p>
          </div>

        </div>
      </section>

      {/* 03 - ADVOCACIONES Y PAQUETES */}
      <section className="py-24 px-6 md:px-12 bg-[#020507]">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-16">
             <h2 className="text-6xl md:text-7xl text-[#C6AD1D]" style={{fontFamily: 'var(--font-great-vibes)'}}>Ocho</h2>
             <h3 className="text-4xl md:text-5xl font-normal text-white mt-2" style={{fontFamily: 'var(--font-playfair)'}}>advocaciones</h3>
             <div className="w-24 h-1 bg-[#C6AD1D] mt-8 mb-8"></div>
             <p className="text-gray-300 text-lg max-w-xl">
               Dos paquetes de cuatro faroles cada uno. Puedes elegir tu preferido o pedir ambos para tener la colección completa.
             </p>
          </div>

          {/* PAQUETE 1 */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
               <span className="bg-[#123140] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest border border-white/10 shadow-[0_0_15px_rgba(18,49,64,0.5)]">
                 PAQUETE 1
               </span>
               <span className="text-xl text-[#C6AD1D]" style={{fontFamily: 'var(--font-playfair)'}}>Devoción y Tradición</span>
               <div className="h-px bg-white/10 flex-1 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { img: 'Virgen de la inmaculada Concepcion noche.jpg', name: 'Inmaculada Concepción' },
                { img: 'Foto de la virgen de guadalupe en la noche.jpg', name: 'Virgen de Guadalupe' },
                { img: 'Virgen de Fatima Noche.jpg', name: 'Virgen de Fátima' },
                { img: 'Virgen del Carmen en la noche.jpg', name: 'Virgen del Carmen' }
              ].map((m, i) => (
                <div key={i} className="text-center group">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 aspect-[2/3] mb-4 flex items-center justify-center overflow-hidden hover:border-[#C6AD1D]/40 transition-colors backdrop-blur-md shadow-lg shadow-black/50">
                    <img src={`/distribuidores/media/${m.img}`} onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/distribuidores/faroles/1Inmaculada.png'; }} alt={m.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-md" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{m.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PAQUETE 2 */}
          <div>
            <div className="flex items-center gap-4 mb-8">
               <span className="bg-[#123140] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest border border-white/10 shadow-[0_0_15px_rgba(18,49,64,0.5)]">
                 PAQUETE 2
               </span>
               <span className="text-xl text-[#C6AD1D]" style={{fontFamily: 'var(--font-playfair)'}}>Fe y Esperanza</span>
               <div className="h-px bg-white/10 flex-1 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { img: 'Virgen del sagrado Corazon.jpg', name: 'Sagrado Corazón de María' },
                { img: 'Virgen de la candelaria en la noche.jpg', name: 'Virgen de la Candelaria' },
                { img: 'Virgen de lourdes en la noche.jpg', name: 'Virgen de Lourdes' },
                { img: 'virgen de chiquinquira en la noche.jpg', name: 'Virgen de Chiquinquirá' }
              ].map((m, i) => (
                <div key={i} className="text-center group">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 aspect-[2/3] mb-4 flex items-center justify-center overflow-hidden hover:border-[#C6AD1D]/40 transition-colors backdrop-blur-md shadow-lg shadow-black/50">
                    <img src={`/distribuidores/media/${m.img}`} onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/distribuidores/faroles/1Chiquinquira.png'; }} alt={m.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-md" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{m.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 04 - GLASSMORPHISM PRICING & CHECKOUT */}
      <section className="relative py-24 px-6 bg-[#04090C] overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#123140] rounded-full blur-[150px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C6AD1D] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[#C6AD1D] tracking-widest text-sm">02 · EL PRECIO</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="text-center mb-16">
             <h2 className="text-5xl md:text-6xl font-normal text-white mb-6" style={{fontFamily: 'var(--font-playfair)'}}>Haz tu pedido</h2>
             <p className="text-gray-400 text-lg">Envío gratuito comprando ahora mismo. Selecciona tu plan.</p>
          </div>

          {/* Pricing Cards (Glassmorphism) */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {OFERTAS.map((o) => (
              <div 
                key={o.id}
                onClick={() => { setSelectedOffer(o.id); setIsPlanSepare(false); }}
                className={`relative cursor-pointer transition-all duration-300 rounded-2xl p-8 backdrop-blur-xl border ${selectedOffer === o.id ? 'border-[#C6AD1D] bg-[#C6AD1D]/10 shadow-[0_0_30px_rgba(198,173,29,0.15)] transform -translate-y-2' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
              >
                {o.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C6AD1D] text-[#04090C] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-[#C6AD1D]/20">
                    RECOMENDADO
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{o.name}</h3>
                    <p className="text-[#C6AD1D] text-xs uppercase tracking-wider">{o.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedOffer === o.id ? 'border-[#C6AD1D]' : 'border-gray-500'}`}>
                    {selectedOffer === o.id && <div className="w-2.5 h-2.5 bg-[#C6AD1D] rounded-full"></div>}
                  </div>
                </div>
                
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-normal text-white" style={{fontFamily: 'var(--font-playfair)'}}>${o.price.toLocaleString('es-CO')}</span>
                </div>
                
                <div className="text-sm text-gray-400">
                  <span className="text-white font-medium">{o.faroles} faroles</span> en total. Envío GRATIS.
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SECTION */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row gap-12 relative overflow-hidden">
            
            {/* Subtle glow inside the panel */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#C6AD1D]/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Toggles */}
            <div className="flex-1 space-y-6 relative z-10">
              <h3 className="text-xl font-normal text-white mb-8" style={{fontFamily: 'var(--font-playfair)'}}>Opciones de pago flexibles</h3>
              
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isContraEntrega && !isPlanSepare ? 'border-white/40 bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/5 bg-black/20 hover:bg-black/30'}`}>
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
                    <div className={`block w-12 h-6 rounded-full transition-colors ${isContraEntrega ? 'bg-[#C6AD1D]' : 'bg-gray-800'}`}></div>
                    <div className={`absolute left-1 top-1 bg-[#04090C] w-4 h-4 rounded-full transition-transform ${isContraEntrega ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white uppercase tracking-wider text-sm mb-1">Pago Contra Entrega (+5%)</h4>
                    <p className="text-sm text-gray-400">
                      Paga en efectivo al recibir tu pedido en la puerta de tu casa.
                    </p>
                  </div>
                </label>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isPlanSepare ? 'border-[#C6AD1D]/60 bg-[#C6AD1D]/10 shadow-[inset_0_0_20px_rgba(198,173,29,0.1)]' : 'border-white/5 bg-black/20 hover:bg-black/30'}`}>
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
                    <div className={`block w-12 h-6 rounded-full transition-colors ${isPlanSepare ? 'bg-[#C6AD1D]' : 'bg-gray-800'}`}></div>
                    <div className={`absolute left-1 top-1 bg-[#04090C] w-4 h-4 rounded-full transition-transform ${isPlanSepare ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white uppercase tracking-wider text-sm mb-1">Plan Separe</h4>
                    <p className="text-sm text-gray-400">
                      Asegura tu pedido hoy con solo <strong>$2.000</strong> de abono. Te los recordamos después.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Recibo */}
            <div className="w-full lg:w-[400px] border-l border-white/10 lg:pl-12 flex flex-col relative z-10">
               <h3 className="text-xl font-normal text-white mb-8" style={{fontFamily: 'var(--font-playfair)'}}>Resumen</h3>
               
               <div className="flex-1 space-y-4 text-sm font-medium">
                 <div className="flex justify-between text-gray-300">
                   <span>{offer.name} ({offer.faroles} Faroles)</span>
                   <span>${basePrice.toLocaleString('es-CO')}</span>
                 </div>
                 <div className="flex justify-between text-[#C6AD1D]">
                   <span>Envío Nacional</span>
                   <span>GRATIS</span>
                 </div>
                 
                 {isContraEntrega && (
                   <div className="flex justify-between text-gray-400 pt-2 border-t border-white/10">
                     <span>Recargo Contra Entrega (5%)</span>
                     <span>+${(finalPrice - basePrice).toLocaleString('es-CO')}</span>
                   </div>
                 )}
                 
                 {isPlanSepare && (
                   <div className="flex justify-between text-[#C6AD1D] pt-2 border-t border-white/10">
                     <span>Abono inicial hoy</span>
                     <span>-$2.000</span>
                   </div>
                 )}
               </div>

               <div className="mt-8 mb-8 border-t border-white/10 pt-6 flex justify-between items-end">
                 <span className="text-sm text-gray-400 uppercase tracking-widest">{isPlanSepare ? 'Total a abonar hoy' : 'Total a pagar'}</span>
                 <span className="text-4xl text-[#C6AD1D]" style={{fontFamily: 'var(--font-playfair)'}}>${isPlanSepare ? '2.000' : finalPrice.toLocaleString('es-CO')}</span>
               </div>

               <button 
                 onClick={handleWhatsApp}
                 className="w-full bg-[#C6AD1D] hover:bg-white text-[#04090C] font-bold uppercase tracking-widest text-sm py-5 rounded-xl transition-colors duration-300 shadow-[0_10px_20px_rgba(198,173,29,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.3)]"
               >
                 {isPlanSepare ? 'Abonar $2.000 vía WhatsApp' : 'Comprar vía WhatsApp'}
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - MEDIOS DE PAGO */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/5 relative">
         <h2 className="text-[#C6AD1D] tracking-widest text-xs uppercase mb-12">Medios de Pago Autorizados</h2>
         <div className="flex flex-col md:flex-row justify-center gap-12 items-center text-gray-400">
            <div className="text-center">
              <div className="text-white font-medium mb-1 tracking-wider">BANCOLOMBIA</div>
              <div className="text-sm font-light">Ahorros 411-613736-71</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-white font-medium mb-1 tracking-wider">DAVIPLATA</div>
              <div className="text-sm font-light">Nº 314 360 1738</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-white font-medium mb-1 tracking-wider">NEQUI</div>
              <div className="text-sm font-light">Nº 313 328 8298</div>
            </div>
         </div>
      </footer>
    </main>
  );
}
