import { EnvironmentHandler } from "./environment";

let lastError: string | undefined = undefined;

interface IErrorsKit {
  throwError: (error: string) => void;
  lastError?: string;
}

// We need to use a wrapper function to deal with tests
// since the hooks render API cannot bubble the error

export const ErrorsKit = (): IErrorsKit => {
  const env = EnvironmentHandler().env;
  const throwError = (error: string) => {
    switch (env) {
      case "test":
        lastError = error;
        break;
      case "default":
        throw Error(error);
      default:
        throw Error(`Unknown environment: ${env}`);
    }
  };
  return {
    throwError,
    lastError,
  };
};
