import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/profiles -> Listar todos los perfiles
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany();
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener perfiles' }, { status: 500 });
  }
}

// POST /api/profiles -> Crear un nuevo perfil
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const newProfile = await prisma.profile.create({ 
      data: { name } 
    });
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear perfil' }, { status: 500 });
  }
}
