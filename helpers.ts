import { table } from 'table';
import { add, addMinutes, format, formatDuration, intervalToDuration, parse, subMinutes } from "date-fns";
import { dateTimeFormat, referenceDate } from "./const";
import { Preset, TimeEntry } from "./model";

export const createSummary = (timeEntries: TimeEntry[], presets: {[key: string]: Preset}) => {  
    let totalEnd = new Date(0);
    let totalEndBillable = new Date(0);
 
    const tableData = [
        ['ID', 'Billable', 'Preset', 'Start', 'Pause', 'End', 'Worked hours'],
        ...timeEntries.map((timeEntry, index) => {
            const duration = getDuration(timeEntry.start, timeEntry.end, timeEntry.pausedDuration);
            const billable = presets?.[timeEntry.preset]?.billable;
            totalEnd = add(totalEnd, duration);

            if (billable) {
                totalEndBillable = add(totalEndBillable, duration);
            }

            return [
                index+1,
                billable ? 'Yes' : 'No',
                ...Object.values(timeEntry),
                formatDuration(duration),
            ];
        }),
        ['', '', '', '', '', '', `Total: ${formatDuration(intervalToDuration({
            start: new Date(0),
            end: totalEnd,
        }))}`],
        ['', '', '', '', '', '', `Billable: ${formatDuration(intervalToDuration({
            start: new Date(0),
            end: totalEndBillable,
        }))}`]
    ];

    return table(tableData);
};

export const getDuration = (start: string, end: string, pausedDuration: number) => {
    return intervalToDuration({
        start: parse(start, dateTimeFormat, referenceDate),
        end: subMinutes(parse(end, dateTimeFormat, referenceDate), pausedDuration),
    });
};

export const getFormmattedDateTime = (offsetMinutes: number = 0, dateTime?: string) => {
    const date = dateTime ? parse(dateTime, 'dd-MM-yyyy HH:mm', referenceDate) : new Date();
    return format(addMinutes(date, offsetMinutes), 'dd-MM-yyyy HH:mm')
};

export const getMoneybirdFormattedDateTime = (dateTime: string) => {
    const parsedDate = parse(dateTime, 'dd-MM-yyyy HH:mm', referenceDate);
    return format(addMinutes(parsedDate, parsedDate.getTimezoneOffset()), "yyyy-MM-dd HH:mm:00 'UTC'");
};
