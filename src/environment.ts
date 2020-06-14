import { Environment } from "./types";

let env: Environment = "default";

interface IEnvironment {
  env: Environment;
  setEnv: (env: Environment) => void;
}

export const EnvironmentHandler = (): IEnvironment => {
  return {
    env,
    setEnv: (newEnv: Environment) => (env = newEnv),
  };
};
