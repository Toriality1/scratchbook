import { str, cleanEnv, port } from "envalid";

const DEFAULT_PORT = 5000;

export default cleanEnv(process.env, {
  PORT: port({ default: DEFAULT_PORT }),
  CLIENT_URL: str(),
  JWT_SECRET: str(),
  ATLAS_URI: str(),
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "test"],
  }),
});
