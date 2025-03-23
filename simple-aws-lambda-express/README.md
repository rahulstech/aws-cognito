# Serverless with AWS Lambda and API Gateway

## Route Level Throttling (Rate Limit) via AWS CLI



### Terminology

- **Burst Limit** 

- **Rate Limit**

### Levels of Throttling

1. **Application + Region Level** 

2. **Default Api Level**

3. **Rout + HTTP Method Level**

### Create Route Level Throttling using AWS CLI

```sh
aws apigatewayv2 update-stage --api-id <api id> --stage-name <stage name> --region <api region> --route-settings '{"HTTP-METHOD /the/route" : {"ThrottlingBurstLimit": 50, "ThrottlingRateLimit": 100}}'
```