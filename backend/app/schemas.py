from typing import List
from pydantic import BaseModel

class OrderItemIn(BaseModel):
    product_id: int
    quantity: int

class OrderIn(BaseModel):
    customer_name: str
    phone: str
    address: str
    items: List[OrderItemIn]
