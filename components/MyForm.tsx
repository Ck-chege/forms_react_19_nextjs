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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useRef, useEffect, startTransition, useState } from "react";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Upload, User2, Building2, Briefcase, AtSign } from "lucide-react";
import { ActionResponse, submitProfile } from "@/actions/submitData";
import { ProfileValue } from "@/lib/validations";
import { ProfileSchema } from "@/lib/validations";
import { toast } from "sonner";

const initialState: ActionResponse = {
  success: false,
  message: '',
};

interface MyFormProps {
  profileData: ProfileValue;
}

export default function MyForm({profileData}: MyFormProps) {
  const [state, action, isPending] = useActionState(submitProfile, initialState);
  const [defaultValues, setDefaultValues] = useState<ProfileValue | undefined>(profileData);


  const form = useForm<ProfileValue>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: defaultValues ,
  });

  useEffect(() => {
    if(state.success) {
      toast.success(state.message);
      setDefaultValues(state.inputs);
    } else if(state.errors) {
      toast.error(state.message);
    }
  }, [state]);

 

  const photoInputRef = useRef<HTMLInputElement>(null);
  const imageValue = form.watch("image");

  const renderImagePreview = () => {
    if (!imageValue) {
      return (
        <div className="relative group">
          <div className="flex items-center justify-center w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full">
            <User2 className="w-20 h-20 text-gray-400" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-8 h-8 text-white" />
          </div>
        </div>
      );
    }
    return (
      <div className="relative group">
        <Image
          src={typeof imageValue === "string" ? imageValue : URL.createObjectURL(imageValue)}
          alt="Team member photo"
          className="object-cover w-40 h-40 rounded-full ring-4 ring-white shadow-lg"
          width={160}
          height={160}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload className="w-8 h-8 text-white" />
        </div>
      </div>
    );
  };

  const { isDirty, isSubmitting } = form.formState;

  const onSubmit = async (data: ProfileValue) => {
    const isValid = await form.trigger();
    if (!isValid) return;
    
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
    startTransition(async () => {
      action(formData);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <Card className="max-w-6xl mx-auto shadow-xl bg-white">
        <CardHeader className="pb-8 pt-10 px-10 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              {renderImagePreview()}
            </div>
            <div className="space-y-2 text-center md:text-left">
              <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                {profileData.name}
              </CardTitle>
              <CardDescription className="text-xl text-gray-600 max-w-2xl">
                Complete your profile information to help us personalize your experience
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <CardContent className="grid gap-12 p-10">
              {/* Profile Photo Section */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-flex items-center text-lg font-semibold gap-2 text-gray-900 mb-4">
                        <User2 className="w-5 h-5" />
                        Profile Photo
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1 max-w-md group">
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
                              className="w-full cursor-pointer py-3 px-4 border-2 border-dashed rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 hover:bg-gray-50 transition-colors"
                            />
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
                            className="shrink-0 h-12 px-6 text-gray-600 border-2 hover:bg-gray-50"
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

              {/* About Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                  <h3 className="text-2xl font-semibold text-gray-900">Professional Info</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-8 pl-9">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g. Senior Developer" 
                            className="h-12 px-4 max-w-xl border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                          />
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
                        <FormLabel className="text-gray-700 font-medium">Bio</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Tell us about yourself"
                            className="h-12 px-4 max-w-2xl border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-gray-400" />
                  <h3 className="text-2xl font-semibold text-gray-900">Location</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="grid md:grid-cols-2 gap-8 pl-9">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Street Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter your street address" 
                              className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="apartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Apartment/Suite</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Apt, Suite, etc. (optional)" 
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">City</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter your city" 
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">State/Province</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter your state" 
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">ZIP/Postal Code</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter ZIP code" 
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Country</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter your country" 
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <AtSign className="w-6 h-6 text-gray-400" />
                  <h3 className="text-2xl font-semibold text-gray-900">Social Profiles</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 pl-9">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                          <Facebook className="w-5 h-5" />
                          Facebook
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Facebook profile"
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200 group-hover:border-blue-100"
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
                      <FormItem className="group">
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-sky-500 transition-colors">
                          <Twitter className="w-5 h-5" />
                          Twitter
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Twitter handle"
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200 group-hover:border-sky-100"
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
                      <FormItem className="group">
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                          <Linkedin className="w-5 h-5" />
                          LinkedIn
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your LinkedIn profile"
                            className="h-12 px-4 border-gray-200 focus:border-gray-300 focus:ring-gray-200 group-hover:border-blue-100"
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
              <div className="sticky bottom-0 p-6 bg-white border-t shadow-[0_-1px_12px_rgba(0,0,0,0.05)]">
                <div className="flex justify-end max-w-6xl mx-auto">
                  <Button 
                    type="submit" 
                    className="h-12 px-8 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
                    disabled={isSubmitting || isPending}
                  >
                    {(isSubmitting || isPending) ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Changes...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  )
}