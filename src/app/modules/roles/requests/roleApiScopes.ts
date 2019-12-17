import { ThunkExtra } from '../../../store';
import arrayToMap from '../../../infrastructure/arrayToMap';
import {
    STATE_KEY,
    RoleModuleState
} from '../common';
import {
    RoleApiScopeMap,
    RoleApiScope,
    MapType, IdType
} from '../../../api/Api';
import GetEntityMapRequest from '../../../infrastructure/Requests/GetEntityMapRequest';
import RequestAction, { RequestConfig } from '../../../infrastructure/Requests/RequestActionBase';
import CreateOrUpdateEntitiesRequest from '../../../infrastructure/Requests/CreateOrUpdateEntitiesRequest';
import CreateEntityRequest from '../../../infrastructure/Requests/CreateEntityRequest';
import UpdateEntityRequest from '../../../infrastructure/Requests/UpdateEntityRequest';
// import toTitleCase from '../../infrastructure/toTitleCase';

// Get the Map
class RoleApiScopeMapRequest extends GetEntityMapRequest<void, RoleApiScope, RoleModuleState> {
    constructor(config?: RequestConfig<MapType<RoleApiScope>>) {
        super({
            namespace: STATE_KEY,
            actionName: 'roleApiScopeMap',
            ...config
        });
    }
    public async doWork(request: void, { api }: ThunkExtra): Promise<RoleApiScopeMap> {
        let data = await api.getRoleApiScopes();
        return arrayToMap(data, t => t.id);
    }
}

export const roleApiScopeMapRequest = new RoleApiScopeMapRequest();

// Create RoleApiScope
class CreateRoleApiScopeRequest extends CreateEntityRequest<RoleApiScope, RoleModuleState> {
    constructor() {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'createRoleApiScope',
                toasts: {
                    success: (s) => (
                        `Success`
                    ),
                    error: (err) => (
                        `Problem encountered while adding new role scope: ${err ? err.toString() : 'Unknown Error'}`
                    )
                }
            },
            roleApiScopeMapRequest
        );
    }
    public async doWork(role: Partial<RoleApiScope>, { api }: ThunkExtra): Promise<RoleApiScope> {
        let newRoleApiScope = await api.createRoleApiScope(role as RoleApiScope);
        return newRoleApiScope;
    }
}

export const createRoleApiScopeRequest = new CreateRoleApiScopeRequest();

// RoleApiScope Edit
class UpdateRoleApiScopeRequest extends UpdateEntityRequest<RoleApiScope, RoleModuleState> {
    constructor() {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'updateRoleApiScope',
                toasts: {
                    success: (s) => `Success`,
                    // tslint:disable-next-line:max-line-length
                    error: (err) => `Problem encountered while updating role scope: ${err ? err.toString() : 'Unknown Error'}`
                }
            },
            roleApiScopeMapRequest
        );
    }
    public async doWork(role: Partial<RoleApiScope>, { api }: ThunkExtra): Promise<RoleApiScope> {
        let newRoleApiScope = await api.updateRoleApiScope(role as RoleApiScope);
        return newRoleApiScope;
    }
}

export const updateRoleApiScopeRequest = new UpdateRoleApiScopeRequest();

class CreateOrUpdateRoleApiScopeRequest extends CreateOrUpdateEntitiesRequest<RoleApiScope, RoleModuleState>{
    createEntity(entity: Partial<RoleApiScope>, { api }: ThunkExtra): Promise<RoleApiScope> {
        return api.createRoleApiScope(entity);
    }
    updateEntity(entity: Partial<RoleApiScope>, { api }: ThunkExtra): Promise<RoleApiScope> {
        return api.updateRoleApiScope(entity as RoleApiScope);
    }
    constructor(config?: RequestConfig<RoleApiScope[]>) {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'createOrUpdateRoleApiScope',
                toasts: {
                    error: (err: any) => `Couldn't create/update role scopes: ${err.message}`
                },
                ...config
            },
            roleApiScopeMapRequest
        );
    }
}

export const createOrUpdateRoleApiScopeRequest = new CreateOrUpdateRoleApiScopeRequest();

class DeleteRoleApiScopesRequest extends RequestAction<IdType[], IdType[], RoleModuleState> {
    constructor() {
        super({
            namespace: STATE_KEY,
            actionName: 'deleteRoleFrontendScopes',
            toasts: {
                success: (ids) => `${ids.length} role scopes(s) deleted`,
                error: (err) => `Problem encountered while deleting role scopes: ${err ? err.toString() : 'Unknown Error'}`
            }
        });
    }
    public async doWork(request: IdType[], { api }: ThunkExtra): Promise<IdType[]> {
        await api.deleteRoleApiScopes(request);
        return request;
    }
}

export const deleteRoleApiScopesRequest = new DeleteRoleApiScopesRequest();
