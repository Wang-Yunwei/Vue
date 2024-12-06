// websocket

const urlPrefix1 = 'ws://192.168.0.122:5000/ws'
const urlPrefix2 = 'ws://192.168.0.119:48889/ws' // https

let ws = null

let heartCheckTimer
function heartCheck() {
    if (heartCheckTimer) clearTimeout(heartCheckTimer)
    heartCheckTimer = setTimeout(() => {
        const payload = {
            action: 'PING_MESSAGE'
        };
        ws.send(JSON.stringify(payload))

        heartCheck()
    }, 15000);

}

let reconnectTimer
function reconnect(callback) {
    if (heartCheckTimer) clearTimeout(heartCheckTimer)
    if (reconnectTimer) clearTimeout(reconnectTimer)
    console.log('ws: try reconnect')
    reconnectTimer = setTimeout(() => {
        createWebSocket(callback)
    }, 5000);
}

export function createWebSocket(callback) {
    const token = localStorage.getItem('token')
    if (!token) {
        console.error('用户未登入,无法启动WebSocket')
        return
    }
    const url = `${urlPrefix1}?token=${token}`
    ws = new WebSocket(url);
    ws.onmessage = (msg) => {
        try {
            const data = JSON.parse(msg?.data) || {}
            const escapeActions = ['SERVER_CONNECTED','SERVER_ERROR','PONG_MESSAGE']
            if (!escapeActions.includes(data.action)) {
                callback(data)
            }
        } catch (error) { }
    }
    ws.onopen = () => {
        console.log('ws 连接')
        heartCheck(ws)
    }
    ws.onerror = (err) => {
        console.log('ws 错误', err)
        reconnect(callback)
    }
    ws.onclose = () => {
        console.log('关闭websocket')
        if (heartCheckTimer) clearTimeout(heartCheckTimer)
        if (reconnectTimer) clearTimeout(reconnectTimer)
        ws = null
    }
    return ws
}
