import * as z from 'zod';

export const registrationValidator = z.object({
  name: z.string("required name").min(1, {message: "name cannot be empty."}),
  email: z.email("invalid email").min(1, {message: "email cannot be empty."}), // unique
  password: z.string("required password").min(8, {message: "password must be at least 8 characters"})
})

export const loginValidator = z.object({
  email: z.email("required email").min(1, {message: "required email"}), // unique
  password: z.string("required password").min(1, {message: "required password"})
})