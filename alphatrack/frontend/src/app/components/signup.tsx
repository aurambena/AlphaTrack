"use client"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "./FormInput";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

  
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "should be at least 8 characters"),
    confirmPassword: z.string().min(8, "should be at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>; 


export default function SignupForm() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })
  
   const onSubmit = async (data: RegisterFormData) => {

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", data);
      alert("User created")
      router.push("/dashboard");
    } catch (error) {
      console.error(error)
      if (error instanceof Error)
        alert(error.message || "Error en el registro")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-80 mt-40 m-auto p-6 text-2xl">
        <FormInput label='Name'  register={register("name")} />
        <FormInput label='Email'  register={register("email")} error={formState.errors.email?.message} />
        <FormInput label='Password' type="password" register={register("password")} error={formState.errors.password?.message} />
        <FormInput label='Confirm Password' type="password" register={register("confirmPassword")} error={formState.errors.confirmPassword?.message} />
      <button  disabled={formState.isSubmitting} type="submit" className="bg-white text-black  hover:bg-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer text-xl">
        Sign up
      </button>
    </form>
  );
}
