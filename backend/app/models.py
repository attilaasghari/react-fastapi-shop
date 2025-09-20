from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str = ""
    price: float
    image_url: Optional[str] = None
    inventory: int = 0
    category: Optional[str] = None

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    product_id: int
    quantity: int
    price: float

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_name: str
    customer_address: str
    phone: str
    items: str  
    total_price: float
    status: str = "pending"  # pending / shipped / delivered
    created_at: datetime = Field(default_factory=datetime.utcnow)
