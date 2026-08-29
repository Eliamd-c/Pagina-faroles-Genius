"use client";

import { useState } from 'react';

type PaymentMethod = 'anticipado' | 'contraentrega' | 'separe';
type PackageSelection = 'ambos' | 'paquete1' | 'paquete2';

const PACKAGES = [
  {
    id: 'paquete1',
    num: "PAQUETE 1",
    subtitle: "Devoción y Tradición",
    items: [
      { img: 'Virgen de la inmaculada Concepcion noche.jpg', name: 'Inmaculada\nConcepción' },
      { img: 'Foto de la virgen de guadalupe en la noche.jpg', name: 'Virgen de\nGuadalupe' },
      { img: 'Virgen de Fatima Noche.jpg', name: 'Virgen de\nFátima' },
      { img: 'Virgen del Carmen en la noche.jpg', name: 'Virgen del\nCarmen' }
    ]
  },
  {
    id: 'paquete2',
    num: "PAQUETE 2",
    subtitle: "Fe y Esperanza",
    items: [
      { img: 'Virgen del sagrado Corazon.jpg', name: 'Sagrado Corazón\nde María' },
      { img: 'Virgen de la candelaria en la noche.jpg', name: 'Virgen de la\nCandelaria' },
      { img: 'Virgen de lourdes en la noche.jpg', name: 'Virgen de\nLourdes' },
      { img: 'virgen de chiquinquira en la noche.jpg', name: 'Virgen de\nChiquinquirá' }
    ]
  }
];

const PAYMENT_OPTIONS: { id: PaymentMethod; num: string; title: string; desc: string }[] = [
  {
    id: 'anticipado',
    num: '01',
    title: 'Pago Anticipado (Nequi/Bancolombia)',
    desc: 'Pagas el total ahora. Envío gratis garantizado y despacho prioritario.'
  },
  {
    id: 'contraentrega',
    num: '02',
    title: 'Pago Contra Entrega',
    desc: 'Pagas al recibir en casa. Tiene un recargo del 5% sobre el valor del pedido.'
  },
  {
    id: 'separe',
    num: '03',
    title: 'Plan Separe',
    desc: 'Abona solo $2.000 hoy para asegurar precio y disponibilidad.'
  }
];

