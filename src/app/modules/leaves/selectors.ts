import { RootState } from '../../store';
import { createSelector } from 'reselect';
import * as leaveRequests from './requests';
import {
    LeaveMap,
    IdType
} from '../../api/Api';
import mapToArray from '../../infrastructure/mapToArray';

export const allLeaves = createSelector(
    leaveRequests.leaveMapRequest.getData,
    (map) => mapToArray(map)
        .sort((a, b) => `${a.startDate}`
            .localeCompare(`${b.startDate}`))
);

export const getLeave = (id?: IdType) => (state: RootState) => {
    if (state && id != null) {
        const map: LeaveMap = leaveRequests.leaveMapRequest.getData(state);
        return map[id];
    }
    return undefined;
};

export const getSheriffLeaves = (sheriffId?: IdType) => (state: RootState) => {
    if (state && sheriffId != null) {
        return allLeaves(state).filter(l => l.sheriffId === sheriffId);
    }
    return [];
};

export const getPartialDayLeaves = (state: RootState) => {
    if (state != null) {
        return allLeaves(state).filter(l => l.isPartial);
    }
    return [];
};

export const getFullDayLeaves = (state: RootState) => {
    if (state != null) {
        return allLeaves(state).filter(l => !l.isPartial);
    }
    return [];
};

export const getSheriffPartialLeaves = (sheriffId?: IdType) => (state: RootState) => {
    if (state && sheriffId != null) {
        return getPartialDayLeaves(state).filter(l => l.sheriffId === sheriffId);
    }
    return [];
};

export const getSheriffFullDayLeaves = (sheriffId?: IdType) => (state: RootState) => {
    if (state && sheriffId != null) {
        return getFullDayLeaves(state).filter(l => l.sheriffId === sheriffId);
    }
    return [];
};

export const allLeaveTypes = createSelector(
    leaveRequests.leaveTypeMapRequest.getData,
    (leaveTypes) => mapToArray(leaveTypes).sort((a, b) => a.description.localeCompare(b.description))
);

export const allLeaveCancelCodes = createSelector(
    leaveRequests.leaveCancelCodeMapRequest.getData,
    (leaveCancelCodes) => mapToArray(leaveCancelCodes).sort((a, b) => a.description.localeCompare(b.description))
);