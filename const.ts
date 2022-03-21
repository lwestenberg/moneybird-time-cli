import { set } from "date-fns";

export const dateTimeFormat = "dd-MM-yyyy HH:mm";
export const referenceDate = set(new Date(), { seconds: 0, milliseconds: 0 });
