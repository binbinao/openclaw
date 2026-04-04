import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyHunyuanConfig, HUNYUAN_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildHunyuanProvider } from "./provider-catalog.js";

const PROVIDER_ID = "hunyuan";

export default defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "Hunyuan Provider",
  description: "Bundled Hunyuan provider plugin",
  provider: {
    label: "Hunyuan",
    docsPath: "/providers/hunyuan",
    auth: [
      {
        methodId: "api-key",
        label: "Hunyuan API key",
        hint: "API key",
        optionKey: "hunyuanApiKey",
        flagName: "--hunyuan-api-key",
        envVar: "HUNYUAN_API_KEY",
        promptMessage: "Enter Hunyuan API key",
        defaultModel: HUNYUAN_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyHunyuanConfig(cfg),
        wizard: {
          choiceId: "hunyuan-api-key",
          choiceLabel: "Hunyuan API key",
          groupId: "hunyuan",
          groupLabel: "Hunyuan",
          groupHint: "API key",
        },
      },
    ],
    catalog: {
      buildProvider: buildHunyuanProvider,
    },
  },
});