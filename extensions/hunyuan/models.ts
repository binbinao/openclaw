import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-models";

export const HUNYUAN_BASE_URL = "https://api.hunyuan.cloud.tencent.com/v1";

const DEFAULT_CONTEXT_WINDOW = 128000;
const DEFAULT_MAX_TOKENS = 8192;

const HUNYUAN_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

export const HUNYUAN_MODEL_CATALOG: ModelDefinitionConfig[] = [
  {
    id: "hunyuan-2.0-instruct-20251111",
    name: "Hunyuan 2.0 Instruct",
    reasoning: false,
    input: ["text"],
    cost: HUNYUAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 8192,
  },
  {
    id: "hunyuan-turbo",
    name: "Hunyuan Turbo",
    reasoning: false,
    input: ["text"],
    cost: HUNYUAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 8192,
  },
];

export function buildHunyuanModelDefinition(
  model: (typeof HUNYUAN_MODEL_CATALOG)[number],
): ModelDefinitionConfig {
  return {
    ...model,
    api: "openai-completions",
  };
}
