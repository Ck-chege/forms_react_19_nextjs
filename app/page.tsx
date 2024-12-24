import MyForm from "@/components/MyForm";
import { ProfileValue } from "@/lib/validations";


export default function Home() {
  
  const profileData: ProfileValue = {
    // Personal Information
    id: "user123",
    name: "Jane Smith",
    role: "Software Engineer",
    image: "https://picsum.photos/200/300",
    linkedin: "https://linkedin.com/in/janesmith",
    twitter: "https://twitter.com/janesmith",
    facebook: "https://facebook.com/janesmith",
    bio: "Passionate software engineer with 5+ years of experience in full-stack development.",

    // Address Information
    streetAddress: "123 Tech Street",
    apartment: "Apt 4B",
    city: "San Francisco",
    state: "California",
    zipCode: "94105",
    country: "United States"
}; 

 

  return (
    <div className="min-h-screen flex items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <MyForm profileData={profileData} />
    </div>
  );
}



