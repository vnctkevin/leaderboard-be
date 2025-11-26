import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
    constructor(
        @InjectRepository(Score)
        private scoresRepository: Repository<Score>,
    ) { }

    async submitScore(userId: string, score: number) {
        const newScore = this.scoresRepository.create({ userId, score });
        return this.scoresRepository.save(newScore);
    }

    async getLeaderboard(userId: string) {
        return this.scoresRepository.find({
            where: { userId },
            order: { score: 'DESC' },
            take: 10,
            relations: ['user'],
            select: {
                user: {
                    username: true,
                }

            }
        });
    }
}
