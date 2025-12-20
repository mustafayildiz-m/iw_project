import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Geçersiz email veya şifre');
    }

    // Kullanıcı aktif mi kontrol et
    if (!user.isActive) {
      throw new UnauthorizedException('Hesabınız devre dışı bırakılmış. Lütfen yönetici ile iletişime geçin.');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz email veya şifre');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        photoUrl: user.photoUrl,
      },
    };
  }

  async me(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }
      
      // Kullanıcı aktif mi kontrol et
      if (!user.isActive) {
        throw new UnauthorizedException('Hesabınız devre dışı bırakılmış.');
      }
      
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
      };
    } catch (err) {
      console.error('Token verification error:', err.message);
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş token');
    }
  }

  async register(registerDto: any) {
    // Email var mı kontrol et
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new UnauthorizedException('Bu email ile zaten bir kullanıcı var.');
    }
    // Yeni kullanıcı oluştur
    const user = await this.usersService.create({
      ...registerDto,
      role: 'user',
      isActive: 1,
    });
    return { message: 'Kayıt başarılı', user };
  }
} 