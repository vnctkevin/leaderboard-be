import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, isAdmin: user.isAdmin };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userDto: any) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const user = this.usersRepository.create({
            ...userDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }
}
