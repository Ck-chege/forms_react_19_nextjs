"use server";
import { ProfileSchema, ProfileValue } from '@/lib/validations';
import { revalidatePath } from 'next/cache';



// Response structure for form submissions
export interface ActionResponse {
  success: boolean;      // Indicates if the operation was successful
  message: string;       // Human-readable message about the result
  errors?: {            // Optional validation errors
    [K in keyof ProfileValue]?: string[];  // Maps field names to arrays of error messages
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs?: any;
}



export async function submitProfile(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {

    const data = Object.fromEntries(formData.entries());

    // Validate the form data
    const validatedData = ProfileSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: data
      }
    }

    // Here you would typically save the address to your database
    console.log('Address submitted:', validatedData.data)

    return {
      success: true,
      message: 'Address saved successfully!',
    }
  } catch (error) {
    return {
      success: false,
      message: `Profile submission error: ${error}`,
    }
  }
  finally {
    revalidatePath('/')
  }
}

