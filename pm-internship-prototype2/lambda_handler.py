# lambda_handler.py - AWS Lambda handler for serverless deployment
import json
import os
from mangum import Mangum
from main_aws import app

# Create the Lambda handler
handler = Mangum(app, lifespan="off")

def lambda_handler(event, context):
    """
    AWS Lambda handler function
    """
    try:
        # Process the request through Mangum
        response = handler(event, context)
        return response
    except Exception as e:
        print(f"Lambda error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }