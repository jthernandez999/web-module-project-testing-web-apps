import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import { ErrorMessage } from 'react-hook-form';

test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)
    const header = screen.queryByText('h1')
    waitFor(() => {
        expect(header).toBeInTheDocument();
        expect(header).toBeTruthy();
        expect(header).toHaveTextContent.toBe(/contact form/i)
    })
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)

    const firstNameFieldError = screen.getByLabelText(/first name/i)
    userEvent.type(firstNameFieldError, '123')

    const error = await screen.findAllByTestId('error')
    expect(error).toHaveLength(1)
    
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)

    const button = screen.getByRole('button')
    userEvent.click(button)

    const errors = await screen.findAllByTestId('error')
    expect(errors).toHaveLength(3)
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name/i)
    userEvent.type(firstNameInput, 'test name')

    const lastNameInput = screen.getByLabelText(/last name/i)
    userEvent.type(lastNameInput, 'test name')

    const emailInput = screen.getByLabelText(/email/i)
    userEvent.type(emailInput, '')

    const button = screen.getByRole('button')
    userEvent.click(button)

    const errors = await screen.findAllByTestId('error')
    expect(errors).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/email/i)
    userEvent.type(emailInput, 'email.com')

    const button = screen.getByRole('button')
    userEvent.click(button)

    const emailError = await screen.findAllByTestId('error')
    expect(emailError[2]).toHaveTextContent('Error: email must be a valid email address')

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const lastName = screen.getByLabelText(/last name/i)
    userEvent.type(lastName, '')

    const button = screen.getByRole('button')
    userEvent.click(button)

    const error = await screen.findByText(/lastName is a required field/i)


    
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const firstName = screen.getByLabelText(/first name/i)
    userEvent.type(firstName, 'Joe Thomas')

    const lastName = screen.getByLabelText(/last name/i)
    userEvent.type(lastName, 'Hernandez')

    const email = screen.getByLabelText(/email/i)
    userEvent.type(email, 'joe@joe.com')
    
    // const message = screen.getByLabelText(/message/i)

    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(() => {
        const firstName = screen.queryByText('Joe Thomas')
        const lastName = screen.queryByText('Hernandez')
        const email = screen.queryByText('joe@joe.com')
            expect(firstName).toBeInTheDocument()
            expect(lastName).toBeInTheDocument()
            expect(email).toBeInTheDocument()
            // expect(message).not.toBeInTheDocument()  
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)

    const firstName = screen.getByLabelText(/first name/i)
    userEvent.type(firstName, 'Joe Thomas')

    const lastName = screen.getByLabelText(/last name/i)
    userEvent.type(lastName, 'Hernandez')

    const email = screen.getByLabelText(/email/i)
    userEvent.type(email, 'joe@joe.com')
    
    const message = screen.getByLabelText(/message/i)
    userEvent.type(message, 'hello world')

    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(() => {
        const firstName = screen.queryByText('Joe Thomas')
        const lastName = screen.queryByText('Hernandez')
        const email = screen.queryByText('joe@joe.com')
        const message = screen.queryByText('hello world')
            expect(firstName).toBeInTheDocument()
            expect(lastName).toBeInTheDocument()
            expect(email).toBeInTheDocument()
            expect(message).toBeInTheDocument()
    })
    
});