export default function OfertaPage() {
  const [packageSelection, setPackageSelection] = useState<PackageSelection>('ambos');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('anticipado');

  const basePrice = packageSelection === 'ambos' ? 56000 : 30000;
  const finalPrice = paymentMethod === 'contraentrega' ? Math.round(basePrice * 1.05) : basePrice;

  const handleWhatsApp = () => {
    const phoneNumber = "573133288298";
    const packageDesc = packageSelection === 'ambos' 
      ? "Colección Completa (8 Faroles)" 
      : packageSelection === 'paquete1' ? "Paquete 1: Devoción y Tradición (4 Faroles)" : "Paquete 2: Fe y Esperanza (4 Faroles)";
      
    let message = `¡Hola! Quiero hacer un pedido de *${packageDesc}*.\n\n`;

    if (paymentMethod === 'separe') {
      message += `💰 *Modalidad:* Plan Separe\n`;
      message += `💳 *Abono inicial:* $2,000\n`;
      message += `💵 *Saldo restante al recibir:* $${(finalPrice - 2000).toLocaleString('es-CO')}\n`;
    } else if (paymentMethod === 'contraentrega') {
      message += `🚚 *Modalidad:* Pago Contra Entrega (+5%)\n`;
      message += `💵 *Subtotal:* $${basePrice.toLocaleString('es-CO')}\n`;
      message += `💵 *Total a pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    } else {
      message += `💳 *Modalidad:* Pago Anticipado (Sin recargos)\n`;
      message += `💵 *Total a pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    }

    message += `\n*Mis datos para el envío son:*\n`;
    message += `- Nombre:\n- Cédula:\n- Celular:\n- Dirección:\n- Ciudad:\n- Correo Electrónico:`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black scroll-smooth bg-[#081114]">
      
      {/* 01 - HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-16 pt-20 pb-16 overflow-hidden">
        {/* Glow Radial Design */}
        <div className="absolute inset-0 z-0 bg-[#081114]">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none"></div>
          <img src="/distribuidores/media/hero_bg.jpg" alt="Fondo Faroles" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#081114]/80 to-[#081114]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center md:text-left mt-16 md:mt-0">
          <div className="absolute -top-12 md:top-0 right-0 left-0 md:left-auto flex justify-center md:block">
            <img src="/distribuidores/logo.png" alt="Genius Faroles" className="w-24 md:w-32 h-auto opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
          </div>

          <h3 className="text-[#D4AF37] tracking-[0.2em] text-[10px] md:text-xs uppercase mb-6 font-semibold">
            EDICIÓN DE LUJO
          </h3>
          
          <h1 className="text-4xl md:text-6xl text-white font-serif border-b border-[#D4AF37]/50 inline-block pb-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Faroles de la Virgen María
          </h1>
          <h2 className="text-5xl md:text-7xl text-[#D4AF37] font-normal leading-[0.8] mb-8" style={{ fontFamily: 'var(--font-great-vibes)' }}>
            Luz y devoción
          </h2>
          
          <p className="text-gray-300 max-w-xl mx-auto md:mx-0 text-base md:text-lg font-light leading-relaxed mb-8">
            Ilumina la tradición del Día de las Velitas. Elaborados a mano meticulosamente en papel seda. Encendidos, cobran la calidez y majestuosidad del vitral de una capilla.
          </p>

          <a href="#comprar" className="inline-block bg-[#D4AF37] text-[#081114] px-8 py-4 rounded-full font-bold tracking-widest text-sm uppercase transition-all duration-300 mb-16 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#F3E5AB] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]">
            Ver Colección y Precios ↓
          </a>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto md:mx-0 border-t border-white/10 pt-8">
            <div>
              <div className="text-[#D4AF37] font-serif text-lg md:text-2xl mb-1 md:mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Garantía</div>
              <div className="text-gray-400 text-[9px] md:text-[10px] tracking-widest uppercase font-semibold">LLEGADA INTACTA</div>
            </div>
            <div>
              <div className="text-[#D4AF37] font-serif text-lg md:text-2xl mb-1 md:mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Gratis</div>
              <div className="text-gray-400 text-[9px] md:text-[10px] tracking-widest uppercase font-semibold">ENVÍO NACIONAL</div>
            </div>
            <div>
              <div className="text-[#D4AF37] font-serif text-lg md:text-2xl mb-1 md:mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>8</div>
              <div className="text-gray-400 text-[9px] md:text-[10px] tracking-widest uppercase font-semibold">DISEÑOS ÚNICOS</div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 - EL PRODUCTO (Web-Native Luxury Layout) */}
      <section className="relative py-24 px-8 md:px-16 bg-[#0B1518] border-t border-white/5 overflow-hidden">
        {/* Glow behind the farol */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15)_0%,transparent_60%)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold block mb-4 uppercase">Diseño de Autor</span>
            <h2 className="text-5xl md:text-7xl text-[#D4AF37] font-normal leading-[0.8] mb-4" style={{ fontFamily: 'var(--font-great-vibes)' }}>
              Artesanía
            </h2>
            <h3 className="text-3xl md:text-5xl text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
              hecha a mano
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mt-12">
            
            {/* Left Features (Materiales) */}
            <div className="w-full lg:w-1/3 space-y-6 order-2 lg:order-1">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Cartón de Caña de Azúcar</h4>
                <p className="text-gray-400 text-sm font-light">Estructura firme y ecológica que soporta la intemperie y mantiene la forma perfecta de la pieza.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Papel Seda Translúcido</h4>
                <p className="text-gray-400 text-sm font-light">Tamiza la luz creando un efecto de vitral cálido y envolvente, dando vida a los colores de cada advocación.</p>
              </div>
            </div>

            {/* Center Image (The specific isolated farol) */}
            <div className="w-full lg:w-1/3 flex justify-center order-1 lg:order-2 relative group">
              <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 blur-[50px] rounded-full transition-opacity duration-700 pointer-events-none"></div>
              <img 
                src="/distribuidores/media/farol_caracteristicas.png" 
                alt="Detalle del Farol" 
                className="relative z-10 w-full max-w-[280px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Right Features (Dimensiones y Armado) */}
            <div className="w-full lg:w-1/3 space-y-6 order-3">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Proporción Perfecta</h4>
                <p className="text-gray-400 text-sm font-light">
                  <span className="block text-white mb-1">17 cm ancho × 35 cm alto × 11 cm fondo.</span>
                  El tamaño ideal para destacar en andenes y antejardines sin perder estabilidad.
                </p>
              </div>
              <div className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-6 transition-all duration-300 hover:bg-[#D4AF37]/20 hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Listo para Iluminar</h4>
                <p className="text-gray-300 text-sm font-light">Ensamblado a mano. Diseñado de forma segura para usarse con vela tradicional o luces LED a batería.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 03 - COLECCIÓN Y ADVOCACIONES */}
      <section className="relative py-24 px-8 md:px-16 bg-[#081114] text-white border-t border-white/5">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold block mb-8 text-center md:text-left">02 · LA COLECCIÓN</span>

          <div className="text-center md:text-left mb-16">
            <h2 className="text-6xl md:text-7xl text-[#D4AF37] font-normal leading-[0.8]" style={{ fontFamily: 'var(--font-great-vibes)' }}>
              Ocho
            </h2>
            <h3 className="text-4xl md:text-5xl text-white mt-2 border-b-2 border-[#D4AF37]/50 inline-block pb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              advocaciones
            </h3>
            <p className="text-gray-300 max-w-xl mx-auto md:mx-0 text-sm md:text-base mt-8 leading-relaxed">
              Las devociones más queridas. Puedes llevar un paquete de cuatro, o aprovechar el descuento para tener la colección completa iluminando tu hogar.
            </p>
          </div>

          <div className="space-y-20">
            {PACKAGES.map((pkg, pIdx) => (
              <div key={pIdx}>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                  <span className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    {pkg.num}
                  </span>
                  <span className="text-xl text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{pkg.subtitle}</span>
                  <div className="hidden md:block h-px bg-white/10 flex-1 ml-4" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {pkg.items.map((m, i) => (
                    <div key={i} className="text-center group">
                      <div className="border border-white/10 rounded-2xl p-1 mb-4 flex items-center justify-center bg-black/40 overflow-hidden relative aspect-[3/4] transition-all duration-500 hover:border-[#D4AF37]/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10" />
                        <img 
                          src={`/distribuidores/media/${m.img}`} 
                          alt={m.name.replace('\n', ' ')} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-[1.03] transition-transform duration-700" 
                        />
                      </div>
                      <p className="text-sm text-gray-300 whitespace-pre-line leading-tight font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {m.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 - ADQUISICIÓN Y OFERTA */}
      <section id="comprar" className="relative py-24 px-8 md:px-16 bg-[#081114] border-t border-white/5 scroll-mt-10">
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="text-[#D4AF37] tracking-[0.2em] text-xs font-semibold block mb-12 text-center md:text-left">03 · ADQUISICIÓN Y OFERTA</span>

          <div className="text-center md:text-left mb-16">
            <h2 className="text-5xl md:text-6xl text-white font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Lleva tu colección</h2>
            <p className="text-gray-400 text-sm md:text-base">Garantiza el mejor precio comprando directamente hoy.</p>
          </div>

          {/* Opciones de Paquetes */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            
            <button
              type="button"
              onClick={() => setPackageSelection('paquete1')}
              className={`text-left border p-6 md:p-8 rounded-2xl transition-all duration-300 relative ${
                packageSelection === 'paquete1' ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'border-white/10 hover:border-[#D4AF37]/50 bg-black/20'
              }`}
            >
              <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-3 uppercase">PAQUETE 1</div>
              <div className="text-gray-300 text-xs mb-4">Devoción y Tradición</div>
              <div className="text-3xl text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>$30.000</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">4 Faroles • Envío Gratis</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageSelection('paquete2')}
              className={`text-left border p-6 md:p-8 rounded-2xl transition-all duration-300 relative ${
                packageSelection === 'paquete2' ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'border-white/10 hover:border-[#D4AF37]/50 bg-black/20'
              }`}
            >
              <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-3 uppercase">PAQUETE 2</div>
              <div className="text-gray-300 text-xs mb-4">Fe y Esperanza</div>
              <div className="text-3xl text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>$30.000</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">4 Faroles • Envío Gratis</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageSelection('ambos')}
              className={`text-left border p-6 md:p-8 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                packageSelection === 'ambos' ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)]' : 'border-white/10 hover:border-[#D4AF37]/50 bg-black/20'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#081114] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                RECOMENDADO
              </div>
              <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-3 uppercase">COLECCIÓN COMPLETA</div>
              <div className="text-[#D4AF37]/80 text-xs mb-4">Ahorra $4.000</div>
              <div className="text-4xl text-[#D4AF37] mb-2 font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>$56.000</div>
              <div className="text-gray-300 text-[10px] uppercase tracking-wider font-semibold">8 Faroles • Envío Gratis</div>
            </button>

          </div>

          {/* Métodos de Pago */}
          <div className="space-y-6">
            <h3 className="text-xl text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Forma de pago</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-300 ${
                    paymentMethod === opt.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-sm font-semibold text-white uppercase tracking-wider">{opt.title}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === opt.id ? 'border-[#D4AF37]' : 'border-gray-500'}`}>
                      {paymentMethod === opt.id && <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 leading-relaxed">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resumen Final y CTA */}
          <div className="mt-12 bg-black/40 border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="w-full lg:w-auto text-center md:text-left space-y-2">
              <div className="text-gray-400 text-xs tracking-widest uppercase font-semibold">Resumen del pedido</div>
              
              <div className="text-2xl text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                {packageSelection === 'ambos' ? 'Colección Completa (8 Faroles)' : packageSelection === 'paquete1' ? 'Paquete 1 (4 Faroles)' : 'Paquete 2 (4 Faroles)'}
              </div>
              
              <div className="flex flex-col text-sm text-gray-400 mt-2">
                {paymentMethod === 'contraentrega' && (
                  <span>Subtotal: ${basePrice.toLocaleString('es-CO')} + 5% recargo logístico</span>
                )}
                {paymentMethod === 'separe' && (
                  <span>Saldo a pagar previo al envío: ${(finalPrice - 2000).toLocaleString('es-CO')}</span>
                )}
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end">
              <div className="text-gray-400 text-[10px] tracking-widest uppercase mb-1 font-semibold">
                {paymentMethod === 'separe' ? 'TOTAL A ABONAR HOY' : 'TOTAL A PAGAR'}
              </div>
              <div className="text-4xl md:text-5xl text-[#D4AF37] font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                ${paymentMethod === 'separe' ? '2.000' : finalPrice.toLocaleString('es-CO')}
              </div>
              <button 
                type="button"
                onClick={handleWhatsApp}
                className="w-full lg:w-auto bg-[#D4AF37] text-[#081114] px-10 py-5 rounded-full font-bold tracking-[0.15em] text-sm uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#F3E5AB] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-105"
              >
                Pedir por WhatsApp
              </button>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
