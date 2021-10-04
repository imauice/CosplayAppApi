import { User } from './../user/user-entity';
import { MediaType } from './mediaTypes';
import { EntityBase } from './../_shared/entity-base';
import { model, collection } from '@plumier/mongoose';
import { val, genericController } from 'plumier';

@genericController((c) => {
    c.post().authorize('AnyUser');
    c.methods('Delete', 'GetOne', 'Patch', 'Put').authorize(
        'ResourceOwner',
        'Admin'
    );
    c.getMany().authorize('Admin');
})
@collection()
export class Media extends EntityBase {
    @val.required()
    @val.url()
    url: string;

    @val.required()
    @val.enums(Object.values(MediaType))
    type: MediaType;

    @collection.ref(User)
    owner: User;
}

export const MediaModel = model(Media);
