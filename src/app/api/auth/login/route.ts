import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Firmar Token (JWT)
    const secret = process.env.JWT_SECRET || 'secreto_super_seguro_mvp_no_usar_en_prod';
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      secret,
      { expiresIn: '8h' }
    );

    const response = NextResponse.json({ success: true, role: user.role });
    
    // Set cookie HTTP-only (seguridad recomendada para auth)
    response.cookies.set('auth_token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
      sameSite: 'strict'
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
