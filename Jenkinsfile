pipeline {
    agent any
    tools {nodejs "nodejs"}
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
