export const VALIDATE_MESSAGE = {
  email: {
    required: 'email is required',
    invalid: 'email must be a valid email address',
  },
  password: {
    required: 'password is required',
    string: 'password must be a string',
    minLength: 'password must be at least 8 characters',
  },
} as const;
