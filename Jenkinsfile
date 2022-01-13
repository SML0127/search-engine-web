pipeline {
    agent any
    tools {nodejs "pse-node-js"}
    stages {
        stage('Build') {
            steps {
                sh '''
                echo "Start Build"
                npm run build
                '''
            }
        }
    }
}
