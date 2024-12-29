import { toast } from "react-toastify";

type ToastHandlerOptions = {
  status: number; // HTTP status code
  message?: string; // Optional custom message
};

export function handleToast({ status, message }: ToastHandlerOptions) {
  switch (status) {
    case 200:
    case 201:
      toast.success(message || "Request succeeded!");
      break;
    case 400:
      toast.error(message || "Bad request. Please check your input.");
      break;
    case 401:
      toast.error(message || "Unauthorized. Please check your credentials.");
      break;
    case 403:
      toast.error(message || "Forbidden. You don't have permission.");
      break;
    case 404:
      toast.error(message || "Not found. The resource is missing.");
      break;
    case 409:
      toast.error(message || "Conflict. Resource already exists.");
      break;
    case 500:
      toast.error(message || "Server error. Please try again later.");
      break;
    default:
      toast.info(message || `Unexpected response: ${status}`);
      break;
  }
}
