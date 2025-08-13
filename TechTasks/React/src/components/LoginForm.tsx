// Task Description:
// Create a React component using TypeScript that implements a simple login form.

// The component should have the following functionality:

// Form Inputs: Include input fields for email and password.
// Validation on Submit: When the "Login" button is clicked:

// Check if the email is in a valid format (basic regex like containing '@' and a domain).
// Check if the password is at least 6 characters long.
// Display error messages below each invalid field if validation fails.

// Success Message: If validation passes, display a success message like "Login successful!" instead of the form.
// Reset Form: After successful login, the form should be cleared (though hidden).

// Requirements:

// Use React with TypeScript.
// Manage form state and errors using component state.
// Use controlled inputs for email and password.
// No external libraries; keep it vanilla React.
// The component should be styled minimally (basic CSS for clarity, e.g., red text for errors).
// The solution should be functional within a 15-minute timeframe.

// Instructions:

// Write the code for the LoginForm component in a single file.
// Assume you have React and TypeScript already set up (no need for imports or setup code outside the component).

import { useState, type ChangeEvent, type FormEvent } from "react";

interface FormState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
}

export const LoginForm = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Error`]: "", // Clear error on change
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { email, password } = formState;

    const emailRegex = /.+@.+\..+/; // Basic email validation
    const newFormState: FormState = {
      email,
      password,
      emailError: emailRegex.test(email)
        ? ""
        : 'Email should contain "@" symbol and domain',
      passwordError:
        password.length >= 6
          ? ""
          : "Password length should be at least 6 symbols",
    };

    setFormState(newFormState);

    if (!newFormState.emailError && !newFormState.passwordError) {
      setIsLogged(true);
      setFormState({
        email: "",
        password: "",
        emailError: "",
        passwordError: "",
      });
    }
  };

  if (isLogged) {
    return <div style={{ color: "green" }}>Login successful!</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate={true}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formState.email}
          name="email"
          onChange={handleChange}
        />
        {formState.emailError && (
          <div style={{ color: "red", fontSize: "12px" }}>
            {formState.emailError}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formState.password}
          name="password"
          onChange={handleChange}
        />
        {formState.passwordError && (
          <div style={{ color: "red", fontSize: "12px" }}>
            {formState.passwordError}
          </div>
        )}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
