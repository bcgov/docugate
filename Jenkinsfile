pipeline {
    agent none
     environment {
                COMPONENT_NAME = 'Docugate'
                COMPONENT_HOME = '.'
                BUILD_TRIGGER_INCLUDES = '^/'
            }
    options {
        disableResume()
    }
    stages {
        stage('Build') {
            agent { label 'build' }
            steps {
            // we do not need to filter out this pipeline based on file changes..
            // keeping this code snippet as a reference
            //    script {
            //        def filesInThisCommitAsString = sh(script:"git diff --name-only HEAD~1..HEAD | grep  '$BUILD_TRIGGER_INCLUDES' || echo -n ''", returnStatus: false, returnStdout: true).trim()
            //        def hasChangesInPath = (filesInThisCommitAsString.length() > 0)
            //        echo "${filesInThisCommitAsString}"
            //        if (!currentBuild.rawBuild.getCauses()[0].toString().contains('UserIdCause') && !hasChangesInPath){
            //            currentBuild.rawBuild.delete()
            //            error("No changes detected in the component path for $COMPONENT_NAME.")
            //        }
            //    }

               echo "Aborting all running jobs for $COMPONENT_NAME..."
               script {
                   abortAllPreviousBuildInProgress(currentBuild)
               }
               echo "Building ..."
               sh "cd $COMPONENT_HOME/.pipeline && ./npmw ci && ./npmw run build -- --pr=${CHANGE_ID}"
           }
        }
        stage('Deploy (DEV)') {
            agent { label 'deploy' }
            steps {
                echo "Deploying ..."
                sh "cd $COMPONENT_HOME/.pipeline && ./npmw ci && ./npmw run deploy -- --pr=${CHANGE_ID} --env=dev"
            }
        }
        stage('Deploy (TEST)') {
            agent { label 'deploy' }
            input {
                message "Should we continue with deployment to TEST?"
                ok "Yes!"
            }
            steps {
                echo "Deploying ..."
                sh "cd $COMPONENT_HOME/.pipeline && ./npmw ci && ./npmw run deploy -- --pr=${CHANGE_ID} --env=test"
            }
        }
        stage('Deploy (PROD)') {
            agent { label 'deploy' }
            input {
                message "Should we continue with deployment to TEST?"
                ok "Yes!"
            }
            steps {
                echo "Deploying ..."
                sh "cd $COMPONENT_HOME/.pipeline && ./npmw ci && ./npmw run deploy -- --pr=${CHANGE_ID} --env=prod"
            }
        }
    }
}
