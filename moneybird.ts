import axios from "axios";
import { MoneybirdTimeEntry } from "./model";

export const postTimeEntry = (moneybirdTimeEntry: MoneybirdTimeEntry, administrationId: number, token: string) => {
    return axios.post<MoneybirdTimeEntry>(
        `https://moneybird.com/api/v2/${administrationId}/time_entries`,
        {
            time_entry: moneybirdTimeEntry
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
    );
};
