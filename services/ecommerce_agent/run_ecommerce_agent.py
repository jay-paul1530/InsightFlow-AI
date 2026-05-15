from agents import Agent, Runner, set_tracing_disabled
from services.ecommerce_agent.llm import get_openai_model
from services.ecommerce_agent.tools import run_sql_query
from services.ecommerce_agent.prompts import SQL_AGENT_PROMPT


set_tracing_disabled(True)


async def run_ecommerce_agent(user_input: str):
    agent = Agent(
        name="EcommerceAgent",
        instructions=SQL_AGENT_PROMPT,
        tools=[run_sql_query],
        model=get_openai_model()
    )
    result = await Runner.run(agent, user_input)
    return result.final_output

