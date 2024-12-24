import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(''))
const stringValue = z.string().trim().min(3, 'Street address is required')



export const ProfileSchema = z.object({



    // Personal Information    
    id: stringValue,
    name: stringValue,
    role: stringValue,
    image: z.custom<File | string>()
    .refine((file) => {
        if (typeof file === 'string') return true; // Allow existing image URLs
        if (!file) return false; // Require file
        return file instanceof File && file.type.startsWith('image/');
    }, "Please upload a valid image file")
    .refine((file) => {
        if (typeof file === 'string') return true;
        if (!file) return false;
        return file.size <= 4 * 1024 * 1024;
    }, "Image must be less than 4MB"),




    linkedin: optionalString,
    twitter: optionalString,
    facebook: optionalString,
    bio: stringValue,




  
    // Address Information
    streetAddress: z.string().min(1, 'Street address is required'),
    apartment: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
    country: z.string().min(1, 'Country is required'),




});

export type ProfileValue = z.infer<typeof ProfileSchema>;


