import { Profile } from './../profile/profile-entity';
import { collection, proxy, Ref } from '@plumier/mongoose';
import bcrypt from 'bcryptjs';
import { authorize, genericController, preSave, val } from 'plumier';

import { EntityBase } from '../_shared/entity-base';

@genericController((c) => {
    c.post().authorize('Public');
    c.methods('Delete', 'GetOne', 'Patch', 'Put').authorize(
        'ResourceOwner',
        'Admin'
    );
    c.getMany().authorize('Admin');
})
@collection()
export class User extends EntityBase {
    @authorize.read('ResourceOwner', 'Admin')
    @val.required()
    @val.unique()
    @val.email()
    email: string;

    @collection.ref((x) => Profile)
    profile: Ref<Profile>;

    @authorize.writeonly()
    @val.required()
    password: string;

    @val.enums(['Admin', 'User'])
    @authorize.write('Admin')
    @authorize.read('ResourceOwner', 'Admin')
    @collection.property({ default: 'User' })
    role: 'User' | 'Admin';

    @val.enums(['Active', 'Suspended'])
    @authorize.write('Admin')
    @collection.property({ default: 'Active' })
    status: 'Active' | 'Suspended';

    @preSave()
    async initEntity() {
        if (this.password)
            this.password = await bcrypt.hash(
                this.password,
                await bcrypt.genSalt()
            );
    }
}

export const UserModel = proxy(User);
