import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'stores_geocoded.json');

function readStores() {
  const raw = readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeStores(data: any[]) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: Retorna todas las tiendas
export async function GET() {
  try {
    const stores = readStores();
    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json({ error: 'Error leyendo datos' }, { status: 500 });
  }
}

// POST: Actualiza una tienda (hidden toggle) o agrega nueva
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, store } = body;
    let stores = readStores();

    if (action === 'toggle_hidden') {
      stores = stores.map((s: any, idx: number) =>
        idx === id ? { ...s, hidden: !s.hidden } : s
      );
    } else if (action === 'update') {
      stores = stores.map((s: any, idx: number) =>
        idx === id ? { ...s, ...store } : s
      );
    } else if (action === 'delete') {
      stores = stores.filter((_: any, idx: number) => idx !== id);
    } else if (action === 'add') {
      stores.push({
        name: store.name,
        address: store.address || '',
        city: store.city || '',
        phone: store.phone || '',
        total_purchased: 0,
        lat: store.lat || null,
        lng: store.lng || null,
        department: store.department || 'Desconocido',
        municipality: store.municipality || 'Desconocido',
        hidden: false
      });
    }

    writeStores(stores);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error actualizando datos' }, { status: 500 });
  }
}
