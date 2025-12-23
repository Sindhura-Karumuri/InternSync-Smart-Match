# 🚀 AWS Phase 1 Implementation Guide

## Overview
This guide will help you implement Phase 1 AWS services for your InternSync Smart Match project:
- **Amazon RDS** - PostgreSQL database
- **Amazon S3** - File storage for resumes
- **Amazon SES** - Email service
- **AWS Lambda** - Serverless backend (optional)

## 🛠️ Prerequisites

### 1. AWS Account Setup
- Create an AWS account at https://aws.amazon.com
- Install AWS CLI: `pip install awscli`
- Configure AWS CLI: `aws configure`

### 2. Required AWS Services Setup

#### A. Amazon RDS (Database)
1. Go to AWS RDS Console
2. Create a new PostgreSQL database:
   - Engine: PostgreSQL 14+
   - Instance class: db.t3.micro (free tier)
   - Database name: `internsync_db`
   - Username: `internsync_user`
   - Password: (choose a secure password)
   - Public access: Yes (for development)
3. Note down the endpoint URL

#### B. Amazon S3 (File Storage)
1. Go to AWS S3 Console
2. Create a new bucket:
   - Bucket name: `internsync-files-[your-unique-id]`
   - Region: us-east-1 (or your preferred region)
   - Block public access: Uncheck (we'll set specific permissions)

#### C. Amazon SES (Email Service)
1. Go to AWS SES Console
2. Verify your email address:
   - Add your HR email (e.g., hr@yourcompany.com)
   - Check your email and click verification link
3. Request production access (optional, for sending to any email)

## 🔧 Installation Steps

### 1. Install Dependencies
```bash
cd InternSync-Smart-Match/pm-internship-prototype2
pip install -r aws-requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update with your AWS credentials:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# RDS Database Configuration
DATABASE_URL=postgresql://internsync_user:your_password@your-rds-endpoint:5432/internsync_db

# S3 Configuration
S3_BUCKET_NAME=internsync-files-your-unique-id
S3_REGION=us-east-1

# SES Configuration
SES_REGION=us-east-1
FROM_EMAIL=hr@yourcompany.com

# Application Configuration
ENVIRONMENT=development
SECRET_KEY=your-secret-key-here
```

### 3. Database Migration
Run the migration script to populate your RDS database:
```bash
python backend/migrate_data.py
```

### 4. Test the Application
Start the AWS-enhanced backend:
```bash
uvicorn backend.main_aws:app --reload --port 8000
```

Visit http://localhost:8000 to see the API documentation.

## 🧪 Testing AWS Features

### 1. Test Database Connection
```bash
curl http://localhost:8000/health
```
Should return: `{"status": "healthy", "database": "connected", "aws": "enabled"}`

### 2. Test File Upload
Use the frontend to upload a resume, or test with curl:
```bash
curl -X POST "http://localhost:8000/upload/resume" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-resume.pdf" \
  -F "student_id=1"
```

### 3. Test Email Functionality
1. Login as HR user
2. Select a candidate
3. Check if selection email is sent

## 🚀 Deployment Options

### Option 1: Traditional Server Deployment
Deploy the FastAPI app on any cloud server (EC2, DigitalOcean, etc.):
```bash
uvicorn backend.main_aws:app --host 0.0.0.0 --port 8000
```

### Option 2: AWS Lambda Serverless Deployment
Install Serverless Framework:
```bash
npm install -g serverless
npm install serverless-python-requirements
```

Deploy to Lambda:
```bash
serverless deploy --stage prod
```

## 📊 Cost Estimation (Monthly)

### Development/Testing:
- **RDS db.t3.micro**: $13-15/month
- **S3 Storage**: $1-3/month (for 1000 resumes)
- **SES**: $0.10 per 1000 emails
- **Lambda**: Free tier covers most development usage
- **Total**: ~$15-20/month

### Production (1000+ users):
- **RDS db.t3.small**: $25-30/month
- **S3 Storage**: $5-10/month
- **SES**: $1-5/month
- **Lambda**: $10-20/month
- **Total**: ~$40-65/month

## 🔍 Monitoring and Maintenance

### 1. CloudWatch Monitoring
- Set up CloudWatch alarms for database connections
- Monitor S3 storage usage
- Track email bounce rates in SES

### 2. Security Best Practices
- Use IAM roles instead of access keys in production
- Enable S3 bucket versioning
- Set up VPC for RDS security
- Enable CloudTrail for audit logging

### 3. Backup Strategy
- RDS automated backups (enabled by default)
- S3 versioning for file protection
- Regular database snapshots

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check RDS security group allows connections from your IP
   - Verify DATABASE_URL format
   - Ensure RDS instance is running

2. **S3 Upload Failed**
   - Check AWS credentials
   - Verify S3 bucket exists and is accessible
   - Check IAM permissions for S3

3. **Email Not Sending**
   - Verify email address in SES
   - Check if you're in SES sandbox mode
   - Verify FROM_EMAIL matches verified address

4. **Lambda Deployment Issues**
   - Check serverless.yml configuration
   - Verify AWS credentials
   - Check function timeout and memory settings

## 📞 Support

For issues with this AWS implementation:
1. Check AWS CloudWatch logs
2. Review the troubleshooting section above
3. Verify all environment variables are set correctly
4. Test each service individually

## 🎯 Next Steps (Phase 2)

After Phase 1 is working:
- Amazon Cognito for advanced authentication
- Amazon Comprehend for resume analysis
- Amazon CloudFront for global CDN
- Amazon SNS for real-time notifications

---

**🎉 Congratulations!** You now have a production-ready, scalable InternSync Smart Match application powered by AWS services!