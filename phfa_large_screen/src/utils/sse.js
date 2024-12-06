// Server-sent Events
const sseList = []

export const registerSSE = (id, callback) => {
    if (!id) {
        console.error('请传入正确的id')
        return
    }
    const matched = sseList.find(el => el.id === id)
    if (matched) {
        // 已存在相同连接不用重复创建
        if (callback && !matched.callbacks.includes(callback)) {
            matched.callbacks.push(callback)
        }
    } else {

        // const isProd = ["prod", "production"].includes(process.env.NODE_ENV);
        const ssePrefix = GLOBAL_APP_API_BASE_URL;
        const source = new EventSource(
            `${ssePrefix}/CommonController/v1/connectSSE/${id}`
        );
        const obj = {
            source,
            id,
            callbacks: [callback]
        }
        source.onmessage = (event) => {
            obj.callbacks.forEach(cb => {
                if (typeof cb === 'function') cb(event.data)
            })
        };
        source.onopen = (event) => {
            // console.log("SSE:", event.data);
        };

        source.onerror = (event) => {
            console.error("SSE error:", event.data);
        };

        sseList.push(obj)
    }

}