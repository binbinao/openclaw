import {
  createDefaultModelPresetAppliers,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import { HUNYUAN_BASE_URL } from "./models.js";
import { buildHunyuanProvider } from "./provider-catalog.js";

export const HUNYUAN_DEFAULT_MODEL_ID = "hunyuan-2.0-instruct-20251111";
export const HUNYUAN_DEFAULT_MODEL_REF = `hunyuan/${HUNYUAN_DEFAULT_MODEL_ID}`;

const hunyuanPresetAppliers = createDefaultModelPresetAppliers<[string]>({
  primaryModelRef: HUNYUAN_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OpenClawConfig, baseUrl: string) => {
    const defaultModel = buildHunyuanProvider().models[0];
    if (!defaultModel) {
      return null;
    }

    return {
      providerId: "hunyuan",
      api: "openai-completions",
      baseUrl,
      defaultModel,
      defaultModelId: HUNYUAN_DEFAULT_MODEL_ID,
      aliases: [{ modelRef: HUNYUAN_DEFAULT_MODEL_REF, alias: "Hunyuan" }],
    };
  },
});

export function applyHunyuanConfig(cfg: OpenClawConfig): OpenClawConfig {
  return hunyuanPresetAppliers.applyConfig(cfg, HUNYUAN_BASE_URL);
}
