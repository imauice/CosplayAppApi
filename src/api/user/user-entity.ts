import { Profile } from './../profile/profile-entity';
import { collection, proxy, Ref } from '@plumier/mongoose';
import bcrypt from 'bcryptjs';
import { authorize, genericController, preSave, val } from 'plumier';

import { EntityBase } from '../_shared/entity-base';

@genericController((c) => {
    // POST /users accessible by public
    c.post().authorize('Public');

    // PUT PATCH DELETE GET /users/{id} only accessible by the user itself
    // See the user-policy.ts file how ResourceOwner defined
    c.methods('Delete', 'GetOne', 'Patch', 'Put').authorize('ResourceOwner', 'Admin');

    // GET /users?limit&offset&filter only accessible by Admin
    c.getMany().authorize('Admin');
})
@collection()
export class User extends EntityBase {
    // email will only visible by the user itself or by Admin
    @authorize.read('ResourceOwner', 'Admin')
    @val.required()
    @val.unique()
    @val.email()
    email: string;

    @collection.ref((x) => Profile)
    profile: Ref<Profile>;

    // password will not visible to anyone
    @authorize.writeonly()
    @val.required()
    password: string;

    @val.enums(['Admin', 'User'])
    // role only can be set by Admin
    @authorize.write('Admin')
    // role only visible to the user itself or by Admin
    @authorize.read('ResourceOwner', 'Admin')
    @collection.property({ default: 'User' })
    role: 'User' | 'Admin';

    @val.enums(['Active', 'Suspended'])
    @authorize.write('Admin')
    @collection.property({ default: 'Active' })
    status: 'Active' | 'Suspended';

    @preSave()
    async initEntity() {
        if (this.password) this.password = await bcrypt.hash(this.password, await bcrypt.genSalt());
    }
}

export const UserModel = proxy(User);