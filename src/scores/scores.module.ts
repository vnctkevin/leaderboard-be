import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Score]), UsersModule],
    providers: [ScoresService],
    controllers: [ScoresController],
    exports: [TypeOrmModule],
})
export class ScoresModule { }
