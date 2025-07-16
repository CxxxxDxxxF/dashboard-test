import { MCPClient } from "huggingface_mcp";
const client = new MCPClient({ host: "http://localhost:8000" });

test("schedule Instagram post", async () => {
  const result = await client.call("schedule_post", {
    platform: "instagram",
    content: "Hello from Cursor+MCP!",
    datetime: "2025-07-20T15:00:00Z",
  });
  expect(result.success).toBe(true);
});

test("get metrics", async () => {
  const result = await client.call("get_metrics", {
    platform: "facebook",
    post_id: "123",
    since_date: "2025-07-01",
  });
  expect(result.likes).toBeGreaterThanOrEqual(0);
});

test("list events", async () => {
  const result = await client.call("list_events", {
    calendar_id: "main",
    date_range: "2025-07",
  });
  expect(Array.isArray(result.events)).toBe(true);
});

test("generate caption", async () => {
  const result = await client.call("generate_caption", {
    image_url: "https://example.com/image.jpg",
    theme: "funny",
  });
  expect(typeof result.caption).toBe("string");
});

test("upload asset", async () => {
  const result = await client.call("upload_asset", {
    file: "mockfile.jpg",
    tags: ["demo"]
  });
  expect(result.asset_id).toBeDefined();
  expect(result.url).toMatch(/^http/);
});

test("list assets", async () => {
  const result = await client.call("list_assets", {
    tags: ["demo"]
  });
  expect(Array.isArray(result.assets)).toBe(true);
}); 