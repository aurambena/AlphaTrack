"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "./FormInput";
import { useForm } from "react-hook-form";

  const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "password needed"),
})

type RegisterFormData = z.infer<typeof registerSchema>; 

export default function LoginForm() {
   const router = useRouter();
   const { setIsLoggedIn } = useAuth();

    const { register, handleSubmit, formState } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema)
    })
    
    
    const onSubmit = async (data: RegisterFormData) => {
    
        try {
          const token = localStorage.getItem("accessToken");

          const res = await axios.post("http://localhost:5000/api/users/login", data, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true, // for cookie auth if used
        });

        if (process.env.NODE_ENV === "development") {
          // Store tokens locally for dev
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          setIsLoggedIn(true);
        }
    
        router.push("/dashboard");

        } catch (error) {
          if (error instanceof Error)
            alert("Something when wrong")
        }
      }


   return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-80 mt-40 m-auto p-6 text-2xl">
        <FormInput label='Email'  register={register("email")} error={formState.errors.email?.message} />
        <FormInput label='Password' type="password" register={register("password")} error={formState.errors.password?.message} />
      <button  disabled={formState.isSubmitting} type="submit" className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl">
        Sign in
      </button>
    </form>
    </div>
  );
}

