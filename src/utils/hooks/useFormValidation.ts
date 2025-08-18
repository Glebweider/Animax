// hooks/useFormValidation.ts
import { useEffect, useState } from "react";

type FieldConfig = {
    value: string;
    rules: ((val: string) => string | null)[];
};

type FormConfig = {
    [key: string]: FieldConfig;
};

export const useFormValidation = (formConfig: FormConfig) => {
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [activeButton, setActiveButton] = useState(true);

    useEffect(() => {
        const newErrors: { [key: string]: string | null } = {};
        const newValid: { [key: string]: boolean } = {};

        for (const key in formConfig) {
            const { value, rules } = formConfig[key];
            let error: string | null = null;

            if (value === "") {
                newErrors[key] = null;
                newValid[key] = false;
                continue;
            }

            for (const rule of rules) {
                error = rule(value);
                if (error) break;
            }

            newErrors[key] = error;
            newValid[key] = !error;
        }
        setErrors(newErrors);

        const allValid = Object.values(newValid).every(Boolean);
        setActiveButton(!allValid);
    }, [formConfig]);

    return { errors, activeButton };
};
