import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.main import app, engine
from app.models import Product

client = TestClient(app)

def test_root_endpoint():
    """main root test"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Uni Shop API" in data["message"]

def test_seed_products_exist():
    """Checking if demo products exist in the database"""
    with Session(engine) as session:
        products = session.exec(select(Product)).all()
        assert len(products) > 0  

def test_get_products_endpoint():
    """Testing product list from API"""
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "title" in data[0]
    assert "price" in data[0]
