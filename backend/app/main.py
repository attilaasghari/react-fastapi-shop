from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from .database import init_db, engine
from .models import Product
from .routers import products, orders
from .auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os



app = FastAPI(title="Uni Shop API", version="0.1.0")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# CORS for Vite dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(auth_router, prefix="/api")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")



@app.on_event("startup")
def on_startup():
    init_db()
    seed_if_empty()

def seed_if_empty():
    with Session(engine) as session:
        count = len(session.exec(select(Product)).all())
        if count == 0:
            demo = [
                Product(title="mechanical keyboard", description="RGB mechanical keyboard", price=49.99, image_url="https://picsum.photos/seed/keyboard/400/300", inventory=20, category="لوازم جانبی"),
                Product(title="gaming mouse", description="sesivity 16000 DPI", price=29.99, image_url="https://picsum.photos/seed/mouse/400/300", inventory=35, category="لوازم جانبی"),
                Product(title="headset", description="Noise Canceling", price=59.90, image_url="https://picsum.photos/seed/headset/400/300", inventory=15, category="صوتی"),
                Product(title="monitor 27 inch", description="IPS, 144Hz", price=199.00, image_url="https://picsum.photos/seed/monitor/400/300", inventory=8, category="نمایشگر"),
            ]
            for p in demo:
                session.add(p)
            session.commit()

@app.get("/")
def root():
    return {"message": "mobin Shop API is running. See /docs"}
