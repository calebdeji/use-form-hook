import * as React from 'react';

import useForm from '.';

const TestComponent: React.FC<{}> = () => {
    const { error, formFields, handleSubmit, handleChange } = useForm({
        name: {
            isRequired: true,
            value: '',
            errorDueToValidationFunction: 'Name cannot be empty',
        },
        occupation: {
            isRequired: true,
            value: '',
            errorDueToValidationFunction: 'Occupation is not valid',
            validationFunction: (value: string) => {
                return ['teacher', 'barber', 'developer'].includes(value);
            },
        },
        email: {
            isRequired: true,
            value: '',
            validationType: 'email',
        },
    });
    const submit = (values: object) => {
        console.log({ values });
    };

    return (
        <form action="" onSubmit={(event) => handleSubmit(event, submit)} aria-label="form">
            <input
                type="text"
                name=""
                id="name"
                value={formFields.name}
                onChange={handleChange}
                aria-label="name"
            />
            {error.name && <span aria-label="name-error">Error {error.name} </span>}
            <input
                type="text"
                id="occupation"
                value={formFields.occupation}
                onChange={handleChange}
                aria-label="occupation"
            />
            {error.occupation && <span aria-label="occupation-error">Error {error.occupation} </span>}
            <input
                type="email"
                id="email"
                value={formFields.email}
                onChange={handleChange}
                aria-label="email"
            />
            {error.email && <span aria-label="email-error">Error {error.email} </span>}

            <button type="submit"> Submit </button>
        </form>
    );
};

export default TestComponent;
