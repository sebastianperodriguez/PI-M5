import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../tools/register.js';
export function createServer() {
    const server = new McpServer({
        name: 'github-mcp-server',
        version: '1.0.0',
    });
    registerTools(server);
    return server;
}
//# sourceMappingURL=server.js.map