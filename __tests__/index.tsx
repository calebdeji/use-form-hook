import React from 'react';
import TestComponent from '../src/TestComponent';
import { render, fireEvent, screen } from '@testing-library/react';

describe('Use Form Component Test', () => {
    it('input field should respond to onChange event', () => {
        const { getByLabelText } = render(<TestComponent />);
        const input = getByLabelText('name');
        fireEvent.change(input, { target: { value: 'test', id: 'name' } });
        expect((input as HTMLInputElement).value).toBe('test');
    });
    it('should update error objects if field is required but not filled', () => {
        const { getByLabelText } = render(<TestComponent />);
        const form = getByLabelText('form');

        fireEvent.submit(form);
        const errorSpanName = getByLabelText('name-error');

        expect(errorSpanName).toBeTruthy();
    });
    it('should update error objects if validation function returns false', () => {
        const { getByLabelText } = render(<TestComponent />);
        const form = getByLabelText('form');
        const occupationInput = getByLabelText('occupation');
        fireEvent.change(occupationInput, { target: { value: 'baed', id: 'occupation' } });

        fireEvent.submit(form);
        const errorSpanOccupation = getByLabelText('occupation-error');

        expect(errorSpanOccupation).toBeTruthy();
    });
    it("should update error objects if the value doesn't match the validation type", () => {
        const { getByLabelText } = render(<TestComponent />);
        const form = getByLabelText('form');
        const emailInput = getByLabelText('email');
        fireEvent.change(emailInput, { target: { value: 'baed', id: 'email' } });

        fireEvent.submit(form);
        const errorSpanEmail = getByLabelText('email-error');

        expect(errorSpanEmail).toBeTruthy();
    });
});
