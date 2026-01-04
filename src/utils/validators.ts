export const isNumericAmount = (value: string) => /^\d+(\.\d{1,2})?$/.test(value.trim());

export const isRequired = (value?: string | null) => !!value && value.trim().length > 0;
