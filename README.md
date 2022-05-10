Conclusions from meeting with Laurent

- SRE Team will create the necessary IAM role used by the Messaging API
- SRE Team will expose the above role and the S3 bucket name to the Messaging API
- Dev Apps team will implement all the logic themselves on the Messaging API codebase
- No additional REST API will be added at the MFS layer (all logic will happen on the Messaging API server side)

TODO:

- Add CDK example (set up Bucket and restricted Role)
- Add more docs comparing singlepart and multipart uploads
