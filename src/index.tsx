import { useReducer, useState, FormEvent, useEffect } from 'react';

import { isEmailValid, isURLValid } from './fieldValidators';

const clearKey = 'clear';

declare namespace useFormTypes {
    export type FormFields = {
        [key: string]: {
            value: string | number;
            isRequired: boolean;
            validationFunction?: Function;
            errorDueToValidationFunction?: string;
            validationType?: 'email' | 'url';
        };
    };
    export type reducer = {
        [key: string]: any;
    };
}

const reducer = (state: object, action: any): useFormTypes.reducer => {
    const { id, value, type } = action;
    if (type && type === clearKey) {
        return value;
    }
    return { ...state, [id]: value };
};

const useForm = (initialFields: useFormTypes.FormFields) => {
    const [formFields, setFormFields] = useReducer(
        reducer,
        Object.keys(initialFields).reduce((value, key) => {
            return { ...value, [key]: initialFields[key].value };
        }, {})
    );
    const [error, seterror] = useState((): any => {
        return {};
    });
    useEffect(() => {
        return () => {
            setFormFields({ type: clearKey, value: initialFields });
        };
    }, []);
    const handleChange = ({ target }: any) => {
        let { id, value } = target;

        setFormFields({ id, value });
    };

    const adjustFormFieldsWithValidators = () => {
        const formKeys = Object.keys(formFields);
        const formValues = formKeys.reduce((values, key) => {
            return { ...values, [key]: { ...initialFields[key], value: formFields[key] } };
        }, {});
        return formValues;
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>, callback: Function): void => {
        event.preventDefault();

        const errorStateObject = validator(adjustFormFieldsWithValidators());

        seterror(errorStateObject);
        if (Object.keys(errorStateObject).length === 0 && errorStateObject.constructor === Object) {
            if (callback.constructor.name === 'AsyncFunction') {
                callback(formFields).then((res: boolean) => {
                    if (res) {
                        setFormFields({ type: clearKey, value: initialFields });
                    }
                });
            } else {
                callback(formFields);
            }
        }
    };

    return { handleChange, error, handleSubmit, formFields };
};

const validator = (formFields: useFormTypes.FormFields): { [key: string]: any } => {
    const formFieldKeys = Object.keys(formFields);
    const errorState = formFieldKeys.map((formFieldKey) => {
        const {
            value,
            isRequired,
            validationFunction,
            errorDueToValidationFunction,
            validationType,
        } = formFields[formFieldKey];

        const handleReturnValue = (message: string) => {
            return { [formFieldKey]: message };
        };

        if (isRequired) {
            const emptyString = '';

            if (typeof value === 'string') {
                if (value.trim() === emptyString) {
                    return handleReturnValue('Required');
                }
            } else if (typeof value === 'number') {
                if (value.toString() === emptyString) {
                    return handleReturnValue('Required');
                }
            }
        }

        if (validationFunction) {
            const isValueValid = validationFunction(value);
            if (!isValueValid) {
                return handleReturnValue(errorDueToValidationFunction || 'Not Valid');
            }
        }

        switch (validationType) {
            case 'email':
                if (typeof value === 'string' && isEmailValid(value)) return;
                return handleReturnValue('Email not valid');
            case 'url':
                if (typeof value === 'string' && isURLValid(value)) return;
                return handleReturnValue('URL not valid');
            default:
                break;
        }
        return;
    });

    let errorObject = {};
    errorState.forEach((errorStateElement) => {
        errorObject = { ...errorObject, ...errorStateElement };
    });
    return errorObject;
};

export default useForm;
