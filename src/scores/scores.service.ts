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

    async getAllLeaderboard() {
        return this.scoresRepository.find({
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

    async getUserLeaderboard() {
        // Using a subquery to get the highest score for each user
        return this.scoresRepository
            .createQueryBuilder('score')
            .innerJoinAndSelect('score.user', 'user')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(s.score)')
                    .from(Score, 's')
                    .where('s.userId = score.userId')
                    .getQuery();
                return `score.score = ${subQuery}`;
            })
            .orderBy('score.score', 'DESC')
            .addOrderBy('score.id', 'ASC')
            .take(10)
            .getMany();
    }


}
