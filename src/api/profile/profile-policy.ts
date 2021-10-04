import { model } from '@plumier/mongoose';
import { entityPolicy } from 'plumier';

import { Profile } from './profile-entity';

entityPolicy(Profile)
    // ResourceOwner means when the current User record (specified by ID)
    // where the ID is the same as current login user ID
    .register('ResourceOwner', async (ctx, id) => {
        const ProfileModel = model(Profile);
        const user = await ProfileModel.findOne(id, {
            relations: ['profile'],
            cache: true,
        });
        return ctx.user?.userId === user?.owner?.id;
    });
