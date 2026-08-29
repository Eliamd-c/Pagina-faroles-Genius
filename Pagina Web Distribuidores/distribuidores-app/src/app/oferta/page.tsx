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
    extra: 'Despacho prioritario hoy.'
  },
  {
    id: 'contraentrega',
    num: '02',
    title: 'Pago Contra Entrega',
    desc: 'Pagas al recibir en casa.',
    extra: '+5% recargo de transportadora.'
  },
  {
    id: 'separe',
    num: '03',
    title: 'Plan Separe',
    desc: 'Abona solo $2.000 hoy.',
    extra: 'Congela el precio.'
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
      
    let message = `¡Hola! Quiero asegurar mi pedido de *${packageDesc}*.\n\n`;

    if (paymentMethod === 'separe') {
      message += `💰 *Modalidad:* Plan Separe\n`;
      message += `💳 *Abono inicial:* $2,000\n`;
      message += `💵 *Saldo restante al recibir:* $${(finalPrice - 2000).toLocaleString('es-CO')}\n`;
    } else if (paymentMethod === 'contraentrega') {
      message += `🚚 *Modalidad:* Pago Contra Entrega (+5%)\n`;
      message += `💵 *Subtotal:* $${basePrice.toLocaleString('es-CO')}\n`;
      message += `💵 *Total a pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    } else {
      message += `💳 *Modalidad:* Pago Anticipado\n`;
      message += `💵 *Total a pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    }

    message += `\n*Mis datos para el envío son:*\n`;
    message += `- Nombre:\n- Cédula:\n- Celular:\n- Dirección:\n- Ciudad:\n- Correo Electrónico:`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black scroll-smooth bg-black">
      
      {/* =========================================
          1. HERO (RÁPIDO Y DIRECTO)
      ========================================= */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-16 pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none"></div>
          <img src="/distribuidores/media/hero_bg.jpg" alt="Fondo Faroles" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          <div className="flex justify-center mb-8">
            <img src="/distribuidores/logo.png" alt="Genius Faroles" className="w-32 h-auto opacity-100 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
          </div>
          
          <div className="mb-6 flex justify-center">
             <div className="bg-[#D4AF37] text-black px-6 py-2 rounded-full inline-flex items-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                <span className="text-2xl">🚚</span>
                <span className="font-black tracking-widest uppercase text-sm md:text-base">¡ENVÍO GRATIS A TODA COLOMBIA!</span>
             </div>
          </div>

          <h1 className="text-4xl md:text-7xl text-white font-serif mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ilumina tu 7 de Diciembre con la <span className="text-[#D4AF37] italic">Tradición más Hermosa</span>
          </h1>
          
          <p className="text-white max-w-2xl mx-auto text-lg md:text-xl font-normal leading-relaxed mb-10">
            Faroles artesanales tipo vitral. Reúne a tu familia en oración y haz que tu hogar brille con la devoción de la Virgen María.
          </p>

          <a href="#comprar" className="inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black px-10 py-5 rounded-full font-black tracking-widest text-sm md:text-base uppercase transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:bg-white hover:scale-105">
            <span>Asegurar Pedido</span>
            <span className="bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs hidden md:inline-block">Pagas al recibir 🤝</span>
          </a>
        </div>
      </section>

      {/* =========================================
          2. CARACTERÍSTICAS (BULLETS ALTO CONTRASTE)
      ========================================= */}
      <section className="py-16 px-6 md:px-16 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
          
          {/* Left: Imagen destacada */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-[#D4AF37] opacity-20 blur-[60px] rounded-full pointer-events-none"></div>
            <img 
              src="/distribuidores/media/farol_caracteristicas.png" 
              alt="Detalle del Farol" 
              className="relative z-10 w-full max-w-[300px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
            />
          </div>

          {/* Right: Viñetas rápidas */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl text-white font-serif mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
              Calidad que <span className="text-[#D4AF37] italic">resplandece</span>
            </h2>
            
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h4 className="text-xl text-white font-bold">Resistentes a la intemperie</h4>
                  <p className="text-gray-300 text-sm mt-1">Estructura firme en cartón de caña de azúcar. No se deforman con la brisa.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-3xl">✨</span>
                <div>
                  <h4 className="text-xl text-white font-bold">Efecto Vitral</h4>
                  <p className="text-gray-300 text-sm mt-1">Papel seda translúcido que ilumina vívidamente los colores de la Virgen.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-3xl">📏</span>
                <div>
                  <h4 className="text-xl text-white font-bold">Tamaño Majestuoso</h4>
                  <p className="text-gray-300 text-sm mt-1">35 cm de alto x 17 cm de ancho. Destacan perfectamente en tu andén.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-3xl">🕯️</span>
                <div>
                  <h4 className="text-xl text-white font-bold">100% Seguros</h4>
                  <p className="text-gray-300 text-sm mt-1">Diseño amplio que evita que la vela tradicional queme el papel. (También aptos para luz LED).</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* =========================================
          3. COLECCIÓN (RÁPIDA)
      ========================================= */}
      <section className="py-20 px-6 md:px-16 bg-black border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-white font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Nuestras Colecciones
            </h2>
            <p className="text-white text-lg">Elige tus devociones favoritas.</p>
          </div>

          <div className="space-y-16">
            {PACKAGES.map((pkg, pIdx) => (
              <div key={pIdx}>
                <div className="flex items-center justify-center gap-4 mb-8 text-center">
                  <span className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    {pkg.num}
                  </span>
                  <span className="text-2xl text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>{pkg.subtitle}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {pkg.items.map((m, i) => (
                    <div key={i} className="text-center">
                      <div className="border-2 border-white/20 rounded-xl p-1 mb-3 flex items-center justify-center bg-[#0a0a0a] overflow-hidden aspect-[3/4]">
                        <img 
                          src={`/distribuidores/media/${encodeURIComponent(m.img)}`} 
                          alt={m.name.replace('\n', ' ')} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                      <p className="text-white font-bold whitespace-pre-line leading-tight text-sm md:text-base">
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
          4. CONFIANZA TOTAL
      ========================================= */}
      <section className="py-12 px-6 md:px-16 bg-[#D4AF37] text-black">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/20 p-6 rounded-2xl">
            <div className="text-4xl mb-3">🛡️</div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-1">Garantía Intacta</h4>
            <p className="text-black/80 text-sm font-medium">Si un farol llega dañado, lo reponemos sin costo.</p>
          </div>
          <div className="bg-white/20 p-6 rounded-2xl border-2 border-black/10 shadow-lg">
            <div className="text-4xl mb-3">🚚</div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-1">Envío Gratis</h4>
            <p className="text-black/80 text-sm font-medium">A la puerta de tu casa a nivel nacional.</p>
          </div>
          <div className="bg-white/20 p-6 rounded-2xl">
            <div className="text-4xl mb-3">🤝</div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-1">Contra Entrega</h4>
            <p className="text-black/80 text-sm font-medium">Paga en efectivo al recibir tu pedido.</p>
          </div>
        </div>
      </section>

      {/* =========================================
          5. OFERTA Y CHECKOUT
      ========================================= */}
      <section id="comprar" className="py-20 px-6 md:px-16 bg-black scroll-mt-10 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-red-500 bg-red-500/10 border border-red-500 px-4 py-2 rounded-full text-xs font-black tracking-widest mb-6 inline-block">
              🚨 INVENTARIO ARTESANAL LIMITADO
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Elige tu paquete
            </h2>
          </div>

          {/* Opciones */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => setPackageSelection('paquete1')}
              className={`text-left border-2 p-6 rounded-xl transition-all ${
                packageSelection === 'paquete1' ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-[#D4AF37] font-black text-xs mb-2 uppercase">COLECCIÓN 1</div>
              <div className="text-white font-bold mb-4">Devoción y Tradición</div>
              <div className="text-3xl text-white font-bold mb-1">$30.000</div>
              <div className="text-gray-400 text-xs font-bold uppercase">4 Faroles • Envío Gratis</div>
            </button>

            <button
              onClick={() => setPackageSelection('paquete2')}
              className={`text-left border-2 p-6 rounded-xl transition-all ${
                packageSelection === 'paquete2' ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-[#D4AF37] font-black text-xs mb-2 uppercase">COLECCIÓN 2</div>
              <div className="text-white font-bold mb-4">Fe y Esperanza</div>
              <div className="text-3xl text-white font-bold mb-1">$30.000</div>
              <div className="text-gray-400 text-xs font-bold uppercase">4 Faroles • Envío Gratis</div>
            </button>

            <button
              onClick={() => setPackageSelection('ambos')}
              className={`text-left border-2 p-6 rounded-xl transition-all relative ${
                packageSelection === 'ambos' ? 'border-[#D4AF37] bg-[#D4AF37]/20 scale-[1.05] shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'border-[#D4AF37]/50 hover:border-[#D4AF37]'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
              <div className="text-[#D4AF37] font-black text-xs mb-2 uppercase">COLECCIÓN COMPLETA</div>
              <div className="text-[#D4AF37] font-bold mb-4">¡Ahorras $4.000!</div>
              <div className="text-4xl text-[#D4AF37] font-black mb-1">$56.000</div>
              <div className="text-white text-xs font-bold uppercase">8 Faroles • Envío Gratis</div>
            </button>
          </div>

          {/* Pagos */}
          <div className="space-y-4 mb-12">
            <h3 className="text-xl text-white font-bold text-center">Forma de pago</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex flex-col text-left p-5 rounded-xl border-2 transition-all ${
                    paymentMethod === opt.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-sm font-bold text-white uppercase">{opt.title}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.id ? 'border-[#D4AF37]' : 'border-gray-500'}`}>
                      {paymentMethod === opt.id && <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 mb-1">{opt.desc}</span>
                  <span className="text-xs text-[#D4AF37] font-bold">{opt.extra}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="bg-[#0a0a0a] border-2 border-white/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-gray-400 text-sm font-bold uppercase mb-2">Total a Pagar</div>
              <div className="text-4xl md:text-5xl text-[#D4AF37] font-black">
                ${paymentMethod === 'separe' ? '2.000' : finalPrice.toLocaleString('es-CO')}
              </div>
              {paymentMethod === 'contraentrega' && <div className="text-xs text-gray-400 mt-2">Incluye +5% recargo de transportadora</div>}
              {paymentMethod === 'separe' && <div className="text-xs text-gray-400 mt-2">Abono inicial. Saldo: ${(finalPrice - 2000).toLocaleString('es-CO')}</div>}
            </div>

            <button 
              onClick={handleWhatsApp}
              className="w-full md:w-auto bg-[#D4AF37] text-black px-10 py-5 rounded-full font-black text-lg uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 hover:bg-white flex items-center justify-center gap-3"
            >
              <span>Generar Pedido Aquí</span>
              <span className="text-2xl">👉</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================
          6. VIDEOS DE USO (MOVIDOS AL FINAL)
      ========================================= */}
      <section className="py-20 px-6 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-white font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Armado en Segundos
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-black border border-white/20 rounded-2xl p-4">
              <h4 className="text-lg text-[#D4AF37] font-bold text-center mb-4">1. Desplegar</h4>
              <div className="rounded-xl overflow-hidden aspect-[9/16] relative bg-black">
                <video src="/distribuidores/media/como_armar.mp4" controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
            <div className="bg-black border border-white/20 rounded-2xl p-4">
              <h4 className="text-lg text-[#D4AF37] font-bold text-center mb-4">2. Poner la vela</h4>
              <div className="rounded-xl overflow-hidden aspect-[9/16] relative bg-black">
                <video src="/distribuidores/media/poner_vela.mp4" controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          7. FAQ
      ========================================= */}
      <section className="py-16 px-6 md:px-16 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl text-white font-serif text-center mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {[
              { q: "¿Tengo que armarlos con pegante?", a: "No. Vienen pre-doblados. Se arman en 10 segundos encajando las pestañas (ver video arriba)." },
              { q: "¿Sirven con velas de cera normales?", a: "Sí, el espacio interior es seguro. También puedes usar luz LED." },
              { q: "¿Cuánto tarda el envío?", a: "2 a 5 días hábiles a nivel nacional." }
            ].map((faq, index) => (
              <div key={index} className="border-2 border-white/20 rounded-xl bg-[#0a0a0a]">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <span className="font-bold text-white">{faq.q}</span>
                  <span className="text-[#D4AF37] font-bold">{openFaq === index ? '-' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-300 text-sm">
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
