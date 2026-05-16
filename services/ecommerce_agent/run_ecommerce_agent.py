from agents import Agent, Runner, set_tracing_disabled
from services.ecommerce_agent.llm import get_openai_model
from services.ecommerce_agent.tools import run_sql_query
from services.ecommerce_agent.prompts import SQL_AGENT_PROMPT
from services.ecommerce_agent.sandbox_mcp import sandbox_mcp


set_tracing_disabled(True)


async def run_ecommerce_agent(user_input: str):
    sandbox_mcp_obj = await sandbox_mcp()
    agent = Agent(
        name="EcommerceAgent",
        instructions=SQL_AGENT_PROMPT,
        tools=[run_sql_query],
        mcp_servers=[sandbox_mcp_obj],
        model=get_openai_model()
    )
    print("Executing agent...")
    result = await Runner.run(agent, user_input)
    print("Execution complete")
    return result.final_output

