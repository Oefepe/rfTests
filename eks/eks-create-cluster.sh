
# Create VPC using Cloud formation
https://docs.aws.amazon.com/eks/latest/userguide/creating-a-vpc.html#create-vpc

# Create Cluster with node group
aws eks create-cluster --name eks-cluster-demo --region us-west-1 --role-arn arn:aws:iam::574309367192:role/eksClusterRole --resources-vpc-config subnetIds=subnet-0e2278382e7d84973,subnet-0d18b276b088626af,subnet-05dd9fdb8003330d2,subnet-00c34e5aa7d13ac1a --logging '{"clusterLogging":[{"types":["api"],"enabled":true}, {"types":["audit","authenticator","controllerManager","scheduler"],"enabled":false}]}' --tags name=eks-cluster --kubernetes-version 1.26 || aws eks wait cluster-active --name eks-cluster-demo && aws eks create-nodegroup --cluster-name eks-cluster-demo --nodegroup-name eks-cluster-demo-node --region us-west-1 --kubernetes-version 1.26 --scaling-config minSize=1,maxSize=2,desiredSize=1 --disk-size 20 --subnets {subnet-0e2278382e7d84973,subnet-0d18b276b088626af,subnet-05dd9fdb8003330d2,subnet-00c34e5aa7d13ac1a} --instance-types t2.small --ami-type AL2_x86_64 --remote-access ec2SshKey=prasanti-aws-california-key,sourceSecurityGroups=sg-0fd242037750e5189 --node-role arn:aws:iam::574309367192:role/eksNodeGroup --tags name=eks-cluster-node && aws eks wait nodegroup-active --cluster-name eks-cluster-demo --nodegroup-name eks-cluster-demo-node

# Delet Node group & cluster
aws eks delete-nodegroup --region us-west-1 --cluster-name eks-cluster-demo --nodegroup-name eks-cluster-demo-node || aws eks wait nodegroup-deleted --cluster-name eks-cluster-demo --nodegroup-name eks-cluster-demo-node && aws eks delete-cluster --region us-west-1 --name eks-cluster-demo && aws eks wait cluster-deleted --name eks-cluster-demo

# aws eks --region us-west-1 update-kubeconfig --name eks-cluster-demo
