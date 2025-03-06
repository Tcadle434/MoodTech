import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Create a copy without the password
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(email: string, password: string, name?: string) {
    const user = await this.usersService.create(email, password, name);
    
    // Create a copy without the password
    const { password: _, ...result } = user;
    
    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: result,
    };
  }
}