import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";

export class CdkExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "Bucket", {
      removalPolicy: cdk.RemovalPolicy.RETAIN, // RETAIN only for testing purposes
      lifecycleRules: [
        // Cost saving measure
        { abortIncompleteMultipartUploadAfter: cdk.Duration.days(7) },
      ],
    });

    // Here we use a User, but we could also use a Role
    const user = new iam.User(this, "TestUser");
    const accessKey = new iam.AccessKey(this, "AccessKey", { user });

    // this grants our User permission to upload objects in the `somefolder/` dir
    bucket.grantWrite(user, "somefolder/*");

    new cdk.CfnOutput(this, "AccessKeyOutput", {
      value: accessKey.accessKeyId,
    });
    new cdk.CfnOutput(this, "SecretAccessKeyOutput", {
      value: accessKey.secretAccessKey.unsafeUnwrap(),
    });
    new cdk.CfnOutput(this, "BucketNameOutput", {
      value: bucket.bucketName,
    });
  }
}
