import * as jwt from 'jsonwebtoken';
import { prisma } from './prisma';

// Função para gerar token JWT
export function generateToken(userData: any) {
  return jwt.sign(
    userData,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return !!decoded;
  } catch (error) {
    return false;
  }
}

export function decodeToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

export async function verifyAuthToken(token: string) {
  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    
    if (!decoded || !decoded.id) {
      return null;
    }
    
    // Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user) {
      return null;
    }
    
    // Retorna os dados do usuário (exceto senha)
    const { password, ...userData } = user;
    return userData;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
} 