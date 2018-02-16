export {
    Sheriff,
    SheriffAbility,
    Assignment,
    SheriffAssignmentMap,
    AssignmentTemplate,
    SheriffLocation,
    SheriffMap,
    SheriffTraining,
    StringMap,
    BLANK_SHERIFF,
    BLANK_SHERIFF_LOCATION,
    DateType,
    DaysOfWeek,
    DEFAULT_RECURRENCE,
    RecurrenceInfo,
    TrainingType,
    Courthouse,
    Region, 
    Courtroom,
    API
} from './Api'

// Todo: We need to create reducers for the following
export {
 WORK_SECTIONS,
 TRAINING_TYPES,
 COURTHOUSES,
 REGIONS,
 COURTROOMS
} from './Mock/MockData'

import Client from './Mock/MockApi'

export default new Client();