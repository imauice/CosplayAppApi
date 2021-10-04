import { route, authorize } from 'plumier';
import { User, UserModel } from './user-entity';

export class UserController {
    @authorize.route('Public')
    @route.post()
    async save(data: User) {
        const newly = await new UserModel(data).save();
        return newly;
    }
}
