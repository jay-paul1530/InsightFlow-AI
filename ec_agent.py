import asyncio
from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent


def chatbot():
    while True:
     # user_input = "Give me top 5 orders for unit price above 250, and create graph between unitprice and totalorder"
        user_input = input("User: ")

        # write logic to fetch old messages from weaviate, hybrid search
        # very_old_messages = ""

        # last 5 msg appened in list
        # last_5_messages = ""
        
        # inp = f"""
        # VERY OLD MESSAGE:
        # {very_old_messages}

        # Past 5 messages:
        # {last_5_messages}
        
        # Current Input: {user_input}
        # """

        response = asyncio.run(run_ecommerce_agent(user_input=user_input))
        print("AI Response:", response)


        # after this response add user_input and ai_response in weaviate
        # weaviate_input = f"""
        # USER:
        # {user_input}

        # AI:
        # {response}
        # """
        # Store this in weavite
        # ...
        # ...



if __name__ == "__main__":
    chatbot()
   