import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "../../components/Header";

export default function Member() {
  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <div className="flex w-full items-stretch items-center justify-center gap-4">
        <Card className="w-full max-w-sm ">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Enter your details to create yourself as a new member in the
              database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" required />

                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" required />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full max-w-sm ">
          <CardHeader>
            <CardTitle>Profile Management</CardTitle>
            <CardDescription>Update your details/fitness goals</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" required />

                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" required />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
