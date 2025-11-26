import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubmitScoreDto } from './dto/submit-score.dto';

@ApiTags('scores')
@ApiBearerAuth()
@Controller()
export class ScoresController {
    constructor(
        private scoresService: ScoresService,
        private usersService: UsersService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('scores')
    @ApiOperation({ summary: 'Submit a score' })
    @ApiResponse({ status: 201, description: 'Score submitted successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async submitScore(@Request() req, @Body() submitScoreDto: SubmitScoreDto) {
        if (!submitScoreDto.username || submitScoreDto.score === undefined) {
            throw new BadRequestException('Username and score are required');
        }

        const targetUser = await this.usersService.findOne(submitScoreDto.username);
        if (!targetUser) {
            throw new BadRequestException('User not found');
        }

        // Authorization: User can only submit for themselves, unless they are admin
        if (req.user.username !== submitScoreDto.username && !req.user.isAdmin) {
            throw new ForbiddenException('You can only submit scores for yourself');
        }

        return this.scoresService.submitScore(targetUser.id, submitScoreDto.score);
    }

    @Get('leaderboard')
    @ApiOperation({ summary: 'Get top 10 scores' })
    @ApiResponse({ status: 200, description: 'Return top 10 scores.' })
    async getLeaderboard() {
        return this.scoresService.getLeaderboard();
    }
}
