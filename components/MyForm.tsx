"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useRef, useEffect, startTransition } from "react";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Upload, User2 } from "lucide-react";
import { ActionResponse, submitProfile } from "@/actions/submitData";
import { ProfileValue } from "@/lib/validations";
import { ProfileSchema } from "@/lib/validations";
import { toast } from "sonner";







const initialState: ActionResponse = {
  success: false,
  message: '',
}

interface MyFormProps {
  profileData: ProfileValue;
}

export default function MyForm({profileData}: MyFormProps) {

  const [state, action, isPending] = useActionState(submitProfile, initialState)
  console.log(isPending)


  useEffect(() => {
    if(state.success) {
      toast.success(state.message)
    }else if(state.errors){
      toast.error(state.message)
    }
  }, [state])


  



  const form = useForm<ProfileValue>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: profileData,
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const imageValue = form.watch("image");

  const renderImagePreview = () => {
    if (!imageValue) {
      return (
        <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full">
          <User2 className="w-12 h-12 text-gray-400" />
        </div>
      );
    }
    return (
      <Image
        src={
          typeof imageValue === "string"
            ? imageValue
            : URL.createObjectURL(imageValue)
        }
        alt="Team member photo"
        className="object-cover w-24 h-24 rounded-full"
        width={96}
        height={96}
      />
    );
  };

  const { isDirty, isSubmitting } = form.formState;

  
   // Revised onSubmit handler
  const onSubmit = async (data: ProfileValue) => {
    const isValid = await form.trigger();
    if (!isValid) return;
    
    // Create FormData from the form values
    const formData = new FormData();
    
    // Append each field to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
    // Call the action with FormData
    startTransition(async () => {
      action(formData);
    })
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8 mb-8 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-4">
          {renderImagePreview()}
          <div>
            <CardTitle className="text-2xl font-bold">{profileData.name}</CardTitle>
            <CardDescription className="mt-1">
              Update your profile information and social media links
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Profile Photo</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Input
                            {...field}
                            type="file"
                            accept="image/*"
                            value={undefined}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file || profileData.image || null);
                            }}
                            ref={photoInputRef}
                            className="w-full cursor-pointer"
                          />
                          <Upload className="absolute right-2 top-2 w-5 h-5 text-gray-500" />
                        </div>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            field.onChange(
                              typeof profileData.image === "string"
                                ? profileData.image
                                : null
                            );
                            if (photoInputRef.current)
                              photoInputRef.current.value = "";
                          }}
                          className="shrink-0"
                        >
                          Reset
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <Separator className="mb-4" />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Senior Developer" className="max-w-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your bio here"
                          className="max-w-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Social Media</h3>
              <Separator className="mb-4" />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="facebook.com/username"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="twitter.com/username"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="linkedin.com/in/username"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          {isDirty && (
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="px-8"
                  disabled={isSubmitting || isPending}
                >
                  {(isSubmitting || isPending) ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}