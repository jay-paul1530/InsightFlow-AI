import asyncio
from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent


messages = []

def chatbot():
    while True:
        user_input = input("User: ")
        
        if len(messages) > 5:
            messages.pop(0)
            
        context_str = ""
        if messages:
            context_str = "Previous Conversation History:\n"
            for msg in messages:
                context_str += f"User: {msg['User']}\nAI: {msg['AI']}\n"
            context_str += "\nCurrent Request: "
            
        full_input = context_str + user_input
        
        response = asyncio.run(run_ecommerce_agent(user_input=full_input))
        messages.append({"User": user_input, "AI": response})
        print("AI Response:", response)



if __name__ == "__main__":
    chatbot()

