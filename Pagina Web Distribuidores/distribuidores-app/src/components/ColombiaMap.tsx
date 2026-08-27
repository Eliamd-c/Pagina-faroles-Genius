"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid, geoArea } from "d3-geo";
import * as topojson from "topojson-client";

const geoUrl = typeof window !== "undefined" && window.location.pathname.includes("/distribuidores")
  ? "/distribuidores/colombia_municipios.json"
  : "/colombia_municipios.json";

// Normalizador de nombres
const normalizeName = (name: string) => {
  if (!name) return "";
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  
  if (normalized.includes("bogota") || normalized.includes("cundinamarca")) return "bogota"; 
  if (normalized.includes("valle")) return "valle del cauca";
  if (normalized.includes("nari")) return "narino";
  if (normalized.includes("san andr")) return "san andres";
  if (normalized.includes("choco")) return "choco";
  
  return normalized;
};

interface ColombiaMapProps {
  storesData: any[];
  viewLevel: 'national' | 'department';
  selectedDepartmentName: string;
  onSelectDepartment: (dept: string) => void;
  onSelectMunicipality: (muni: string) => void;
}

export default function ColombiaMap({ storesData, viewLevel, selectedDepartmentName, onSelectDepartment, onSelectMunicipality }: ColombiaMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [deptCenter, setDeptCenter] = useState<[number, number]>([-74, 4.5]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [deptFeatures, setDeptFeatures] = useState<any[]>([]);
  const [muniFeatures, setMuniFeatures] = useState<any[]>([]);

  // Cargar y procesar TopoJSON
  useEffect(() => {
    fetch(geoUrl)
      .then(res => res.json())
      .then(topology => {
        const dptos = topojson.feature(topology, topology.objects.MGN_DPTO_POLITICO).features;
        const mpios = topojson.feature(topology, topology.objects.MGN_MPIO_POLITICO).features;
        setDeptFeatures(dptos);
        setMuniFeatures(mpios);
      })
      .catch(err => console.error("Error loading TopoJSON:", err));
  }, []);

  // Contar tiendas por departamento
  const activeDepartments = useMemo(() => {
    const counts: Record<string, number> = {};
    storesData.forEach(store => {
      if (!store.department || store.department === 'Desconocido') return;
      let key = normalizeName(store.department);
      if (store.department.includes('Bogot')) key = 'bogota';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [storesData]);

  // Contar tiendas por municipio en el departamento seleccionado
  const activeMunicipalities = useMemo(() => {
    if (viewLevel !== 'department' || !selectedDepartmentName) return {};
    const counts: Record<string, number> = {};
    const filteredStores = storesData.filter(s => normalizeName(s.department) === normalizeName(selectedDepartmentName));
    
    filteredStores.forEach(store => {
      if (!store.municipality || store.municipality === 'Desconocido') return;
      const key = normalizeName(store.municipality);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [storesData, viewLevel, selectedDepartmentName]);

  const mapCenter = viewLevel === 'national' ? [-74, 4.5] : deptCenter;
  const mapZoom = viewLevel === 'national' ? 1 : zoomLevel;

  if (deptFeatures.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#FAF8FC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#7A3089] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#7A3089] font-bold tracking-wide">Cargando Mapas Geográficos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[#FAF8FC]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2500,
          center: [-74, 4.5]
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={mapCenter as [number, number]} zoom={mapZoom} minZoom={1} maxZoom={15}>
          {viewLevel === 'national' && (
            <Geographies geography={deptFeatures}>
              {({ geographies }) => {
                return geographies.map((geo) => {
                  const geoName = geo.properties.DPTO_CNMBR || "";
                  const normalizedGeoName = normalizeName(geoName);
                  
                  let count = activeDepartments[normalizedGeoName] || 0;
                  let activeKey = normalizedGeoName;
                  
                  if (count === 0) {
                      const foundKey = Object.keys(activeDepartments).find(k => k.includes(normalizedGeoName) || normalizedGeoName.includes(k));
                      if (foundKey) {
                          count = activeDepartments[foundKey];
                          activeKey = foundKey;
                      }
                  }
                  
                  const isActive = count > 0;
                  const centroid = geoCentroid(geo);
                  
                  // Label formatting
                  let dName = geoName.charAt(0).toUpperCase() + geoName.slice(1).toLowerCase();
                  if(geoName.includes("NARI")) dName = "Nariño";
                  if(geoName.includes("CHOC")) dName = "Chocó";
                  if(geoName.includes("BOGOT")) dName = "Bogotá";
                  if(geoName.includes("ANDR")) dName = "San Andrés";
                  if(geoName.includes("CAQUET")) dName = "Caquetá";

                  // Ocultar nombres para departamentos muy pequeños donde el texto siempre se desborda feo
                  const isSmallDept = ["Quindío", "Risaralda", "Caldas", "Atlántico", "San Andrés"].includes(dName);

                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        onMouseEnter={() => {
                          if (isActive) setTooltipContent(`${dName}: ${count} distribuidor(es)`);
                        }}
                        onMouseLeave={() => setTooltipContent("")}
                        onClick={() => {
                          if (isActive) {
                            let originalName = storesData.find(s => normalizeName(s.department) === activeKey)?.department;
                            if (!originalName && activeKey === 'bogota') {
                                 originalName = storesData.find(s => s.department.includes('Bogot'))?.department;
                            }
                            
                            // Calcula el centroide para el zoom del departamento
                            setDeptCenter(centroid);
                            setZoomLevel(6); // Aumentar un poco el zoom por defecto para que se vea mejor el departamento
                            onSelectDepartment(originalName || dName);
                          }
                        }}
                        style={{
                          default: {
                            fill: isActive ? "#DB0462" : "#E5E7EB",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: isActive ? "pointer" : "default"
                          },
                          hover: {
                            fill: isActive ? "#7A3089" : "#E5E7EB",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: isActive ? "pointer" : "default"
                          },
                          pressed: {
                            fill: isActive ? "#EED332" : "#E5E7EB",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none"
                          }
                        }}
                      />
                      {isActive && !isSmallDept && (
                        <Marker coordinates={centroid}>
                          <text 
                            y="2" 
                            fontSize={6} 
                            textAnchor="middle" 
                            fill="#FFFFFF" 
                            fontWeight="bold" 
                            style={{ 
                              pointerEvents: 'none',
                              textShadow: '0px 0px 4px rgba(122, 48, 137, 0.8)' // Sombra morada para contraste
                            }}
                          >
                            {dName}
                          </text>
                        </Marker>
                      )}
                    </g>
                  );
                });
              }}
            </Geographies>
          )}

          {viewLevel === 'department' && (
            <Geographies geography={muniFeatures}>
              {({ geographies }) => {
                // Filtrar municipios del departamento seleccionado
                const deptMunis = geographies.filter(geo => {
                  const dptoName = normalizeName(geo.properties.DPTO_CNMBR || "");
                  const selectedName = normalizeName(selectedDepartmentName);
                  return dptoName === selectedName || dptoName.includes(selectedName) || selectedName.includes(dptoName);
                });

                return deptMunis.map((geo) => {
                  const geoName = geo.properties.MPIO_CNMBR || "";
                  const normalizedGeoName = normalizeName(geoName);
                  
                  let count = activeMunicipalities[normalizedGeoName] || 0;
                  let activeKey = normalizedGeoName;
                  
                  if (count === 0) {
                      const foundKey = Object.keys(activeMunicipalities).find(k => k.includes(normalizedGeoName) || normalizedGeoName.includes(k));
                      if (foundKey) {
                          count = activeMunicipalities[foundKey];
                          activeKey = foundKey;
                      }
                  }
                  
                  const isActive = count > 0;
                  let dName = geoName.charAt(0).toUpperCase() + geoName.slice(1).toLowerCase();
                  const centroid = geoCentroid(geo) as [number, number];
                  
                  const area = geoArea(geo) * 1000;
                  const baseSize = Math.min(Math.max(Math.sqrt(area) * 2.5, 0.4), 2.5);
                  const fontSize = isActive ? Math.max(baseSize * 1.5, 1.2) : baseSize;
                  const showLabel = isActive || area > 0.08;

                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        onMouseEnter={() => {
                          if (isActive) setTooltipContent(`${dName}: ${count} distribuidor(es)`);
                          else setTooltipContent(dName);
                        }}
                        onMouseLeave={() => setTooltipContent("")}
                        onClick={() => {
                          if (isActive) {
                            let originalName = storesData.find(s => normalizeName(s.municipality) === activeKey)?.municipality;
                            onSelectMunicipality(originalName || dName);
                          }
                        }}
                        style={{
                          default: {
                            fill: isActive ? "#DB0462" : "#F3F4F6",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.15,
                            outline: "none",
                            cursor: isActive ? "pointer" : "default"
                          },
                          hover: {
                            fill: isActive ? "#7A3089" : "#E2E8F0",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.25,
                            outline: "none",
                            cursor: isActive ? "pointer" : "default"
                          },
                          pressed: {
                            fill: isActive ? "#EED332" : "#E2E8F0",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.25,
                            outline: "none"
                          }
                        }}
                      />
                      {centroid && !isNaN(centroid[0]) && !isNaN(centroid[1]) && showLabel && (
                        <Marker coordinates={centroid}>
                          <text
                            y="0.8"
                            fontSize={fontSize}
                            textAnchor="middle"
                            fill={isActive ? "#FFFFFF" : "#374151"}
                            fontWeight={isActive ? "bold" : "600"}
                            style={{
                              pointerEvents: 'none',
                              letterSpacing: '0.1px',
                              textShadow: isActive
                                ? '0px 0px 3px rgba(122, 48, 137, 0.9), 0px 0px 6px rgba(0, 0, 0, 0.8)'
                                : '0px 0px 2px rgba(255, 255, 255, 0.95), 0px 0px 4px rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            {dName}
                          </text>
                        </Marker>
                      )}
                    </g>
                  );
                });
              }}
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[#3C3C3B] text-white px-5 py-2.5 rounded-full font-bold shadow-lg pointer-events-none transition-all z-20 text-sm flex items-center gap-2 border border-[#DB0462]/30">
          <span className="text-[#EED332]">📍</span> {tooltipContent}
        </div>
      )}
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl text-center border-t-4 border-[#DB0462] z-10 w-[300px]">
        <h2 className="text-[#7A3089] font-extrabold text-lg mb-1">
          {viewLevel === 'national' ? 'Nivel Nacional' : `Nivel Departamental`}
        </h2>
        <p className="text-xs text-[#3C3C3B]/80 font-medium">
          {viewLevel === 'national' 
            ? 'Toca los departamentos en magenta para ver sus municipios.' 
            : 'Toca los municipios en magenta para ver las tiendas en el mapa de calles.'}
        </p>
      </div>
    </div>
  );
}
