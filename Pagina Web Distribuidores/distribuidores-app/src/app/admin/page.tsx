"use client";

import { useState, useEffect } from 'react';

interface Store {
  name: string;
  address: string;
  city: string;
  phone: string;
  department: string;
  municipality: string;
  total_purchased: number;
  hidden?: boolean;
  lat?: number;
  lng?: number;
}

const emptyForm: Omit<Store, 'total_purchased'> = {
  name: '',
  address: '',
  city: '',
  phone: '',
  department: '',
  municipality: '',
};

const FIELDS = [
  { label: 'Nombre *', key: 'name', placeholder: 'Nombre del distribuidor' },
  { label: 'Teléfono', key: 'phone', placeholder: 'Ej: 3001234567' },
  { label: 'Departamento', key: 'department', placeholder: 'Ej: Antioquia' },
  { label: 'Municipio', key: 'municipality', placeholder: 'Ej: Medellín' },
  { label: 'Ciudad/Barrio', key: 'city', placeholder: 'Ej: Medellín, Laureles' },
  { label: 'Dirección', key: 'address', placeholder: 'Ej: Cra 70 #44-55' },
];

export default function AdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  // Estado de edición: guarda el índice real del store en edición y una copia editable
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Store>>({});

  const fetchStores = async () => {
    setLoading(true);
    const res = await fetch('/api/stores');
    const data = await res.json();
    setStores(data);
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleToggle = async (idx: number) => {
    setSaving(true);
    await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_hidden', id: idx }),
    });
    await fetchStores();
    setSaving(false);
    showFeedback('✅ Estado actualizado correctamente.');
  };

  const handleDelete = async (idx: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este punto de venta? Esta acción no se puede deshacer.')) return;
    setSaving(true);
    await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: idx }),
    });
    setEditingIdx(null);
    await fetchStores();
    setSaving(false);
    showFeedback('🗑️ Punto de venta eliminado.');
  };

  const startEdit = (realIdx: number) => {
    setEditingIdx(realIdx);
    setEditForm({ ...stores[realIdx] });
  };

  const cancelEdit = () => {
    setEditingIdx(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    if (!editForm.name?.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }
    setSaving(true);
    await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id: editingIdx, store: editForm }),
    });
    setEditingIdx(null);
    setEditForm({});
    await fetchStores();
    setSaving(false);
    showFeedback('✏️ Punto de venta actualizado correctamente.');
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { alert('El nombre del distribuidor es obligatorio.'); return; }
    setSaving(true);
    await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', store: form }),
    });
    setForm(emptyForm);
    setShowForm(false);
    await fetchStores();
    setSaving(false);
    showFeedback('🎉 Nuevo punto de venta agregado.');
  };

  const filtered = stores.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.municipality?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const visible = stores.filter(s => !s.hidden).length;
  const hidden = stores.filter(s => s.hidden).length;

  return (
    <main className="min-h-screen bg-[#FAF8FC] p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Genius Farole" className="h-16 object-contain" />
          <div>
            <h1 className="text-3xl font-extrabold text-[#7A3089]">Panel de Administración</h1>
            <p className="text-sm text-[#3C3C3B]/70 font-medium">Gestión de Puntos de Venta · Genius Farole</p>
          </div>
        </div>
        <a href="/" className="bg-[#3C3C3B] hover:bg-black text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow">
          ← Volver al Directorio
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-[#7A3089] text-center">
          <p className="text-4xl font-black text-[#7A3089]">{stores.length}</p>
          <p className="text-xs font-bold text-[#3C3C3B]/60 uppercase mt-1">Total Puntos</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-[#27B1B5] text-center">
          <p className="text-4xl font-black text-[#27B1B5]">{visible}</p>
          <p className="text-xs font-bold text-[#3C3C3B]/60 uppercase mt-1">Visibles</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-[#DB0462] text-center">
          <p className="text-4xl font-black text-[#DB0462]">{hidden}</p>
          <p className="text-xs font-bold text-[#3C3C3B]/60 uppercase mt-1">Ocultos</p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mb-4 bg-[#7A3089]/10 border border-[#7A3089]/20 text-[#7A3089] font-bold px-5 py-3 rounded-xl text-sm">
          {feedback}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, municipio, departamento o teléfono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 p-3 border border-[#7A3089]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A3089] text-sm shadow-sm bg-white"
        />
        <button
          onClick={() => { setShowForm(!showForm); cancelEdit(); }}
          className="bg-[#DB0462] hover:bg-[#A9034A] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow flex items-center gap-2"
        >
          {showForm ? '✕ Cancelar' : '+ Agregar Nuevo'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border-2 border-[#7A3089]/20 rounded-2xl p-6 mb-6 shadow-md">
          <h2 className="text-xl font-extrabold text-[#7A3089] mb-4">Nuevo Punto de Venta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map(field => (
              <div key={field.key}>
                <label className="text-xs font-bold text-[#7A3089] uppercase tracking-wider mb-1 block">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={(form as any)[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full p-3 border border-[#7A3089]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A3089] text-sm bg-white"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-[#3C3C3B]/50 mt-3">* Las coordenadas del mapa se pueden asignar después desde el archivo JSON si se requiere ubicación exacta.</p>
          <button onClick={handleAdd} disabled={saving} className="mt-5 bg-[#7A3089] hover:bg-[#5C2367] text-white font-bold py-3 px-8 rounded-xl transition-all shadow disabled:opacity-50">
            {saving ? 'Guardando...' : '💾 Guardar Punto de Venta'}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#7A3089] text-white">
              <th className="text-left p-4 font-bold">#</th>
              <th className="text-left p-4 font-bold">Nombre</th>
              <th className="text-left p-4 font-bold hidden md:table-cell">Municipio</th>
              <th className="text-left p-4 font-bold hidden md:table-cell">Departamento</th>
              <th className="text-left p-4 font-bold hidden lg:table-cell">Teléfono</th>
              <th className="text-center p-4 font-bold">Estado</th>
              <th className="text-center p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-[#7A3089] font-bold">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-4 border-[#7A3089] border-t-transparent rounded-full animate-spin"></div>
                    Cargando distribuidores...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-[#3C3C3B]/50 font-medium">
                  No se encontraron resultados para "{search}"
                </td>
              </tr>
            ) : (
              filtered.map((store, idx) => {
                const realIdx = stores.indexOf(store);
                const isEditing = editingIdx === realIdx;

                return (
                  <>
                    {/* Fila normal */}
                    <tr
                      key={`row-${realIdx}`}
                      className={`border-t border-gray-100 transition-colors ${isEditing ? 'bg-[#7A3089]/5 border-l-4 border-l-[#7A3089]' : store.hidden ? 'bg-gray-50 opacity-60' : 'hover:bg-[#FAF8FC]'}`}
                    >
                      <td className="p-4 text-[#3C3C3B]/50 font-mono text-xs">{realIdx + 1}</td>
                      <td className="p-4 font-semibold text-[#3C3C3B]">{store.name}</td>
                      <td className="p-4 text-[#3C3C3B]/80 hidden md:table-cell">{store.municipality}</td>
                      <td className="p-4 text-[#3C3C3B]/80 hidden md:table-cell">{store.department}</td>
                      <td className="p-4 font-mono text-[#7A3089] hidden lg:table-cell">{store.phone}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${store.hidden ? 'bg-gray-200 text-gray-500' : 'bg-[#27B1B5]/15 text-[#27B1B5]'}`}>
                          {store.hidden ? 'Oculto' : 'Visible'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => isEditing ? cancelEdit() : startEdit(realIdx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditing ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-[#7A3089]/10 text-[#7A3089] hover:bg-[#7A3089]/20'}`}
                          >
                            {isEditing ? '✕ Cerrar' : '✏️ Editar'}
                          </button>
                          <button
                            onClick={() => handleToggle(realIdx)}
                            disabled={saving}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${store.hidden ? 'bg-[#27B1B5] text-white hover:bg-[#1C8A8D]' : 'bg-[#EED332] text-[#3C3C3B] hover:bg-[#D4B800]'}`}
                          >
                            {store.hidden ? '👁 Mostrar' : '🙈 Ocultar'}
                          </button>
                          <button
                            onClick={() => handleDelete(realIdx)}
                            disabled={saving}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all disabled:opacity-50"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Fila de edición expandida */}
                    {isEditing && (
                      <tr key={`edit-${realIdx}`} className="border-t-0">
                        <td colSpan={7} className="px-6 pb-6 pt-4 bg-[#7A3089]/5 border-l-4 border-l-[#7A3089]">
                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#7A3089]/10">
                            <h3 className="text-base font-extrabold text-[#7A3089] mb-4 flex items-center gap-2">
                              ✏️ Editando: <span className="text-[#DB0462]">{store.name}</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {FIELDS.map(field => (
                                <div key={field.key}>
                                  <label className="text-xs font-bold text-[#7A3089] uppercase tracking-wider mb-1 block">{field.label}</label>
                                  <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={(editForm as any)[field.key] || ''}
                                    onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                    className="w-full p-2.5 border border-[#7A3089]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A3089] text-sm bg-white"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 mt-5">
                              <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="bg-[#7A3089] hover:bg-[#5C2367] text-white font-bold py-2.5 px-7 rounded-xl transition-all shadow disabled:opacity-50 text-sm"
                              >
                                {saving ? 'Guardando...' : '💾 Guardar Cambios'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-100 hover:bg-gray-200 text-[#3C3C3B] font-bold py-2.5 px-5 rounded-xl transition-all text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-[#3C3C3B]/40 mt-6">
        Panel de Administración · Genius Farole · Los cambios se guardan directamente en la base de datos.
      </p>
    </main>
  );
}
