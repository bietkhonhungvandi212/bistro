import { Request } from 'express';

import { AuthUserDTO } from './auth-user.dto';

export type AuthRequestDTO = Request & { user: AuthUserDTO };
