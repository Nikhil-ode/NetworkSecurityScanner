"""WebSocket consumers for live scan output."""
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ScanConsumer(AsyncJsonWebsocketConsumer):
    """Pushes incremental scan progress to a connected client.

    URL: ws://<host>/ws/scans/<scan_id>/
    Group: scan_<scan_id>
    """

    async def connect(self):
        self.scan_id = self.scope["url_route"]["kwargs"].get("scan_id")
        self.group_name = f"scan_{self.scan_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json({"type": "connected", "scan_id": self.scan_id})

    async def disconnect(self, code):
        group = getattr(self, "group_name", None)
        if group:
            await self.channel_layer.group_discard(group, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # Echo back pings; clients may also use this for control messages.
        await self.send_json({"type": "echo", "data": content})

    # Group event handler (called by channel_layer.group_send with type="scan.event")
    async def scan_event(self, event):
        await self.send_json(event.get("data", {}))
