class APIUtils

{

    constructor(apiContext, loginPayload)
    {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }


    async getToken()
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {data: this.loginPayload});
    
        console.log(loginResponse.status())
        const loginResponseJSON = await loginResponse.json();
        const token = await loginResponseJSON.token;
        console.log(token);
        return token;
    }

    async createOrder(orderPayload)
    {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
    {data: orderPayload,

    headers: 
        {
        'Authorization' : response.token,
        'Content-Type' : 'application/json'
        },
    
    })

    const orderResponseJSON = await orderResponse.json();
    console.log(orderResponseJSON);
    const orderId = await orderResponseJSON.orders[0];
    console.log(orderId);
    response.orderId = orderId;
    return response;
    }
}

module.exports = {APIUtils};