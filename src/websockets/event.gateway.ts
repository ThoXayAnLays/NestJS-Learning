import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/services/auth.service";

@WebSocketGateway(50, {namespace: '/events'})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;
    constructor(private readonly authService: AuthService) {}

    handleEmitSocket({data, event, to}){
        if (to) {
            // this.server.to(to.map((el) => String(el))).emit(event, data);
            this.server.to(to).emit(event, data);
        } else {
            this.server.emit(event, data);
        }
    }

    @SubscribeMessage('message')
    async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data){
        console.log('message', data, socket.id);
        setTimeout(() => {
            this.server.to(socket.data.email + '1').emit('message', data);
        }, 1000);
    }

    afterInit(socket: Socket): any {}

    async handleConnection(socket: Socket) {
        console.log('Client connected', socket.id);
        const authHeader = socket.handshake.headers.authorization;
        if(authHeader && (authHeader as string).split(' ')[1]){
            try{
                socket.data.email = await this.authService.handleVerifyToken(
                    (authHeader as string).split(' ')[1],
                );
                socket.join(socket.data.email);
                console.log('Client connected', socket.id, socket.data.email);
            }catch(e){
                socket.disconnect();
            }
        }else{
            socket.disconnect();
        }
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log('Client disconnected', socket.id, socket.data?.email);
    }
}