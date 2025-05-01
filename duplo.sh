#!/bin/bash
duploGet(){
        curl -X GET \
        "$duplo_host/$1" \
        -H "authorization: Bearer $duplo_token" \
        -H 'content-type: application/json'
}

duploToken(){
    duploGet "adminproxy/GetJITAwsConsoleAccessUrl"
}

duploAWSJIT(){
     $(duploToken | jq -r '{AWS_ACCESS_KEY_ID: .AccessKeyId, AWS_SECRET_ACCESS_KEY: .SecretAccessKey, AWS_REGION: .Region, AWS_DEFAULT_REGION: .Region, AWS_SESSION_TOKEN: .SessionToken} | to_entries | map("\(.key)=\(.value)") | .[]' | grep -v null | xargs -I {} echo "export {}")
     aws sts get-caller-identity
}