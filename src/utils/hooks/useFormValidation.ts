// hooks/useFormValidation.ts
import { useEffect, useState } from "react";

type FieldConfig = {
    value: string;
    rules: ((val: string) => string | null)[];
    initialValue?: string;
};

type FormConfig = {
    [key: string]: FieldConfig;
};

export const useFormValidation = (formConfig: FormConfig) => {
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [activeButton, setActiveButton] = useState<boolean>(true);

    useEffect(() => {
        const newErrors: { [key: string]: string | null } = {};
        const newValid: { [key: string]: boolean } = {};
        let hasChanges = false;

        for (const key in formConfig) {
            const { value, rules, initialValue } = formConfig[key];
            let error: string | null = null;

            if (initialValue !== undefined && value !== initialValue) {
                hasChanges = true;
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

        if (!hasChanges) {
            setActiveButton(false);
        } else {
            setActiveButton(allValid);
        }
    }, [formConfig]);

    return { errors, activeButton };
};
