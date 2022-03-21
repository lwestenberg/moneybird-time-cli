import { table } from 'table';
import { add, addMinutes, format, formatDuration, intervalToDuration, parse, subMinutes } from "date-fns";
import { dateTimeFormat, referenceDate } from "./const";
import { TimeEntry } from "./model";

export const createSummary = (timeEntries: TimeEntry[]) => {  
    let totalEnd = new Date(0);
 
    const tableData = [
        ['ID', 'Preset', 'Start', 'Pause', 'End', 'Duration'],
        ...timeEntries.map((timeEntry, index) => {
            const duration = getDuration(timeEntry.start, timeEntry.end, timeEntry.pausedDuration);
            totalEnd = add(totalEnd, duration);
            return [
                index+1,
                ...Object.values(timeEntry),
                formatDuration(duration),
            ];
        }),
        ['', '', '', '', '', formatDuration(intervalToDuration({
            start: new Date(0),
            end: totalEnd,
        }))]
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
