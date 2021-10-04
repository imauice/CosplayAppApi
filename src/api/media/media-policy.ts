import { Media, MediaModel } from './media-entity';
import { entityPolicy } from 'plumier';
import { model } from '@plumier/mongoose';

entityPolicy(Media).register('ResourceOwner', async (ctx, id) => {
    const media = await MediaModel.findOne(id, {
        relations: ['user'],
        cache: true,
    });
    return ctx.user?.userId === media?.owner?.id;
});
