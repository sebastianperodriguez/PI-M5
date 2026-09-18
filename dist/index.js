import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/register.js';
const server = new McpServer({
    name: 'github-mcp-server',
    version: '1.0.0',
});
registerTools(server);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map