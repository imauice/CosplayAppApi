import { User } from './../user/user-entity';
import { EntityBase } from './../_shared/entity-base';
import { collection, proxy, Ref } from '@plumier/mongoose';
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
export class Profile extends EntityBase {
    @val.required()
    @val.unique()
    name: string;

    @collection.ref((x) => User)
    owner: Ref<User>;

    @collection.property()
    displayName: string;

    @collection.property()
    description: string;
}

export const ProfileModel = proxy(Profile);
