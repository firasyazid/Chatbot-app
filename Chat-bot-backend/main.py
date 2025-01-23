from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)


manager = ConnectionManager()

# responses
PREDEFINED_RESPONSES = {
    "hello": "Hello! How can I assist you today?",
    "help": "I'm here to answer your questions. Feel free to ask!",
    "thanks": "You're welcome! I'm here to help.",
    "goodbye": "Goodbye! Have a great day.",
}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"User message: {data}")
            
            response = PREDEFINED_RESPONSES.get(data.lower(), f"Bot: I didn't understand your message: {data}")
            
            await asyncio.sleep(1)
            
            await manager.send_message(response, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("WebSocket connection closed")
