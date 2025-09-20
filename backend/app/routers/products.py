from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Product
from ..auth import get_current_admin
from fastapi import UploadFile, File
import shutil
import os





router = APIRouter(prefix="/products", tags=["products"])
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
UPLOAD_DIR = os.path.join(BASE_DIR, "../static/images")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# get all products from database
@router.get("/", response_model=list[Product])
def list_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products

#get a specific product by ID
@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

#create new product in database
@router.post("/", response_model=Product)
def create_product(product: Product, session: Session = Depends(get_session)):
    product.id = None  
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

#Update an existing product with new data.
@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, data: Product, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

#Delete a product from the database (admin only).
@router.delete("/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session), admin=Depends(get_current_admin)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}

#Upload an image for product (admin only).
@router.post("/{product_id}/upload-image")
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    admin=Depends(get_current_admin)
):
    import os, shutil

    product = session.get(Product, product_id)
    if not product:
        return {"error": "Product not found"}

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_DIR = os.path.join(BASE_DIR, "../static/images")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    filename = f"{product_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    product.image_url = f"/static/images/{filename}"
    session.add(product)
    session.commit()
    session.refresh(product)

    return {"image_url": product.image_url}