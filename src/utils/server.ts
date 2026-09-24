import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../tools/register.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'github-mcp-server',
    version: '1.0.0',
  });

  registerTools(server);

  return server;
}