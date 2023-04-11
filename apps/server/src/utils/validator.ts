import z from 'zod';

export const userSchema = z.object({
  id: z.optional(z.string().cuid()),
  userName: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(80, 'username must be a maximum of 3 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email must be a valid email')
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(70, 'Password must be a maximum of 70 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Email must be a valid email'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters')
    .max(70, 'Password must be a maximum of 70 characters'),
});

export const postSchema = z.object({
  id: z.optional(z.string().cuid()),
  title: z
    .string({
      required_error: 'Title required',
    })
    .min(6, 'Title must be at least 6 characters')
    .max(70, 'Title must be a maximum of 70 characters'),
  content: z
    .string({ required_error: 'Content required' })
    .min(25, 'Content must be at least 25 characters'),
  published: z.boolean().default(false),
  authorId: z
    .string({
      required_error: 'Author id is required',
    })
    .cuid(),
});
