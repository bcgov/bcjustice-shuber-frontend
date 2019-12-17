export {
    Sheriff,
    Assignment,
    AssignmentMap,
    AssignmentDuty,
    AssignmentDutyMap,
    SheriffMap,
    StringMap,
    BLANK_SHERIFF,
    DateType,
    DaysOfWeek,
    DEFAULT_RECURRENCE,
    DutyRecurrence,
    Location,
    Region,
    Courtroom,
    API,
    IdType,
    Shift,
    Leave,
    LeaveSubCode,
    SheriffDuty,
    TimeType,
    WorkSectionCode,
    CourtroomMap,
    EscortRun,
    RunMap,
    JailRole,
    JailRoleMap,
    AlternateAssignment,
    AlternateAssignmentMap,
    SheriffUnassignedRange,
    User,
    Role,
    UserRole,
    ApiScope,
    FrontendScope,
    FrontendScopePermission,
    RoleApiScope,
    RoleFrontendScope,
    RolePermission,
    WORK_SECTIONS
} from './Api';

import Client from './Client';
import resolveAppUrl from '../infrastructure/resolveAppUrl';

const client = new Client(resolveAppUrl('/api/v1'));
export default client;
