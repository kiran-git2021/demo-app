import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "../css/login.css";
import { loginUser } from "@/components/APIs/authAPI";

export default function Login({ setToken }) {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
//   const[setToken] = userState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(identifier, password);
      if (data.status === "success") {
//         setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setError("");
        navigate("/home"); // redirect to home
      } else {
        setError("Authentication failed");
      }
    } catch (err) {
      setError(err.message || "Login error");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email or username below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="identifier">Email or Username</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter email or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <CardFooter className="flex-col gap-2 mt-4 px-0">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
      <footer id="page-footer">
        © 2025 IoTFlow. All rights reserved. | Privacy Policy | Terms of Service
      </footer>
    </>
  );
}
