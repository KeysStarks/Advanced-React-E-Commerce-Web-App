import { useState, type SyntheticEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { createUserProfile } from "../api/usersApi";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

    const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfile(credential.user.uid, credential.user.email ?? email);
            setSuccess("Registration successful! You can now log in.");
            setEmail("");
            setPassword("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Registration failed.");
            }
        }
    };

    return (
        <form onSubmit={handleRegister} className="auth-form">
          <h3>Register</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit">Register</button>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
        </form>
    );
};

export default Register;
