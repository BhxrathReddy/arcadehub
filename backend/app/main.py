from fastapi import FastAPI

app = FastAPI(
    title="ArcadeHub API"
)

@app.get("/")
def root():
    return {"message": "ArcadeHub API Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}