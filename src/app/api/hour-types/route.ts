import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/hour-types -> Listar todos los tipos de horas
export async function GET() {
  try {
    const hourTypes = await prisma.hourType.findMany();
    return NextResponse.json(hourTypes);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tipos de hora' }, { status: 500 });
  }
}

// POST /api/hour-types -> Crear un nuevo tipo de hora
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, multiplier } = body;
    
    if (!name || multiplier === undefined) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const newHourType = await prisma.hourType.create({
      data: { 
        name, 
        multiplier: parseFloat(multiplier) 
      },
    });
    return NextResponse.json(newHourType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear tipo de hora' }, { status: 500 });
  }
}
