import { API_ENDPOINT } from "@/constants/api-endpoint";
import { LoginData, LoginFormData } from "@/types/login";
import { SignupData, SignupFormData } from "@/types/signup";

export class Auth {
  async signup(signupData: SignupFormData): Promise<SignupData> {
    const response = await fetch(`${API_ENDPOINT}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });
    const data = await response.json();
    return data;
  }
  async login(loginData: LoginFormData): Promise<LoginData> {
    const response = await fetch(`${API_ENDPOINT}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    const data = await response.json();
    return data;
  }

  async logout() {
    console.log("Logging out...");
  }
}