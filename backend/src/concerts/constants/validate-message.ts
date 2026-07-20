export const VALIDATE_MESSAGE = {
  name: {
    required: 'name is required',
    string: 'name must be a string',
    tooLong: 'name is too long',
  },
  description: {
    required: 'description is required',
    string: 'description must be a string',
    tooLong: 'description is too long',
  },
  totalSeats: {
    integer: 'totalSeats must be an integer',
    min: 'totalSeats must be at least 1',
  },
} as const;
