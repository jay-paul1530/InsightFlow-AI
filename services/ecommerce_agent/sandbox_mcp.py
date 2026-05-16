from agents.mcp import MCPServerSse
from env import MCP_SANDBOX_URL


async def sandbox_mcp():
    print("Getting Sandbox MCP...")
    server = MCPServerSse(
        name="sandbox_mcp",
        params={
           "url": MCP_SANDBOX_URL
        },
        cache_tools_list=False,
        client_session_timeout_seconds=60
    )
    print("Connecting to Sandbox MCP...")
    await server.connect()
    tools_list = await server.list_tools()
    for tool in tools_list:
        print(f"Tool : ", tool.name)

    print("Started MCP server...")
    return server
