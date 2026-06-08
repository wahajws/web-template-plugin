export const STATIC_DATA = {
    IC_TYPE: "IC_TYPE",
    GENDER: "GENDER",
    EMAIL_TYPE: "EMAIL_TYPE",
    PHONE_TYPE: "PHONE_TYPE",
    NAME_TITLE: "NAME_TITLE",
    ORGANISATION_TYPE: "ORGANISATION_TYPE",
    SOCIAL_MEDIA: "SOCIAL_MEDIA",
    ADDRESS_TYPE: "ADDRESS_TYPE", 
    RECORD_STATUS: "RECORD_STATUS",
    EMAIL_VERIFIED: "EMAIL_VERIFIED",
    DEFAULT_VALUE: 0  
}

export const IC_TYPE_OPTIONS = {
    NRIC : 0,
    Passport : 1,
    Other : 2
}

export const GENDER_OPTIONS = {
    Undisclosed : 0,
    Male : 1,
    Female : 2
}

export const RECORD_STATUS_OPTIONS = {
    Deleted : -1,
    Public : 0,
    Draft : 1
}

export const EMAIL_VERIFIED_OPTIONS = {
    Unverified : false,
    Verified : true,  
}

export const HTML_STATUS_CODES = {
    Success : 200,
    Created : 201,
    Accepted : 202,
    NoData: 204, 
    CashedResponse: 304,
    BadRequest : 400,
    Unauthorized : 401,
    NotFound : 404,
    InternalServerError : 500
}

export interface SelectorProps<T> {
    value?: T[keyof T]; // Selected value, based on the enum type
    placeholder?: string; // Optional placeholder text
    enumType: T; // The TypeScript enum
    onChange: (selectedKey: T[keyof T]) => void; // Callback when an option is selected
    labelTransform?: (key: keyof T) => string; // Optional transformation for readable labels
}

export function getEnumKeys<T extends string, TEnumValue extends string | number,>(enumVariable: { [key in T]: TEnumValue }) {
    return Object.keys(enumVariable) as Array<T>;
}

// Function to get label by value
export function getEnumLabel(enumObj: Record<string, string | number>, value: string | number): string | null {
  return Object.keys(enumObj).find(key => enumObj[key] === value) || null;
}
