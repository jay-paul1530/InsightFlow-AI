from agents import Agent, Runner, set_tracing_disabled
from services.ecommerce_agent.llm import get_openai_model
from services.ecommerce_agent.tools import run_sql_query
from services.ecommerce_agent.prompts import SQL_AGENT_PROMPT
from services.ecommerce_agent.sandbox_mcp import sandbox_mcp
from rich.console import Console
from datetime import datetime


console = Console()


set_tracing_disabled(True)


async def run_ecommerce_agent(user_input: str):
    # sandbox_mcp_obj = await sandbox_mcp()
    agent = Agent(
        name="EcommerceAgent",
        instructions=SQL_AGENT_PROMPT.format(current_date=datetime.now().strftime("%Y-%m-%d")),
        tools=[run_sql_query],
        # mcp_servers=[sandbox_mcp_obj],
        model=get_openai_model()
    )
    # try:
    console.print("[bold yellow]Executing agent...[/bold yellow]")
    result = await Runner.run(agent, user_input)
    console.print("[bold yellow]Execution complete[/bold yellow]")
    return result.final_output
    # finally:
        # pass
        # if sandbox_mcp_obj:
        #     await sandbox_mcp_obj.cleanup()

