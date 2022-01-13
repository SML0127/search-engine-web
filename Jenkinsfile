pipeline {
    agent any
    tools {nodejs "nodejs"}
    stages {
        stage('Build') {
            steps {
                sh '''
                echo "Start Build"
                echo "npm run build"
                '''
            }
        }
    }
}
