
exports.handler = function(event, context,callback) {
	var picIndex = event.params.querystring.picIndex;
	var params = {Bucket: S3_BUCKET};
	s3.listObjects(params, function(err, data){
		if(err){
			callback(null,JSON.parse(JSON.stringify(err,null,2)));
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
							//console.log(err);
						    callback(null,JSON.parse(JSON.stringify(err,null,2)));
						}
						else{
							var returnData = {
					        	url: url,
				      			picIndex: picIndex,
				      			fileName: bucketContents[picIndex].Key      		
					    	};
					    	//console.log(returnData);
					    	callback(null,JSON.parse(JSON.stringify(returnData,null,2)));					        
						}
			        	//console.log('the url of the image is', url);		        
			        });
			}	    
		}
	});
}