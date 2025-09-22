import { UsersService } from './users.service';
import { UserMeResponseDto } from './dto/user.dto';
export declare class UsersController {
    private readonly svc;
    constructor(svc: UsersService);
    me(user: {
        authUserId: string;
    }): Promise<UserMeResponseDto>;
}
