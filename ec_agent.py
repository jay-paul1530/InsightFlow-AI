import asyncio
from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent


if __name__ == "__main__":
    user_input = "Give me top 5 orders for unit price above 250"
    response = asyncio.run(run_ecommerce_agent(user_input))
    print("AI Response:", response)
