import React, { useState } from "react";
import { MCPClient } from "huggingface_mcp";
const client = new MCPClient({ host: "http://localhost:8000" });

export default function MCPDemo() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [platform, setPlatform] = useState("instagram");
  const [content, setContent] = useState("");
  const [datetime, setDatetime] = useState("");
  const [postId, setPostId] = useState("");
  const [sinceDate, setSinceDate] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [theme, setTheme] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");

  async function callTool(tool, params) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await client.call(tool, params);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, background: "#f9fafb", borderRadius: 12 }}>
      <h2>MCP Demo</h2>
      <h3>Schedule Post</h3>
      <form onSubmit={e => { e.preventDefault(); callTool("schedule_post", { platform, content, datetime }); }}>
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="x">X</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
        <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} />
        <button type="submit">Schedule</button>
      </form>
      <h3>Get Metrics</h3>
      <form onSubmit={e => { e.preventDefault(); callTool("get_metrics", { platform, post_id: postId, since_date: sinceDate }); }}>
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="x">X</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <input value={postId} onChange={e => setPostId(e.target.value)} placeholder="Post ID" />
        <input type="date" value={sinceDate} onChange={e => setSinceDate(e.target.value)} />
        <button type="submit">Get Metrics</button>
      </form>
      <h3>List Events</h3>
      <form onSubmit={e => { e.preventDefault(); callTool("list_events", { calendar_id: calendarId, date_range: dateRange }); }}>
        <input value={calendarId} onChange={e => setCalendarId(e.target.value)} placeholder="Calendar ID" />
        <input value={dateRange} onChange={e => setDateRange(e.target.value)} placeholder="Date Range" />
        <button type="submit">List Events</button>
      </form>
      <h3>Generate Caption</h3>
      <form onSubmit={e => { e.preventDefault(); callTool("generate_caption", { image_url: imageUrl, theme }); }}>
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" />
        <input value={theme} onChange={e => setTheme(e.target.value)} placeholder="Theme" />
        <button type="submit">Generate Caption</button>
      </form>
      <h3>Upload Asset</h3>
      <form onSubmit={e => { e.preventDefault(); callTool("upload_asset", { file, tags: tags.split(",").map(t => t.trim()) }); }}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
        <button type="submit">Upload</button>
      </form>
      <h3>List Assets</h3>
      <form onSubmit={e => { e.preventDefault(); callTool("list_assets", { tags: tags.split(",").map(t => t.trim()) }); }}>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
        <button type="submit">List Assets</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && <pre style={{ background: "#222", color: "#fff", padding: 12, borderRadius: 8 }}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
} 