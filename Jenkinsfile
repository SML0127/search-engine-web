pipeline {
    agent any
    stages {
        stage('Build') {
            nodejs(nodeJSInstallationNAme: 'pse-node-js'){
                sh 'npm install && npm run build'
            }
            steps {
                sh '''
                echo "Start Build"
                echo "npm run build"
                '''
            }
        }
    }
}
