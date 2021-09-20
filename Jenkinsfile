pipeline {
  agent any
  stages {
    stage('Clone e2e framework') {
      steps {
        git 'https://github.com/Jans888/cypress-e2e.git'
        echo 'e2e project is cloned'
      }
    }

    stage('Install cypress') {
      steps {
        sh '''cd Jarvis
npm install cypress'''
        echo 'Cypress is installed'
      }
    }

  }
}