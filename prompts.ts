import chalk from "chalk";
import { format, formatDuration } from "date-fns";
import enquirer from 'enquirer';
import { getDuration, getFormmattedDateTime } from "./helpers";
import { Defaults, NavigationOption, Preset, TimeEntry } from "./model";

export const enterPausedDuration = async (initial: number) => {
    const answer: {value: number} = await enquirer.prompt({
        type: 'numeral',
        min: 0,
        name: 'value',
        initial,
        message: chalk.blue(`Enter the pause duration in minutes: `),
    });

    return answer?.value;
};

export const enterDateTime = async (type: 'start' | 'end', initial: string) => {
    const answer: {value: string} = await enquirer.prompt({
        type: 'input',
        name: 'value',
        initial,
        message: chalk.blue(`Enter the ${type} date and time: `),
    });

    return answer?.value
};

export const getTimeEntry = async (defaults: Defaults, presets: {[key: string]: Preset}, timeEntry?: Partial<TimeEntry>) => {
    let verified = false;

    while (!verified) { 
        const preset = await selectFromList(Object.keys(presets), 'preset', timeEntry?.preset || defaults?.preset);
        const presetValue = Object.entries(presets).find(([key, _]) => key === preset)?.[1];
        const presetStartTime = presetValue?.defaults?.startTime || defaults?.startTime;
        const startTime = presetStartTime ? `${format(new Date(), 'dd-MM-yyyy')} ${presetStartTime}` : undefined;

        const start = await enterDateTime('start', timeEntry?.start || getFormmattedDateTime(presetValue?.defaults?.startOffset || defaults?.startOffset, startTime));
        const pausedDuration =  await enterPausedDuration(timeEntry?.pausedDuration || presetValue?.defaults?.pausedDuration || defaults?.pausedDuration || 0);
        const end =  await enterDateTime('end', timeEntry?.end || getFormmattedDateTime(presetValue?.defaults?.endOffset || defaults?.endOffset, start));
        const timeEntryResult = {
            preset,
            start,
            pausedDuration,
            end,
        };
        verified = await verifyTimeEntry(timeEntryResult);
        if (verified) {
            return timeEntryResult;
        }
    }

    throw("Could not get time entry");
};

export const navigation = async (hasEntries: boolean) => {
    const answer: {value: NavigationOption } = await enquirer.prompt({
        type: 'select',
        name: 'value',
        message: chalk.blue('Select an option: '),
        choices: ['Add from preset', 'Add from preset group', ...(hasEntries ? ['Edit', 'Remove', 'Summary', 'Send'] : [])],
    });
    return answer?.value;
};

export const selectFromList = async (choices: string[], type: 'preset' | 'group', initial?: string) => {
    const answer: {value: string} = await enquirer.prompt({
        type: 'select',
        name: 'value',
        message: chalk.blue('Select a preset: '),
        choices,
        initial: choices.indexOf(initial ?? ''),
    });
    return answer?.value;
};

export const enterTimeEntryID = async() => {
    const answer: {value: number } = await enquirer.prompt({
        type: 'numeral',
        name: 'value',
        min: 1,
        message: chalk.blue('Enter the time entry ID or 0 to cancel: '),
    });
    return answer?.value;
};

export const verifyTimeEntry = async (timeEntry: TimeEntry) => {
    console.log('Total duration:', formatDuration(getDuration(timeEntry.start, timeEntry.end, timeEntry.pausedDuration)));
    const answer: {value: boolean } = await enquirer.prompt({
        type: 'confirm',
        name: 'value',
        initial: true,
        message: chalk.blue('Is this correct?'),
    });
    return answer.value;
};
