from fastapi import APIRouter
from schema.dummy import UserInfo

router = APIRouter()


@router.get("/dummy")
async def dummy():
    return {"message": "Dummy API"}


@router.get("/dummy_with_parameter")
async def dummy_with_parameter(user_name: str):
    reply = f"Hi, {user_name}! This is dummy API."
    return {"message": reply}


# @router.post("/dummy_with_post_body")
# async def dummy_with_post_body(user_name: str, address: str, age: int):
#     reply = f"Hi, {user_name}! You live in {address} and you are {age} years old."
#     return {"message": reply}


@router.post("/dummy_with_post_with_schema")
async def dummy_with_post_with_schema(user_info: UserInfo):
    reply = f"Hi, {user_info.user_name}! You live in {user_info.address} and you are {user_info.age} years old."
    return {"message": reply}
