import {
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {IUserGroup} from "../../models/entity/IUserGroup";
import {User} from "./User";
import {UserGroup} from "./UserGroup";
import {PermissionOperation} from "./PermissionOperation";
import {PermissionEntity} from "./PermissionEntity";
import {IUser, IUserPermissions} from "../../models/entity/IUser";

@Entity()
export class UserPermissions {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.userPermissions)
    @JoinColumn({ name: "user_id" })
    user: IUser;

    @ManyToOne(type => PermissionOperation)
    @JoinColumn({ name: "permission_operation_id" })
    permissionOperation: PermissionOperation;

    @ManyToOne(type => PermissionEntity)
    @JoinColumn({ name: "permission_entity_id" })
    permissionEntity: PermissionEntity;

    load(user: IUser) {

        let permissions: IUserPermissions[] = [];

        user.userPermissions.forEach((permission: any) => {

            permission.entity_operations.forEach((operation: number) => {

                let $this = {...this};

                $this.user = user;

                $this.permissionEntity = new PermissionEntity(permission.entity_id);
                $this.permissionOperation = new PermissionOperation(operation);

                permissions.push($this);
            });
        });

        return permissions;
    }
}
