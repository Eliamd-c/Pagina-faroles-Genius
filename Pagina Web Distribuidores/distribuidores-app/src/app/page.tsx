"use client";

import { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Circle } from '@react-google-maps/api';
import storesData from '@/data/stores_geocoded.json';
import ColombiaMap from '@/components/ColombiaMap';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const centerColombia = {
  lat: 4.5709,
  lng: -74.2973
};

const getObfuscatedData = () => {
  return storesData.map(store => {
    if (store.lat && store.lng) {
      const jitterLat = (Math.random() - 0.5) * 0.01;
      const jitterLng = (Math.random() - 0.5) * 0.01;
      return {
        ...store,
        obfuscatedLat: store.lat + jitterLat,
        obfuscatedLng: store.lng + jitterLng
      };
    }
    return store;
  });
};

export default function Home() {
  const [stores, setStores] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [searchText, setSearchText] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(centerColombia);
  const [zoom, setZoom] = useState(6);
  const [viewMode, setViewMode] = useState<'national' | 'department' | 'google'>('national');

  useEffect(() => {
    setStores(getObfuscatedData());
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(storesData.map(s => s.department).filter(d => d && d !== 'Desconocido'));
    return Array.from(depts).sort();
  }, []);

  const availableMunicipalities = useMemo(() => {
    let filtered = storesData;
    if (selectedDepartment) {
      filtered = filtered.filter(s => s.department === selectedDepartment);
    }
    const munis = new Set(filtered.map(s => s.municipality).filter(m => m && m !== 'Desconocido'));
    return Array.from(munis).sort();
  }, [selectedDepartment]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      // Ocultar tiendas marcadas como hidden
      if (store.hidden) return false;
      if (selectedDepartment && store.department !== selectedDepartment) return false;
      if (selectedMunicipality && store.municipality !== selectedMunicipality) return false;
      // Filtrar por texto de búsqueda
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = store.name?.toLowerCase().includes(q);
        const matchPhone = store.phone?.toLowerCase().includes(q);
        const matchMuni = store.municipality?.toLowerCase().includes(q);
        const matchDept = store.department?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchMuni && !matchDept) return false;
      }
      return true;
    });
  }, [stores, selectedDepartment, selectedMunicipality, searchText]);


  // Si cambia de departamento a través del select izquierdo o el mapa
  useEffect(() => {
    setSelectedMunicipality('');
    if (selectedDepartment) {
      if (viewMode === 'national') setViewMode('department');
    } else {
      setViewMode('national');
      setMapCenter(centerColombia);
      setZoom(6);
      setActiveMarker(null);
    }
  }, [selectedDepartment]);

  // Si cambia el municipio (nivel google maps)
  useEffect(() => {
    if (selectedMunicipality) {
      setViewMode('google');
      if (filteredStores.length > 0) {
        const firstValid = filteredStores.find(s => s.obfuscatedLat && s.obfuscatedLng);
        if (firstValid) {
          setMapCenter({ lat: firstValid.obfuscatedLat, lng: firstValid.obfuscatedLng });
          setZoom(13);
        }
      }
    }
  }, [selectedMunicipality, filteredStores]);

  const handleFindNearest = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let nearest = null;
          let minDistance = Infinity;

          filteredStores.forEach(store => {
            if (store.obfuscatedLat && store.obfuscatedLng) {
              const dist = Math.sqrt(
                Math.pow(store.obfuscatedLat - userLat, 2) + Math.pow(store.obfuscatedLng - userLng, 2)
              );
              if (dist < minDistance) {
                minDistance = dist;
                nearest = store;
              }
            }
          });

          if (nearest) {
            setSelectedDepartment(nearest.department !== 'Desconocido' ? nearest.department : '');
            setSelectedMunicipality(nearest.municipality !== 'Desconocido' ? nearest.municipality : '');
            
            setMapCenter({ lat: nearest.obfuscatedLat, lng: nearest.obfuscatedLng });
            setZoom(13);
            setActiveMarker(nearest);
            setViewMode('google');
          } else {
            alert("No se encontraron distribuidores cercanos.");
          }
        },
        error => {
          alert("Error obteniendo tu ubicación. Asegúrate de darle permisos al navegador.");
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador.");
    }
  };

  const handleDepartmentClick = (deptName: string) => {
    setSelectedDepartment(deptName);
  };

  const handleMunicipalityClick = (muniName: string) => {
    setSelectedMunicipality(muniName);
  };

  const goBack = () => {
    if (viewMode === 'google') {
      setViewMode('department');
      setSelectedMunicipality('');
    } else if (viewMode === 'department') {
      setViewMode('national');
      setSelectedDepartment('');
      setSelectedMunicipality('');
    }
  };

  return (
    <main className="flex h-screen flex-col md:flex-row bg-[#FAF8FC]">
      {/* Sidebar para filtros y lista */}
      <aside className="w-full md:w-1/3 p-6 bg-white border-r border-[#E5E7EB] overflow-y-auto flex flex-col gap-5 shadow-2xl z-10 relative">
        <div className="flex flex-col items-center gap-2 mb-2">
          {/* Logo */}
          <img src="/logo.png" alt="Genius Farole Logo" className="w-48 h-auto object-contain drop-shadow-md" />
          
          <h1 className="text-4xl font-bold text-[#7A3089] tracking-tight mt-2" style={{fontFamily: 'var(--font-playfair)'}}>
            Genius <span className="text-[#DB0462] font-normal" style={{fontFamily: 'var(--font-great-vibes)', fontSize: '1.4em', marginLeft: '-5px'}}>Farole</span>
          </h1>
          <p className="text-sm text-[#3C3C3B] font-medium opacity-80 mt-1">Encuentra faroles y distribuidores en tu zona.</p>
        </div>

        {/* Buscador de texto */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A3089] font-bold text-base select-none">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              // Si hay texto, ir directamente al mapa de Google para ver resultados
              if (e.target.value.trim() && viewMode === 'national') setViewMode('google');
              if (!e.target.value.trim() && !selectedDepartment) setViewMode('national');
            }}
            className="w-full pl-9 pr-4 py-3 border-2 border-[#7A3089]/20 focus:border-[#7A3089] rounded-xl focus:outline-none text-sm text-[#3C3C3B] bg-white shadow-sm transition-all"
          />
          {searchText && (
            <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3C3C3B]/40 hover:text-[#DB0462] font-bold text-lg leading-none">
              ×
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 bg-[#7A3089]/5 p-5 rounded-2xl border border-[#7A3089]/10 shadow-inner">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#7A3089] uppercase tracking-wider">Departamento</label>
            <select 
              className="p-3 bg-white border border-[#27B1B5]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B1B5] text-sm text-[#3C3C3B] shadow-sm transition-all"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Todos los departamentos</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#7A3089] uppercase tracking-wider">Municipio</label>
            <select 
              className="p-3 bg-white border border-[#27B1B5]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B1B5] text-sm text-[#3C3C3B] shadow-sm transition-all disabled:opacity-50 disabled:bg-gray-100"
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              disabled={availableMunicipalities.length === 0}
            >
              <option value="">Todos los municipios</option>
              {availableMunicipalities.map(muni => (
                <option key={muni} value={muni}>{muni}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleFindNearest}
          className="bg-[#DB0462] hover:bg-[#A9034A] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <span className="text-[#EED332]">📍</span> Buscar cerca de mí
        </button>

        <div className="flex-1 overflow-y-auto pt-4 mt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#3C3C3B] uppercase tracking-wider flex items-center gap-2 opacity-70">
              <span className="w-2 h-2 rounded-full bg-[#EED332]"></span>
              Resultados ({filteredStores.length})
            </h2>
            <a href="/admin" className="text-xs font-bold text-[#7A3089]/60 hover:text-[#7A3089] underline underline-offset-2 transition-colors flex items-center gap-1">
              ⚙️ Admin
            </a>
          </div>
          <ul className="flex flex-col gap-3 pb-6">
            {filteredStores.map((store, idx) => (
              <li 
                key={idx} 
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  activeMarker === store 
                    ? 'border-[#7A3089] bg-[#7A3089]/5 shadow-md scale-[1.02]' 
                    : 'border-transparent bg-white shadow-sm hover:border-[#27B1B5]/50 hover:shadow-md'
                }`}
                onClick={() => {
                  if (store.obfuscatedLat && store.obfuscatedLng) {
                    setMapCenter({ lat: store.obfuscatedLat, lng: store.obfuscatedLng });
                    setZoom(13);
                    setActiveMarker(store);
                    setViewMode('google');
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#3C3C3B] text-base leading-tight">{store.name}</h3>
                  {activeMarker === store && (
                    <span className="bg-[#EED332] text-[#3C3C3B] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Viendo
                    </span>
                  )}
                </div>
                
                <div className="mt-3 flex flex-col gap-1.5">
                  <p className="text-sm text-[#3C3C3B]/80 flex items-center gap-2 font-medium">
                    <span className="text-[#DB0462]">📍</span> 
                    {store.municipality !== 'Desconocido' ? store.municipality : store.city}, {store.department !== 'Desconocido' ? store.department : ''}
                  </p>
                  {store.phone && (
                    <p className="text-sm font-bold text-[#7A3089] flex items-center gap-2">
                      <span className="text-[#DB0462]">📞</span> {store.phone}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mapa Principal */}
      <section className="flex-1 bg-[#F3F4F6] relative overflow-hidden flex flex-col">
        {viewMode !== 'national' && (
          <button 
            onClick={goBack}
            className="absolute top-6 left-6 z-20 bg-white hover:bg-gray-50 text-[#7A3089] font-bold py-3 px-5 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border-b-4 border-[#7A3089] group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver atrás
          </button>
        )}

        {(viewMode === 'national' || viewMode === 'department') ? (
          <ColombiaMap 
            storesData={stores} 
            viewLevel={viewMode}
            selectedDepartmentName={selectedDepartment}
            onSelectDepartment={handleDepartmentClick} 
            onSelectMunicipality={handleMunicipalityClick}
          />
        ) : (
          !isLoaded ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-[#7A3089] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#7A3089] font-bold tracking-wide">Cargando Calles...</p>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={zoom}
              options={{ 
                streetViewControl: false, 
                mapTypeControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
              onClick={() => setActiveMarker(null)}
            >
              {filteredStores.map((store, idx) => {
                if (!store.obfuscatedLat || !store.obfuscatedLng) return null;
                return (
                  <Circle
                    key={idx}
                    center={{ lat: store.obfuscatedLat, lng: store.obfuscatedLng }}
                    radius={600}
                    options={{
                      strokeColor: "#7A3089",     // Brand Purple
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#DB0462",       // Brand Magenta
                      fillOpacity: 0.4,
                      clickable: true
                    }}
                    onClick={() => setActiveMarker(store)}
                  />
                );
              })}

              {activeMarker && activeMarker.obfuscatedLat && (
                <InfoWindow
                  position={{ lat: activeMarker.obfuscatedLat, lng: activeMarker.obfuscatedLng }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-4 max-w-[280px] bg-white text-[#3C3C3B] rounded-xl border-t-4 border-[#7A3089] shadow-xl">
                    <h3 className="font-extrabold text-xl text-[#7A3089] mb-2 leading-tight">{activeMarker.name}</h3>
                    <div className="bg-[#27B1B5]/10 p-3 rounded-lg mb-3">
                      <p className="text-sm text-[#3C3C3B] font-medium flex items-center gap-2">
                        📍 {activeMarker.municipality !== 'Desconocido' ? activeMarker.municipality : activeMarker.city}, {activeMarker.department !== 'Desconocido' ? activeMarker.department : ''}
                      </p>
                    </div>
                    {activeMarker.phone && (
                      <a href={`tel:${activeMarker.phone}`} className="w-full flex items-center justify-center gap-2 bg-[#27B1B5] hover:bg-[#1C8A8D] text-white py-2.5 rounded-lg text-sm font-bold transition-colors">
                        📞 Llamar al {activeMarker.phone}
                      </a>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )
        )}
      </section>
    </main>
  );
}
