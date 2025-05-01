#!/bin/bash

TENANT=''
NAMESPACE=''
CONTAINER=''
BACKEND_SERVICE=''

#
# show all pods/services/volumes and etc
#
function getAll() {
  echo "Getting all information about cluster, please wait."
  kubectl get all \
    --context "$TENANT" \
    --namespace="$NAMESPACE"
}

#
# open rfng-backend shell
#
function openShell() {
  echo "Connecting to the rfng-backend shell, please wait."
  kubectl --context "$TENANT" \
    --namespace="$NAMESPACE" \
    exec "$BACKEND_SERVICE" \
    --container="$CONTAINER" \
    --stdin=true \
    --tty=true -- \
    /bin/ash
}

#
# get rfng-backend pod name for further connection
#
function getBackendName() {
  local RESULT=$(
    kubectl get pods -o name \
      --context="$TENANT" \
      --namespace="$NAMESPACE" |
      grep rfng-backend-service
  )
  echo "${RESULT#pod/}"
}

#
# show help
#
function showHelp() {
  echo 'Usage: kubetools [env] [command]'
  echo 'Options for [env]: stage | prod'
  echo 'Options for [command]: list | shell | logFiles | logMonitor | help'
}

#
# get all log files from the log volume via rfng-backend
#
function getLogs() {
  echo "Connecting to the rfng-backend filesystem, please wait."
  echo "$BACKEND_SERVICE"
  kubectl cp --context="$TENANT" \
    --namespace="$NAMESPACE" \
    "${BACKEND_SERVICE}":/app/logs .
}

#
# follow logs
#
function logMonitor() {
  echo "Connecting to the rfng-backend log console, please wait."
  kubectl logs -f --context="$TENANT" \
    --namespace="$NAMESPACE" \
    "${BACKEND_SERVICE}"
}

#
# validate input arguments
#
if [ -z "$1" ] || [ -z "$2" ]; then
  echo 'No arguments supplied'
  echo '---------------------'
  showHelp
  exit
fi

#
# first argument - set environment variables
#
if [ "$1" == prod ]; then
  TENANT=rapidfunnel-tenant-prod01
  NAMESPACE=duploservices-prod01
  CONTAINER=rfng-backend-service
elif [ "$1" == stage ]; then
  TENANT=rapidfunnel-tenant-stage-02
  NAMESPACE=duploservices-stage-02
  CONTAINER=rfng-backend-service
else
  showHelp
  exit 0
fi

#
# second argument - command
#
case $2 in
shell)
  BACKEND_SERVICE=$(getBackendName)
  openShell
  ;;
list)
  getAll
  ;;
logFiles)
  BACKEND_SERVICE=$(getBackendName)
  getLogs
  ;;
logMonitor)
  BACKEND_SERVICE=$(getBackendName)
  logMonitor
  ;;
help) showHelp ;;
*)
  echo 'Wrong command'
  echo '-------------'
  showHelp
  ;;
esac
