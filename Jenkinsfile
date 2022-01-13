pipeline {
    agent any

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
