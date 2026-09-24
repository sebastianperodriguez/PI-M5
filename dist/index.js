import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './utils/server.js';
import { logger } from './utils/logging.js';
async function main() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('GitHub MCP Server running on stdio');
}
main().catch((error) => {
    logger.error(`Fatal error in main(): ${error}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map