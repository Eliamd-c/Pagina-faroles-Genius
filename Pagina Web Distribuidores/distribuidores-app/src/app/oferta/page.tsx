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
    desc: 'Transfiere por Bancolombia, Nequi o Daviplata. Confirmas tu pedido de inmediato y aseguramos el stock.',
    extra: 'Despacho prioritario hoy.'
  },
  {
    id: 'contraentrega',
    num: '02',
    title: 'Pago Contra Entrega',
    desc: 'Pagas en efectivo al mensajero cuando recibas los faroles en la puerta de tu casa. Cero riesgos.',
    extra: '+5% recargo de transportadora.'
  },
  {
    id: 'separe',
    num: '03',
    title: 'Plan Separe',
    desc: 'Reserva hoy con solo $2.000 y paga el resto poco a poco antes del envío. Asegura tu colección.',
    extra: 'Congela el precio.'
  }
];

export default function OfertaPage() {
  const [packageSelection, setPackageSelection] = useState<PackageSelection>('ambos');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('anticipado');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', cedula: '', celular: '', direccion: '', ciudad: '', correo: ''
  });
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const basePrice = packageSelection === 'ambos' ? 56000 : 30000;
  const finalPrice = paymentMethod === 'contraentrega' ? Math.round(basePrice * 1.05) : basePrice;

  const handleCheckout = () => {
    setShowForm(true);
  };

  const submitFormToWhatsApp = () => {
    const phoneNumber = "573133288298";
    const packageDesc = packageSelection === 'ambos' 
      ? "Colección Completa (8 Faroles)" 
      : packageSelection === 'paquete1' ? "Paquete 1: Devoción y Tradición (4 Faroles)" : "Paquete 2: Fe y Esperanza (4 Faroles)";
      
    let message = `¡Hola! Quiero asegurar mi pedido de *${packageDesc}*.\n\n`;

    if (paymentMethod === 'separe') {
      message += `💰 *Modalidad:* Plan Separe\n`;
      message += `💰 *Abono inicial:* $2,000\n`;
      message += `💰 *Saldo restante al recibir:* $${(finalPrice - 2000).toLocaleString('es-CO')}\n`;
    } else if (paymentMethod === 'contraentrega') {
      message += `🚚 *Modalidad:* Pago Contra Entrega (+5%)\n`;
      message += `💰 *Subtotal:* $${basePrice.toLocaleString('es-CO')}\n`;
      message += `💰 *Total a pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    } else {
      message += `💳 *Modalidad:* Pago Anticipado\n`;
      message += `💰 *Total a pagar:* $${finalPrice.toLocaleString('es-CO')}\n`;
    }

    message += `\n*Mis datos para el envío son:*\n`;
    message += `- Nombre: ${formData.nombre}\n`;
    message += `- Cédula: ${formData.cedula}\n`;
    message += `- Celular: ${formData.celular}\n`;
    message += `- Dirección: ${formData.direccion}\n`;
    message += `- Ciudad: ${formData.ciudad}\n`;
    message += `- Correo: ${formData.correo}\n`;

    if (paymentMethod === 'anticipado') {
      message += `\n*Nota:* Ya tengo el comprobante de pago, te lo envío en este chat.`;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    setShowForm(false);
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
          2. MATERIALES Y DIMENSIONES
      ========================================= */}
      <section className="py-16 md:py-24 px-6 md:px-16 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl text-white font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Diseñados para <span className="text-[#D4AF37] italic">destacar</span>
          </h2>
          <p className="text-gray-400 mb-12 text-sm md:text-base">El tamaño perfecto para que tu hogar brille con luz propia en la Noche de Velitas.</p>
          
          <div className="relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%] bg-[#D4AF37] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
            <img 
              src="/distribuidores/media/medidas_correctas.png" 
              alt="Dimensiones y Materiales de los Faroles" 
              className="relative z-10 w-full max-w-[350px] md:max-w-[450px] h-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>
      </section>

      {/* =========================================
          3. COLECCIÓN (PALETA CLARA / TEAL)
      ========================================= */}
      <section className="py-24 px-6 md:px-16 bg-[#FDFBF7]">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center md:text-left mb-16 relative">
            <h2 className="text-6xl md:text-8xl text-[#D4AF37] font-normal leading-[0.7] mb-2" style={{ fontFamily: 'var(--font-great-vibes)' }}>
              Ocho
            </h2>
            <h3 className="text-4xl md:text-5xl text-[#173032] font-serif mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              advocaciones
            </h3>
            <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto md:mx-0 mb-6"></div>
            <p className="text-[#173032]/80 max-w-xl mx-auto md:mx-0 text-sm md:text-base font-medium leading-relaxed">
              Dos colecciones de cuatro faroles cada una. Puedes pedir el surtido que más se venda en tu región o llevar ambas para tu hogar.
            </p>
          </div>

          <div className="space-y-20">
            {PACKAGES.map((pkg, pIdx) => (
              <div key={pIdx}>
                {/* Cabecera del Paquete */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                  <span className="bg-[#173032] text-white px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase">
                    {pkg.num}
                  </span>
                  <span className="text-xl md:text-2xl text-[#173032] font-serif font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {pkg.subtitle}
                  </span>
                  <div className="hidden md:block h-[2px] bg-[#D4AF37]/60 flex-1 ml-4" />
                </div>
                
                {/* Grid de Productos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {pkg.items.map((m, i) => (
                    <div key={i} className="text-center group">
                      <div className="border border-[#173032]/10 rounded-2xl p-2 mb-4 flex items-center justify-center bg-white overflow-hidden aspect-[3/4] shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(23,48,50,0.15)] group-hover:border-[#D4AF37]/50">
                        <img 
                          src={`/distribuidores/media/${encodeURIComponent(m.img)}`} 
                          alt={m.name.replace('\n', ' ')} 
                          className="w-full h-full object-cover rounded-xl" 
                        />
                      </div>
                      <p className="text-[#173032] font-bold whitespace-pre-line leading-tight text-sm md:text-base" style={{ fontFamily: 'var(--font-playfair)' }}>
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
            {/* Paquete 1 */}
            <button
              onClick={() => setPackageSelection('paquete1')}
              className={`text-left border-2 p-5 rounded-xl transition-all flex items-center justify-between overflow-hidden relative ${
                packageSelection === 'paquete1' ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="relative z-10 w-[55%]">
                <div className="text-[#D4AF37] font-black text-[10px] md:text-xs mb-2 uppercase">COLECCIÓN 1</div>
                <div className="text-white font-bold text-sm md:text-base mb-4 leading-tight">Devoción y Tradición</div>
                <div className="text-2xl md:text-3xl text-white font-bold mb-1">$30.000</div>
                <div className="text-gray-400 text-[9px] md:text-xs font-bold uppercase">4 Faroles • Envío Gratis</div>
              </div>
              <div className="w-[45%] h-full flex items-center justify-end relative z-0">
                <img src="/distribuidores/media/paquete1-alpha.png" alt="Paquete 1" className="w-full max-h-32 object-contain object-right scale-[1.3] md:scale-110 origin-right drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
              </div>
            </button>

            {/* Paquete 2 */}
            <button
              onClick={() => setPackageSelection('paquete2')}
              className={`text-left border-2 p-5 rounded-xl transition-all flex items-center justify-between overflow-hidden relative ${
                packageSelection === 'paquete2' ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="relative z-10 w-[55%]">
                <div className="text-[#D4AF37] font-black text-[10px] md:text-xs mb-2 uppercase">COLECCIÓN 2</div>
                <div className="text-white font-bold text-sm md:text-base mb-4 leading-tight">Fe y Esperanza</div>
                <div className="text-2xl md:text-3xl text-white font-bold mb-1">$30.000</div>
                <div className="text-gray-400 text-[9px] md:text-xs font-bold uppercase">4 Faroles • Envío Gratis</div>
              </div>
              <div className="w-[45%] h-full flex items-center justify-end relative z-0">
                <img src="/distribuidores/media/paquete2-alpha.png" alt="Paquete 2" className="w-full max-h-32 object-contain object-right scale-[1.3] md:scale-110 origin-right drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
              </div>
            </button>

            {/* Ambos */}
            <button
              onClick={() => setPackageSelection('ambos')}
              className={`text-left border-2 p-5 rounded-xl transition-all flex items-center justify-between overflow-hidden relative ${
                packageSelection === 'ambos' ? 'border-[#D4AF37] bg-[#D4AF37]/20 scale-[1.05] shadow-[0_0_25px_rgba(212,175,55,0.3)]' : 'border-[#D4AF37]/50 hover:border-[#D4AF37]'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] md:text-xs font-black px-4 py-1.5 rounded-bl-xl z-20">RECOMENDADO</div>
              
              <div className="relative z-10 flex-1 pt-2">
                <div className="text-[#D4AF37] font-black text-[10px] md:text-xs mb-2 uppercase">COLECCIÓN COMPLETA</div>
                <div className="text-[#D4AF37] font-bold text-sm md:text-base mb-2 leading-tight">¡Ahorras $4.000!</div>
                <div className="text-3xl md:text-4xl text-[#D4AF37] font-black mb-1">$56.000</div>
                <div className="text-white text-[9px] md:text-xs font-bold uppercase">8 Faroles • Envío Gratis</div>
              </div>
              
              <div className="w-24 h-24 relative z-0 flex flex-col items-center justify-center shrink-0 gap-1.5">
                <img src="/distribuidores/media/paquete1-alpha.png" alt="Paquete 1" className="w-full h-1/2 object-contain object-center scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
                <img src="/distribuidores/media/paquete2-alpha.png" alt="Paquete 2" className="w-full h-1/2 object-contain object-center scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
              </div>
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
              onClick={handleCheckout}
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
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/50 rounded-2xl w-full max-w-lg p-6 relative my-8 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            
            <h3 className="text-xl md:text-2xl text-[#D4AF37] font-serif mb-6 text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
              Completa tu Pedido
            </h3>
            
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Nombre completo" className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Cédula" className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
                <input type="tel" placeholder="Celular" className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" value={formData.celular} onChange={e => setFormData({...formData, celular: e.target.value})} />
              </div>
              
              <input type="text" placeholder="Dirección completa (Ej: Cra 4 # 10-20)" className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Ciudad / Municipio" className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} />
                <input type="email" placeholder="Correo electrónico" className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
              </div>
            </div>

            {paymentMethod === 'anticipado' && (
              <div className="mb-6 bg-[#111] p-4 rounded-xl border border-[#D4AF37]/30">
                <h4 className="text-[#D4AF37] font-bold mb-3 text-sm uppercase tracking-wider text-center">💳 Datos Bancarios</h4>
                
                <div className="flex justify-between items-center bg-black p-3 rounded-lg mb-2 border border-white/10">
                  <div>
                    <p className="text-xs text-gray-400">Nequi / Daviplata</p>
                    <p className="text-white font-mono text-sm tracking-wider">313 328 8298</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText('3133288298')} className="text-[#D4AF37] text-xs font-bold px-4 py-1.5 border border-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">Copiar</button>
                </div>

                <div className="flex justify-between items-center bg-black p-3 rounded-lg mb-4 border border-white/10">
                  <div>
                    <p className="text-xs text-gray-400">Bancolombia (Ahorros)</p>
                    <p className="text-white font-mono text-sm tracking-wider">411-613736-71</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText('41161373671')} className="text-[#D4AF37] text-xs font-bold px-4 py-1.5 border border-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">Copiar</button>
                </div>

                <div className="border-2 border-dashed border-[#D4AF37]/50 rounded-lg p-4 text-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden group">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setReceiptImage(e.target.files ? e.target.files[0].name : null)} />
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📸</span>
                  <p className="text-sm text-gray-200 font-bold">{receiptImage ? '✅ Comprobante cargado' : 'Toca para adjuntar tu comprobante'}</p>
                  <p className="text-xs text-[#D4AF37] mt-1">{receiptImage ? receiptImage : 'Obligatorio para pago anticipado'}</p>
                </div>
              </div>
            )}

            <button onClick={submitFormToWhatsApp} className="w-full bg-[#D4AF37] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              Enviar por WhatsApp
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Al enviar, se abrirá WhatsApp con los detalles de tu pedido para coordinar la entrega de forma segura.
              {paymentMethod === 'anticipado' && " Recuerda enviar la foto de tu comprobante en el chat."}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
