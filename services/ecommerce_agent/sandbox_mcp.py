from agents.mcp import MCPServerSse
from env import MCP_SANDBOX_URL
from rich.console import Console

console = Console()


async def sandbox_mcp():
    console.print("[dim]Getting Sandbox MCP...[/dim]")
    server = MCPServerSse(
        name="sandbox_mcp",
        params={
           "url": MCP_SANDBOX_URL
        },
        cache_tools_list=False,
        client_session_timeout_seconds=60
    )
    console.print("[dim]Connecting to Sandbox MCP...[/dim]")
    await server.connect()
    tools_list = await server.list_tools()
    tool_names = [tool.name for tool in tools_list]
    console.print(f"[dim]Loaded sandbox tools: {', '.join(tool_names)}[/dim]")

    console.print("[dim]Started MCP server...[/dim]")
    return server
