// Hunyuan 提供商辅助函数和配置
// 注意：这是一个简化的实现，实际的 provider 注册需要通过 OpenClaw 的插件系统进行

export interface HunyuanConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 调用混元 API 的核心函数
 */
export async function callHunyuanAPI(request: {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  apiKey: string;
  baseUrl?: string;
}) {
  const {
    messages,
    model = "hunyuan-turbo",
    temperature = 0.7,
    max_tokens = 2048,
    stream = false,
    apiKey,
    baseUrl = "https://api.hunyuan.cloud.tencent.com",
  } = request;

  if (!apiKey) {
    throw new Error("HUNYUAN_API_KEY environment variable is required");
  }

  const hunyuanRequest = {
    model,
    messages,
    temperature,
    max_tokens,
    stream,
  };

  const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hunyuanRequest),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Hunyuan API error (${resp.status}): ${errorText}`);
  }

  return resp.json();
}

/**
 * 流式调用混元 API
 */
export async function* callHunyuanAPIStream(request: {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  apiKey: string;
  baseUrl?: string;
}) {
  const {
    messages,
    model = "hunyuan-turbo",
    temperature = 0.7,
    max_tokens = 2048,
    apiKey,
    baseUrl = "https://api.hunyuan.cloud.tencent.com",
  } = request;

  if (!apiKey) {
    throw new Error("HUNYUAN_API_KEY environment variable is required");
  }

  const hunyuanRequest = {
    model,
    messages,
    temperature,
    max_tokens,
    stream: true,
  };

  const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hunyuanRequest),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Hunyuan API error (${resp.status}): ${errorText}`);
  }

  if (!resp.body) {
    throw new Error("No response body for streaming");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;

          try {
            yield JSON.parse(data);
          } catch (e) {
            console.warn("Failed to parse SSE data:", data);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// 导出默认配置
export const defaultHunyuanConfig = {
  baseUrl: "https://api.hunyuan.cloud.tencent.com",
  model: "hunyuan-turbo",
  temperature: 0.7,
  maxTokens: 2048,
};

// 这个文件提供了基础的 API 调用函数
// 实际的 provider 注册需要在 OpenClaw 的插件注册系统中进行
// 具体实现可以参考 src/plugins/ 目录下的其他 provider 实现
