var S3 = require('aws-sdk/clients/s3');
const S3_BUCKET = process.env.S3_BUCKET;

const awsS3Config = 
{
	region :process.env.S3_REGION
};

exports.handler = function(event, context,callback) {
	var picIndex = event.pathParameters.picIndex;
	const s3 = new S3(awsS3Config);
	var params = {Bucket: S3_BUCKET};

	var responseBody = {};  
	var responseStatus = 200;
	var responseContentType = "application/json";

	s3.listObjects(params, function(err, data){
		if(err){
			responseBody = err;
			responseStatus = 417;
		}
		else{
			var bucketContents = data.Contents;
			if(picIndex<0) picIndex = bucketContents.length-1;
			else if (picIndex>=bucketContents.length) picIndex = 0;
			//console.log("Bucket Size :"+bucketContents.length);			
			if(picIndex<bucketContents.length){
				var urlParams = {Bucket: S3_BUCKET, Key: bucketContents[picIndex].Key};
				s3.getSignedUrl('getObject',urlParams, function(err, url){
					if(err){
						responseBody = err;
						responseStatus = 417;
					}
					else{
						responseBody = {
							url: url,
							picIndex: picIndex,
							fileName: bucketContents[picIndex].Key      		
						};								        
					}
				});
			}	    
		}

		var response = {
			"statusCode": responseStatus,
			"headers": {
				"Content-Type": responseContentType
			},
			"body": JSON.stringify(responseBody),
			"isBase64Encoded": false
		}

		callback(null,response);		
	});
}