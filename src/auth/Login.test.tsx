import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';



jest.mock('../firebaseConfig', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));  

describe('Login', () => {
  test('renders email and password fields', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('updates email and password fields as the user types', async () => {
    render(<Login />);
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'secret123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('secret123');
  });
});