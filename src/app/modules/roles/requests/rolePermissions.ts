import { ThunkExtra } from '../../../store';
import arrayToMap from '../../../infrastructure/arrayToMap';
import {
    STATE_KEY,
    RoleModuleState
} from '../common';
import {
    RolePermissionMap,
    RolePermission,
    MapType
} from '../../../api/Api';
import GetEntityMapRequest from '../../../infrastructure/Requests/GetEntityMapRequest';
import { RequestConfig } from '../../../infrastructure/Requests/RequestActionBase';
import CreateOrUpdateEntitiesRequest from '../../../infrastructure/Requests/CreateOrUpdateEntitiesRequest';
import CreateEntityRequest from '../../../infrastructure/Requests/CreateEntityRequest';
import UpdateEntityRequest from '../../../infrastructure/Requests/UpdateEntityRequest';
// import toTitleCase from '../../infrastructure/toTitleCase';

// Get the Map
class RolePermissionsMapRequest extends GetEntityMapRequest<void, RolePermission, RoleModuleState> {
    constructor(config?: RequestConfig<MapType<RolePermission>>) {
        super({
            namespace: STATE_KEY,
            actionName: 'rolePermissionMap',
            ...config
        });
    }
    public async doWork(request: void, { api }: ThunkExtra): Promise<RolePermissionMap> {
        let roles = await api.getRolePermissions();
        return arrayToMap(roles, t => t.id);
    }
}

export const rolePermissionMapRequest = new RolePermissionsMapRequest();

// Create RolePermission
class CreateRolePermissionRequest extends CreateEntityRequest<RolePermission, RoleModuleState> {
    constructor() {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'createRolePermissions',
                toasts: {
                    success: (s) => (
                        `Success`
                    ),
                    error: (err) => (
                        `Problem encountered while adding new role permissions: ${err ? err.toString() : 'Unknown Error'}`
                    )
                }
            },
            rolePermissionMapRequest
        );
    }
    public async doWork(role: Partial<RolePermission>, { api }: ThunkExtra): Promise<RolePermission> {
        let newRolePermissions = await api.createRolePermission(role as RolePermission);
        return newRolePermissions;
    }
}

export const createRolePermissionRequest = new CreateRolePermissionRequest();

// RolePermissions Edit
class UpdateRolePermissionsRequest extends UpdateEntityRequest<RolePermission, RoleModuleState> {
    constructor() {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'updateRolePermissions',
                toasts: {
                    success: (s) => `Success`,
                    // tslint:disable-next-line:max-line-length
                    error: (err) => `Problem encountered while updating role permissions: ${err ? err.toString() : 'Unknown Error'}`
                }
            },
            rolePermissionMapRequest
        );
    }
    public async doWork(role: Partial<RolePermission>, { api }: ThunkExtra): Promise<RolePermission> {
        let newRolePermission = await api.updateRolePermission(role as RolePermission);
        return newRolePermission;
    }
}

export const updateRolePermissionRequest = new UpdateRolePermissionsRequest();

class CreateOrUpdateRolePermissionsRequest extends CreateOrUpdateEntitiesRequest<RolePermission, RoleModuleState>{
    createEntity(entity: Partial<RolePermission>, { api }: ThunkExtra): Promise<RolePermission> {
        return api.createRolePermission(entity);
    }
    updateEntity(entity: Partial<RolePermission>, { api }: ThunkExtra): Promise<RolePermission> {
        return api.updateRolePermission(entity as RolePermission);
    }
    constructor(config?: RequestConfig<RolePermission[]>) {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'createOrUpdateRolePermissions',
                toasts: {
                    error: (err: any) => `Couldn't create/update role permissions: ${err.message}`
                },
                ...config
            },
            rolePermissionMapRequest
        );
    }
}

export const createOrUpdateRolePermissionRequest = new CreateOrUpdateRolePermissionsRequest();
