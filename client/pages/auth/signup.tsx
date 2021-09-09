import { useState, FormEvent } from "react";
import axios from "axios";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSumbit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await axios.post("/api/users/signup", { email, password });
    console.log(response.data);
  };

  return (
    <form onSubmit={onSumbit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-control"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default signup;
