export interface TimeEntry {
    preset: string;
    start: string;
    pausedDuration: number;
    end: string;
}

export interface Config {
    moneybird: {
        administrationId: number;
        token: string;
        userId: number;
    };
    presets: {[key: string]: Preset};
    presetGroups: {[key: string]: string[] | Defaults[]};
    defaults: Defaults;
    rememberLastDate: boolean;
    summary: {
        edit: boolean;
        menu: boolean;
        remove: boolean;
        send: boolean;
    };
}

export interface Defaults {
    preset?: string;
    startOffset?: number;
    startTime?: string;
    pausedDuration?: number;
    endOffset?: number;
}

export interface Preset {
    description: string;
    project: number;
    contact: number;
    billable: boolean;
    defaults: Defaults;
}

export interface MoneybirdTimeEntry {
    user_id: number;
    started_at: string;
    ended_at: string;
    description: string;
    contact_id: number;
    project_id: number;
    billable: boolean;
    paused_duration: number;
}

export type NavigationOption = 'Add from preset' | 'Add from preset group' | 'Edit' | 'Remove' | 'Send' | 'Summary';
