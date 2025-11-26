import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'john_doe' })
    username: string;

    @ApiProperty({ example: 'password123' })
    password: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: false, required: false })
    isAdmin?: boolean;
}
