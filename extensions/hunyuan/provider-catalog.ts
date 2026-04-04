import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-models";
import {
  buildHunyuanModelDefinition,
  HUNYUAN_BASE_URL,
  HUNYUAN_MODEL_CATALOG,
} from "./models.js";

export function buildHunyuanProvider(): ModelProviderConfig {
  return {
    baseUrl: HUNYUAN_BASE_URL,
    api: "openai-completions",
    models: HUNYUAN_MODEL_CATALOG.map(buildHunyuanModelDefinition),
  };
}
