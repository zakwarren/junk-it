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
        <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-yellow-500">
          <h4>Something went wrong...</h4>
          <ul className="list-disc">
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
