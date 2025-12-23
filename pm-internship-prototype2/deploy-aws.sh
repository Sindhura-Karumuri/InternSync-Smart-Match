#!/bin/bash
# deploy-aws.sh - AWS deployment script

echo "🚀 Starting AWS Phase 1 Deployment for InternSync Smart Match"

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set your RDS connection string"
    exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "❌ AWS_ACCESS_KEY_ID environment variable is not set"
    exit 1
fi

if [ -z "$S3_BUCKET_NAME" ]; then
    echo "❌ S3_BUCKET_NAME environment variable is not set"
    exit 1
fi

echo "✅ Environment variables check passed"

# Install AWS requirements
echo "📦 Installing AWS dependencies..."
pip install -r aws-requirements.txt

# Run database migration
echo "🗄️ Running database migration..."
python backend/migrate_data.py

# Create S3 bucket if it doesn't exist
echo "🪣 Setting up S3 bucket..."
aws s3 mb s3://$S3_BUCKET_NAME --region $AWS_REGION 2>/dev/null || echo "Bucket already exists or creation failed"

# Set S3 bucket policy for public read access to files
echo "🔐 Configuring S3 bucket policy..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET_NAME/resumes/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $S3_BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

# Verify SES email address
echo "📧 Setting up SES email verification..."
aws ses verify-email-identity --email-address $FROM_EMAIL --region $SES_REGION

# Deploy using Serverless Framework (optional)
if command -v serverless &> /dev/null; then
    echo "🚀 Deploying with Serverless Framework..."
    serverless deploy --stage prod
else
    echo "⚠️ Serverless Framework not found. Skipping Lambda deployment."
    echo "You can run the FastAPI app directly with: uvicorn backend.main_aws:app --host 0.0.0.0 --port 8000"
fi

echo "✅ AWS Phase 1 deployment completed!"
echo ""
echo "🎉 Your InternSync Smart Match application now includes:"
echo "   ✅ RDS PostgreSQL Database"
echo "   ✅ S3 File Storage for resumes"
echo "   ✅ SES Email Service"
echo "   ✅ Lambda-ready serverless architecture"
echo ""
echo "🔗 Next steps:"
echo "   1. Update your frontend API endpoints to use the new backend"
echo "   2. Test file uploads and email functionality"
echo "   3. Monitor AWS costs and usage"
echo "   4. Set up CloudWatch logging for monitoring"
echo ""
echo "💡 To run locally: uvicorn backend.main_aws:app --reload --port 8000"