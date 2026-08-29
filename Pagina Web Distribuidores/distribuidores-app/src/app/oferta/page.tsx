"use client";

import { useState } from 'react';

type PaymentMethod = 'anticipado' | 'contraentrega' | 'separe';
type PackageSelection = 'ambos' | 'paquete1' | 'paquete2';

const PACKAGES = [
  {
    id: 'paquete1',
    num: "COLECCIÓN 1",
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
    num: "COLECCIÓN 2",
    subtitle: "Fe y Esperanza",
    items: [
      { img: 'Virgen del sagrado Corazon.jpg', name: 'Sagrado Corazón\nde María' },
      { img: 'Virgen de la candelaria en la noche.jpg', name: 'Virgen de la\nCandelaria' },
      { img: 'Virgen de lourdes en la noche.jpg', name: 'Virgen de\nLourdes' },
      { img: 'virgen de chiquinquira en la noche.jpg', name: 'Virgen de\nChiquinquirá' }
    ]
  }
];

const PAYMENT_OPTIONS: { id: PaymentMethod; num: string; title: string; desc: string; extra: string }[] = [
  {
    id: 'anticipado',
    num: '01',
    title: 'Pago Anticipado',
    desc: 'Bancolombia o Nequi.',
    extra: 'Sin recargos. Despacho prioritario el mismo día.'
  },
  {
    id: 'contraentrega',
    num: '02',
    title: 'Pago Contra Entrega',
    desc: 'Pagas al recibir en casa.',
    extra: '+5% de recargo logístico de la transportadora.'
  },
  {
    id: 'separe',
    num: '03',
    title: 'Plan Separe',
    desc: 'Abona solo $2.000 hoy.',
    extra: 'Congela el precio y asegura tus faroles.'
  }
];

