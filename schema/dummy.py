from pydantic import BaseModel


class UserInfo(BaseModel):
    user_name: str
    address: str
    age: int
