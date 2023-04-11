import { UserLogin } from 'src/types/userLogin';

export interface ILoginController {
  login(body: UserLogin);
}
