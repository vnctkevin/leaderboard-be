import { ApiProperty } from '@nestjs/swagger';

export class SubmitScoreDto {
    @ApiProperty({ example: 100 })
    score: number;

    @ApiProperty({ example: 'john_doe' })
    username: string;
}