export default function OfertaPage() {
  const [packageSelection, setPackageSelection] = useState<PackageSelection>('ambos');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('anticipado');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const basePrice = packageSelection === 'ambos' ? 56000 : 30000;
  const finalPrice = paymentMethod === 'contraentrega' ? Math.round(basePrice * 1.05) : basePrice;

  const handleWhatsApp = () => {
    const phoneNumber = "573133288298";
    const packageDesc = packageSelection === 'ambos' 
      ? "Colección Completa (8 Faroles)" 
      : packageSelection === 'paquete1' ? "Paquete 1: Devoción y Tradición (4 Faroles)" : "Paquete 2: Fe y Esperanza (4 Faroles)";
      
    let message = `¡Hola! Quiero asegurar mi pedido de *${packageDesc}* para el Día de las Velitas.\n\n`;

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
      
      {/* =========================================
          1. HERO (ATENCIÓN E INTERÉS)
      ========================================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-16 pt-20 pb-16 overflow-hidden">
        {/* Glow Radial Design */}
        <div className="absolute inset-0 z-0 bg-[#081114]">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none"></div>
          <img src="/distribuidores/media/hero_bg.jpg" alt="Fondo Faroles" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#081114]/40 via-[#081114]/80 to-[#081114]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-8 md:mt-0">
          <div className="flex justify-center mb-8">
            <img src="/distribuidores/logo.png" alt="Genius Faroles" className="w-28 md:w-36 h-auto opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
          </div>
          
          {/* HUGE Envío Gratis Banner */}
          <div className="mb-8 flex justify-center">
             <div className="bg-[#D4AF37]/10 border border-[#D4AF37] px-6 py-2 rounded-full inline-flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <span className="text-2xl">🚚</span>
                <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm md:text-base">¡Envío Gratis a toda Colombia!</span>
             </div>
          </div>

          <h1 className="text-4xl md:text-7xl text-white font-serif mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ilumina tu 7 de Diciembre con la <span className="text-[#D4AF37] italic">Tradición más Hermosa</span>
          </h1>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-10">
            Faroles artesanales tipo vitral. Reúne a tu familia en oración y haz que tu hogar brille con la luz y devoción de la Virgen María.
          </p>

          <a href="#comprar" className="inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-[#081114] px-10 py-5 rounded-full font-bold tracking-widest text-sm uppercase transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:bg-[#F3E5AB] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:-translate-y-1">
            <span>Asegurar Pedido</span>
            <span className="bg-[#081114] text-[#D4AF37] px-3 py-1 rounded-full text-xs hidden md:inline-block">Pagas al recibir 🤝</span>
          </a>
        </div>
      </section>


      {/* =========================================
          2. CONEXIÓN EMOCIONAL
      ========================================= */}
      <section className="py-20 px-8 md:px-16 bg-[#0B1518] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl text-[#D4AF37] mb-6" style={{ fontFamily: 'var(--font-great-vibes)' }}>Más que un farol...</h2>
          <h3 className="text-2xl md:text-3xl text-white font-serif mb-8 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
            Es una invitación a la paz y la unión familiar.
          </h3>
          <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto">
            La Noche de Velitas es el momento más mágico del año. Nuestros faroles no solo decoran; 
            <strong> transforman tu andén en un santuario de luz</strong>. Mientras otros usan faroles genéricos que se queman o se dañan con el viento, 
            tú exhibirás verdaderas obras de arte que rinden homenaje a las devociones marianas más queridas de Colombia.
          </p>
        </div>
      </section>


      {/* =========================================
          3. PRESENTACIÓN DEL PRODUCTO (DESEO)
      ========================================= */}
      <section className="relative py-24 px-8 md:px-16 bg-[#081114] border-t border-white/5 overflow-hidden">
        {/* Glow behind the farol */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.12)_0%,transparent_60%)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-[#D4AF37] font-normal leading-[0.8] mb-4" style={{ fontFamily: 'var(--font-great-vibes)' }}>
              El secreto de
            </h2>
            <h3 className="text-3xl md:text-5xl text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
              su belleza iluminada
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mt-12">
            
            {/* Left Features (Beneficios) */}
            <div className="w-full lg:w-1/3 space-y-6 order-2 lg:order-1">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Soporta la intemperie</h4>
                <p className="text-gray-400 text-sm font-light">
                  A diferencia de los faroles de papel delgado, usamos <strong>cartón de caña de azúcar</strong>. Su estructura firme resiste las brisas de diciembre sin deformarse.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>El Efecto Vitral</h4>
                <p className="text-gray-400 text-sm font-light">
                  El <strong>papel seda translúcido</strong> tamiza la luz perfectamente, logrando que los colores vivos de la Virgen resplandezcan en la oscuridad como en una capilla.
                </p>
              </div>
            </div>

            {/* Center Image */}
            <div className="w-full lg:w-1/3 flex justify-center order-1 lg:order-2 relative group">
              <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 blur-[50px] rounded-full transition-opacity duration-700 pointer-events-none"></div>
              <img 
                src="/distribuidores/media/farol_caracteristicas.png" 
                alt="Detalle del Farol Inmaculada" 
                className="relative z-10 w-full max-w-[280px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Right Features */}
            <div className="w-full lg:w-1/3 space-y-6 order-3">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Presencia Majestuosa</h4>
                <p className="text-gray-400 text-sm font-light">
                  Con <strong>35 cm de alto</strong> y 17 cm de ancho, tienen el tamaño perfecto para no pasar desapercibidos y lucir espectaculares frente a tu casa.
                </p>
              </div>
              <div className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-6 transition-all duration-300 hover:bg-[#D4AF37]/20 hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <h4 className="text-[#D4AF37] text-lg font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>100% Seguros</h4>
                <p className="text-gray-300 text-sm font-light">
                  Su diseño interior espacioso evita que la vela tradicional toque el papel. También son compatibles con luces LED a batería. <strong>Armado fácil en segundos.</strong>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================
          4. INSTRUCCIONES DE ARMADO Y USO (VIDEOS)
      ========================================= */}
      <section className="py-20 px-8 md:px-16 bg-[#081114]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl text-[#D4AF37] font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Fáciles y seguros de usar
            </h2>
            <p className="text-gray-400">Diseñados para que cualquier miembro de la familia pueda armarlos en segundos.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Video 1: Cómo armar */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(212,175,55,0.15)] aspect-[9/16] relative bg-black">
                <video 
                  src="/distribuidores/media/como_armar.mp4" 
                  controls 
                  playsInline 
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl text-[#D4AF37] font-serif text-center" style={{ fontFamily: 'var(--font-playfair)' }}>Paso 1: Armado rápido</h4>
              <p className="text-sm text-gray-400 text-center px-4">Vienen pre-doblados. Solo necesitas desplegarlos y ajustar la base en menos de 10 segundos.</p>
            </div>

            {/* Video 2: Cómo poner la vela */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(212,175,55,0.15)] aspect-[9/16] relative bg-black">
                <video 
                  src="/distribuidores/media/poner_vela.mp4" 
                  controls 
                  playsInline 
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl text-[#D4AF37] font-serif text-center" style={{ fontFamily: 'var(--font-playfair)' }}>Paso 2: Colocar la vela</h4>
              <p className="text-sm text-gray-400 text-center px-4">Sistema seguro que mantiene la llama aislada del papel, garantizando una noche tranquila.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          5. LAS ADVOCACIONES (LA COLECCIÓN)
      ========================================= */}
      <section className="relative py-24 px-8 md:px-16 bg-[#0B1518] text-white border-t border-white/5">
        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl text-white font-serif mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Elige las devociones de tu familia
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Hemos seleccionado las 8 advocaciones marianas más queridas por los colombianos, divididas en dos colecciones perfectas.
            </p>
          </div>

          <div className="space-y-24">
            {PACKAGES.map((pkg, pIdx) => (
              <div key={pIdx}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10 text-center">
                  <span className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    {pkg.num}
                  </span>
                  <span className="text-2xl text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{pkg.subtitle}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {pkg.items.map((m, i) => (
                    <div key={i} className="text-center group">
                      <div className="border border-white/10 rounded-2xl p-1 mb-4 flex items-center justify-center bg-[#081114] overflow-hidden relative aspect-[3/4] transition-all duration-500 hover:border-[#D4AF37]/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10" />
                        <img 
                          src={`/distribuidores/media/${encodeURIComponent(m.img)}`} 
                          alt={m.name.replace('\n', ' ')} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-[1.05] transition-transform duration-700" 
                        />
                      </div>
                      <p className="text-base text-gray-200 whitespace-pre-line leading-tight font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
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


      {/* =========================================
          5. GARANTÍAS Y REVERSIÓN DE RIESGO
      ========================================= */}
      <section className="py-16 px-8 md:px-16 bg-[#D4AF37] text-[#081114]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-4xl mb-4">🛡️</div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Garantía Intacta</h4>
            <p className="text-[#081114]/80 text-sm">Empacados en cajas rígidas a medida. Si un farol llega aplastado, te lo reponemos sin costo.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🚚</div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Envío Gratis</h4>
            <p className="text-[#081114]/80 text-sm">No pagas un solo peso por el envío. Entregamos en la puerta de tu casa a nivel nacional.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🤝</div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Pago Contra Entrega</h4>
            <p className="text-[#081114]/80 text-sm">Para tu tranquilidad, puedes pagarle en efectivo al mensajero cuando recibas tu pedido.</p>
          </div>
        </div>
      </section>


      {/* =========================================
          6. OFERTA Y CHECKOUT (ACCIÓN)
      ========================================= */}
      <section id="comprar" className="relative py-24 px-8 md:px-16 bg-[#081114] scroll-mt-10">
        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-red-400 bg-red-400/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] mb-6 inline-block">
              🚨 PRODUCCIÓN ARTESANAL LIMITADA
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-serif mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Asegura los tuyos antes de que se agoten
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Al ser elaborados completamente a mano, nuestro inventario es muy reducido. Elige cuántos faroles deseas para tu hogar.
            </p>
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
              <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-3 uppercase">COLECCIÓN 1</div>
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
              <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-3 uppercase">COLECCIÓN 2</div>
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
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#081114] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-md">
                RECOMENDADO
              </div>
              <div className="text-[#D4AF37] tracking-[0.2em] text-[10px] font-bold mb-3 uppercase">COLECCIÓN COMPLETA</div>
              <div className="text-[#D4AF37]/80 text-xs mb-4">Ahorras $4.000</div>
              <div className="text-4xl text-[#D4AF37] mb-2 font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>$56.000</div>
              <div className="text-gray-300 text-[10px] uppercase tracking-wider font-semibold">8 Faroles • Envío Gratis</div>
            </button>

          </div>

          {/* Métodos de Pago */}
          <div className="space-y-6">
            <h3 className="text-xl text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>¿Cómo prefieres pagar?</h3>
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
                  <span className="text-sm text-gray-300 leading-relaxed mb-2">{opt.desc}</span>
                  <span className="text-xs text-[#D4AF37]/80 italic">{opt.extra}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resumen Final y CTA */}
          <div className="mt-12 bg-[#0B1518] border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-xl">
            <div className="w-full lg:w-auto text-center md:text-left space-y-2">
              <div className="text-gray-400 text-xs tracking-widest uppercase font-semibold">Resumen de tu pedido</div>
              
              <div className="text-2xl text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                {packageSelection === 'ambos' ? 'Colección Completa (8 Faroles)' : packageSelection === 'paquete1' ? 'Colección 1 (4 Faroles)' : 'Colección 2 (4 Faroles)'}
              </div>
              
              <div className="flex flex-col text-sm text-gray-400 mt-2">
                {paymentMethod === 'contraentrega' && (
                  <span>Subtotal: ${basePrice.toLocaleString('es-CO')} + 5% recargo de transportadora</span>
                )}
                {paymentMethod === 'separe' && (
                  <span>Saldo a pagar antes del envío: ${(finalPrice - 2000).toLocaleString('es-CO')}</span>
                )}
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end">
              <div className="text-gray-400 text-[10px] tracking-widest uppercase mb-1 font-semibold">
                {paymentMethod === 'separe' ? 'TU ABONO HOY' : 'TOTAL A PAGAR'}
              </div>
              <div className="text-4xl md:text-5xl text-[#D4AF37] font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                ${paymentMethod === 'separe' ? '2.000' : finalPrice.toLocaleString('es-CO')}
              </div>
              <button 
                type="button"
                onClick={handleWhatsApp}
                className="w-full lg:w-auto bg-[#D4AF37] text-[#081114] px-10 py-5 rounded-full font-bold tracking-[0.15em] text-sm md:text-base uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>Generar Pedido por WhatsApp</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          7. PREGUNTAS FRECUENTES (FAQ)
      ========================================= */}
      <section className="py-24 px-8 md:px-16 bg-[#0B1518] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-white font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-400">Resolvemos tus dudas antes de hacer tu pedido.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "¿Los faroles vienen armados o tengo que pegarlos?", a: "Te los enviamos pre-doblados y listos para encajar, no necesitas pegante. El armado es súper sencillo y te tomará menos de 10 segundos por farol (mira el video arriba)." },
              { q: "¿Sirven con velas de cera normales o solo luz LED?", a: "¡Con ambas! El interior es lo suficientemente amplio para que la vela tradicional no queme las paredes. Si hay mucho viento, también puedes usar luces LED a batería." },
              { q: "¿Cuánto tarda en llegar mi pedido?", a: "Los envíos tardan entre 2 a 5 días hábiles dependiendo de tu ciudad. Al ser temporada alta, te recomendamos pedir con anticipación." },
              { q: "¿Cómo funciona el Plan Separe?", a: "Abonas $2.000 COP hoy mediante transferencia (Nequi/Bancolombia) para congelar el precio y reservar tus faroles. El saldo restante lo pagas antes de que realicemos el despacho o al recibir." }
            ].map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-xl bg-[#081114] overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-serif text-lg text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{faq.q}</span>
                  <span className={`text-[#D4AF37] transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
