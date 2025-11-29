import * as z from 'zod';

export const registrationValidator = z.object({
  name: z.string("name is required").min(1, {message: "name cannot be empty."}),
  email: z.email("invalid email").min(1, {message: "email cannot be empty."}), // unique
  password: z.string("password is required").min(8, {message: "password must be at least 8 characters"})
})