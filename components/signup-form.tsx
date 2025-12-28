"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"
import GoogleOAuthButton from "./features/google-oauth-button"
import { Loader2 } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { register, error, clearError } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "guest",
    },
  })

  async function onSubmit(data: SignupFormData) {
    try {
      setIsLoading(true)
      clearError()
      await register({
        email: data.email,
        password: data.password,
        role: data.role,
      })
      router.push("/dashboard")
    } catch (err) {
      // Error is handled by the store
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Buat Akun Baru</CardTitle>
          <CardDescription>
            Daftar untuk mulai membuat atau menghadiri event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <GoogleOAuthButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Atau daftar dengan email
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">


                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daftar sebagai</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={field.value === "guest" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => field.onChange("guest")}
                          disabled={isLoading}
                        >
                          Guest
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "organizer" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => field.onChange("organizer")}
                          disabled={isLoading}
                        >
                          Organizer
                        </Button>
                      </div>
                      <FormDescription className="text-xs">
                        {field.value === "organizer"
                          ? "Buat dan kelola event kamu sendiri"
                          : "Temukan dan hadiri event menarik"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Buat Akun
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <a
                href="/signin"
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-xs text-muted-foreground">
        Dengan mendaftar, kamu menyetujui{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          Syarat & Ketentuan
        </a>{" "}
        dan{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Kebijakan Privasi
        </a>
        .
      </p>
    </div>
  )
}
