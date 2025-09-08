import { str, cleanEnv, port } from "envalid";
import { config } from "dotenv";

const DEFAULT_PORT = 5000;
const DEFAULT_ENV = "development";
const ENV_CHOICES = ["development", "production", "test"];

config()

export default cleanEnv(process.env, {
  PORT: port({ default: DEFAULT_PORT }),
  CLIENT_URL: str(),
  JWT_SECRET: str(),
  ATLAS_URI: str(),
  NODE_ENV: str({
    default: DEFAULT_ENV,
    choices: ENV_CHOICES,
  }),
});
