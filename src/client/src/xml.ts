type Method = "POST" | "GET"
export type Status = { status: "ok" | "not ok" }

export function sendRequest(url: string, method: Method, body: object): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const request: XMLHttpRequest = new XMLHttpRequest()

        request.open(method, url, true)
        request.setRequestHeader("Content-Type", "application/json")
        request.send(JSON.stringify(body))

        request.addEventListener("load", () => {
            if (request.status == 200) {
                resolve(JSON.parse(request.response))
            } else {
                reject()
            }
        })
        
        request.addEventListener("error", () => reject())
    })
}