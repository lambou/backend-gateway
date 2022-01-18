import moment from "moment";

/**
 * Convert array of object to object
 * @param array array to convert
 */
export const arrayToObject = (array: any[]) => {
  const r: any = {};
  for (const item of array) {
    if (typeof item === "object") {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const element = item[key];
          r[key] = element;
        }
      }
    }
  }
  return r;
};

/**
 * Extend object of values to a form data
 * @param obj object
 * @param filters filters to be applied on attributes
 */
export const extendToFormData = (
  obj: any,
  filters?: {
    [key: string]: (value: any) => any | [(value: any) => any];
  }
) => {
  const form = new FormData();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let element = obj[key];
      if (filters && filters[key]) {
        const func = filters[key];
        if (Array.isArray(func)) {
          for (const f of func) {
            element = f(element);
          }
        } else {
          element = func(element);
        }
      }
      form.set(key, element);
    }
  }
  return form;
};

/**
 * Group date by calendar day
 * @param data array of item with a date property
 * @param dateProperty date property
 * @param dateFormat date form
 */
export function groupDate<T = any>(
  data: T[],
  dateProperty: keyof T,
  dateFormat?: string
) {
  const r: {
    [date: string]: T[];
  } = {};

  for (const item of data) {
    // only if the date property exist
    if (item[dateProperty]) {
      const date = moment(item[dateProperty], dateFormat);

      const dateWithoutTime = moment(date.format("DD/MM/YYYY"), "DD/MM/YYYY");

      // extract map key
      const mapKey = dateWithoutTime.calendar({
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        nextWeek: "dddd",
        lastDay: "[Yesterday]",
        lastWeek: "[Last] dddd",
        sameElse: "DD/MM/YYYY",
      });

      // get map item
      let mapItem = r[mapKey];

      if (mapItem) {
        // push the new item
        mapItem.push(item);
      } else {
        // initiate de list
        r[mapKey] = [item];
      }
    }
  }

  return r;
}

/**
 * Order array by the given date property following the given order
 * @param params parameters
 */
export function orderByDate<T = any>(params: {
  data: T[];
  dateProperty: keyof T;
  order?: "asc" | "desc";
  dateFormat?: string;
}) {
  return params.data.sort((a, b) => {
    if (params.order === "asc") {
      return moment(a[params.dateProperty], params.dateFormat).isAfter(
        moment(b[params.dateProperty], params.dateFormat)
      )
        ? 1
        : -1;
    } else {
      return moment(a[params.dateProperty], params.dateFormat).isBefore(
        moment(b[params.dateProperty], params.dateFormat)
      )
        ? 1
        : -1;
    }
  });
}
