from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..models import Order
from ..database import get_session
from ..auth import get_current_admin
import json
from fastapi import Body
from fastapi import Query
from ..models import Product
from pydantic import BaseModel


class OrderUpdate(BaseModel):
    status: str

router = APIRouter(prefix="/orders", tags=["orders"])

# list of all orders for admin
@router.get("/")
def get_orders(session: Session = Depends(get_session), admin=Depends(get_current_admin)):
    orders = session.exec(select(Order)).all()
    return orders

# change order status
@router.put("/{order_id}")
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    session: Session = Depends(get_session),
    admin=Depends(get_current_admin)
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = order_data.status
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

# delete order
@router.delete("/{order_id}")
def delete_order(order_id: int, session: Session = Depends(get_session), admin=Depends(get_current_admin)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    session.delete(order)
    session.commit()
    return {"detail": "Order deleted"}

# create new order (for customers)
@router.post("/")
def create_order(
    customer_name: str = Body(...),
    phone: str = Body(...),
    address: str = Body(...),
    items: list = Body(...),
    session: Session = Depends(get_session)
):
    total_price = sum([i.get('price', 0) * i.get('quantity', 1) for i in items])
    order = Order(
        customer_name=customer_name,
        phone=phone,
        customer_address=address,
        items=json.dumps(items),
        total_price=total_price,
        status="در حال انتظار"
    )
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

# track order by customer
@router.get("/track/")
def track_order(order_id: int = Query(None), phone: str = Query(None), session: Session = Depends(get_session)):
    if not order_id and not phone:
        return {"error": "Please enter your order number or contact number."}
    
    query = select(Order)
    if order_id:
        query = query.where(Order.id == order_id)
    if phone:
        query = query.where(Order.phone == phone)

    orders = session.exec(query).all()
    return orders