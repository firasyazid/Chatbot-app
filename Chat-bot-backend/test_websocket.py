import asyncio
import websockets

async def test_websocket():
    uri = "ws://127.0.0.1:8000/ws"   
    async with websockets.connect(uri) as websocket:
          
        message = "Bonjour, bot !"
        await websocket.send(message)
        print(f"Message envoyé : {message}")

         
        response = await websocket.recv()
        print(f"Réponse du bot : {response}")

 
asyncio.run(test_websocket())
