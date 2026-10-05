import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/employees -> Listar empleados con su perfil asociado
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { 
        profile: true,
        user: { select: { email: true, role: true } } // No traemos el password hash por seguridad
      }
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 });
  }
}

// POST /api/employees -> Registrar un nuevo empleado
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { document, fullName, baseSalary, childrenCount, profileId, userId } = body;

    if (!document || !fullName || baseSalary === undefined || !profileId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        document,
        fullName,
        baseSalary: parseFloat(baseSalary),
        childrenCount: parseInt(childrenCount) || 0,
        profileId,
        ...(userId && { userId }) // Solo lo vinculamos si nos envían el ID de usuario
      },
    });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear empleado' }, { status: 500 });
  }
}
