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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import GoogleOAuthButton from "./features/google-oauth-button"
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { login, error, clearError } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true)
      clearError()
      await login(data.email, data.password)
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
          <CardTitle className="text-xl">Selamat Datang!</CardTitle>
          <CardDescription>
            Login dengan Email atau akun Google
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
                  Atau lanjut dengan
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="/forgot-password"
                          className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                        >
                          Lupa password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <a
                href="/signup"
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Daftar
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-xs text-muted-foreground">
        Dengan melanjutkan, kamu menyetujui{" "}
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
