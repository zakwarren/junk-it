import { useState, ReactElement } from "react";
import axios from "axios";

interface ValidationError {
  message: string;
  field?: string;
}

interface Request {
  url: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  body?: object;
  onSuccess?(data: any): any;
}

export const useRequest = ({ url, method, body, onSuccess }: Request) => {
  const [errors, setErrors] = useState<ReactElement>(null);

  const doRequest = async () => {
    try {
      setErrors(null);

      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errors: ValidationError[] = err?.response?.data?.errors || [];
      setErrors(
        <div className="alert alert-danger">
          <h4>Something went wrong...</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
