import chalk from 'chalk';
import YAML from 'yaml';
import fs from 'fs';
import { Config, NavigationOption, TimeEntry } from './model';
import { enterTimeEntryID, getTimeEntry, navigation, selectFromList } from './prompts';
import { createSummary, getMoneybirdFormattedDateTime } from './helpers';
import { postTimeEntry } from './moneybird';
import axios, { AxiosError } from 'axios';

const main = async () => {
    const file = fs.readFileSync('./config.yaml', 'utf8');
    const config: Config = YAML.parse(file);
    console.log(chalk.bgBlue.white.bold('                    \n moneybird-time-cli \n                    \n'));
    let verified = false;
    let entries: TimeEntry[] = [];

    while (!verified) {
        if (config.summary.menu && entries.length) {
            console.log(createSummary(entries, config.presets));
        }
        const navigationOption: NavigationOption = await navigation(entries.length > 0);

        switch (navigationOption) {
            case 'Add from preset':
                entries = [
                    ...entries,
                    await getTimeEntry(config.defaults, config.presets),
                ];
                break;
            case 'Add from preset group':
                    const group =  await selectFromList(Object.keys(config.presetGroups), 'group');                    
                    const groupConfigValue = Object.entries(config.presetGroups).find(([key, _]) => key === group)?.[1];

                    if (groupConfigValue) {
                        for await (const groupValuePreset of groupConfigValue) {
                            const value = await getTimeEntry(
                                config.defaults,
                                config.presets,
                                {
                                    ...(typeof groupValuePreset === 'string' 
                                        ? {preset: groupValuePreset} 
                                        : groupValuePreset
                                    ),
                                },
                            );

                            entries = [
                                ...entries,
                                value,
                            ];
                        }
                    }
                    break;
            case 'Edit':
                if (config.summary.edit) {
                    console.log(createSummary(entries, config.presets));
                }
                const editEntryID = await enterTimeEntryID();
                const editedEntry = await getTimeEntry(
                    config.defaults,
                    config.presets,
                    entries.find((_, index) => index === editEntryID - 1)
                ) as TimeEntry;
                entries = entries.map((entry, index) => index !== editEntryID - 1 ? entry : editedEntry);
                break;
            case 'Remove':
                if (config.summary.remove) {
                    console.log(createSummary(entries, config.presets));
                }
                const removeEntryID = await enterTimeEntryID();
                if (removeEntryID) {
                    entries = entries.filter((_, index) => index !== removeEntryID - 1);
                }
                break;
            case 'Summary':
                console.log(createSummary(entries, config.presets));
                break;
            case 'Send':
                if (config.summary.send) {
                    console.log(createSummary(entries, config.presets));
                }
                verified = true;
                break;
        }
    }

    console.log('Sending the time entries to Moneybird...');
    entries.forEach(async (entry, index) => {
        const presetConfig = Object.entries(config.presets).find(([key, _]) => key === entry.preset);

        if (presetConfig) {
            const presetConfigValues = presetConfig[1];            

            try {
                await postTimeEntry(
                    {
                        user_id: config.moneybird.userId,
                        started_at: getMoneybirdFormattedDateTime(entry.start),
                        ended_at: getMoneybirdFormattedDateTime(entry.end),
                        description: presetConfigValues.description,
                        contact_id: presetConfigValues.contact,
                        project_id: presetConfigValues.project,
                        billable: presetConfigValues.billable,
                        paused_duration: entry.pausedDuration*60,
                    },
                    config.moneybird.administrationId,
                    config.moneybird.token,
                );
            } catch(error: unknown | Error | AxiosError) {
                if (axios.isAxiosError(error))  {
                    console.error(`Could not send entry ${index+1} to Moneybird.`, error.response?.statusText);
                } else {
                    console.error(`Could not send entry ${index+1} to Moneybird. Unknown error.`);
                }
            }
        }
    });
    console.log('Time entries sent.');
};

main();
